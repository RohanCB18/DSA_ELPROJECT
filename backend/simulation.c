#include <stdio.h>
#include <limits.h>
#include "simulation.h"
#include "station.h"
#include "bus.h"
#include "events.h"

#define STATIONS 6
#define INF 9999
#define CONGESTION_THRESHOLD 40
#define DEMAND_FACTOR 3

int graph[STATIONS][STATIONS] = {
    {0, 15, 25, 0, 0, 0},
    {15, 0, 20, 20, 0, 0},
    {25, 20, 0, 0, 20, 0},
    {0, 20, 0, 0, 15, 20},
    {0, 0, 20, 15, 0, 20},
    {0, 0, 0, 0, 0, 0}
};

Station stations[STATIONS] = {
    {0, "S0", 0, 0},
    {1, "S1", 0, 0},
    {2, "S2", 0, 0},
    {3, "S3", 0, 0},
    {4, "S4", 0, 0},
    {5, "S5", 0, 0}
};

int heap[STATIONS];
int heapSize = 0;

void heap_swap(int i, int j) {
    int temp = heap[i];
    heap[i] = heap[j];
    heap[j] = temp;
}

void heap_push(int stationId) {
    heap[heapSize] = stationId;
    int curr = heapSize;
    heapSize++;
    while (curr > 0) {
        int parent = (curr - 1) / 2;
        if (stations[heap[curr]].waiting > stations[heap[parent]].waiting) {
            heap_swap(curr, parent);
            curr = parent;
        } else {
            break;
        }
    }
}

void update_congestion_heap() {
    heapSize = 0;
    for (int i = 0; i < STATIONS; i++) {
        heap_push(i);
    }
}

int get_most_congested_station() {
    if (heapSize == 0) return -1;
    return heap[0];
}

int dijkstra(int src, int dest, int adj[STATIONS][STATIONS], int pathOut[]) {
    int dist[STATIONS], prev[STATIONS], visited[STATIONS];
    for (int i = 0; i < STATIONS; i++) {
        dist[i] = INF;
        prev[i] = -1;
        visited[i] = 0;
    }

    dist[src] = 0;

    for (int count = 0; count < STATIONS - 1; count++) {
        int u = -1, min = INF;
        for (int v = 0; v < STATIONS; v++) {
            if (!visited[v] && dist[v] <= min) {
                min = dist[v];
                u = v;
            }
        }

        if (u == -1 || u == dest) break;
        visited[u] = 1;

        for (int v = 0; v < STATIONS; v++) {
            if (!visited[v] && adj[u][v] && dist[u] != INF && dist[u] + adj[u][v] < dist[v]) {
                dist[v] = dist[u] + adj[u][v];
                prev[v] = u;
            }
        }
    }

    int tempPath[STATIONS], len = 0, curr = dest;
    if (prev[curr] == -1 && src != dest) return 0;

    while (curr != -1) {
        tempPath[len++] = curr;
        curr = prev[curr];
    }

    for (int i = 0; i < len; i++) {
        pathOut[i] = tempPath[len - 1 - i];
    }
    return len;
}

void start_simulation() {
    int i, j;
    int smartGraph[STATIONS][STATIONS];
    Bus bus1 = {1, {0}, 0, 0, 0, 1};
    Bus bus2 = {2, {0}, 0, 0, 0, 1};
    Bus bus3 = {3, {0}, 0, 0, 0, 0};
    int step = 0;
    int maxSteps = 30;
    int b1_done, b2_done, b3_done;
    int worstStation;
    int reliefDest;
    int reliefGraph[STATIONS][STATIONS];
    int sid;
    Station *s;
    int capacity_left, boarded;

    printf("Initializing Simulation with %d Stations...\n", STATIONS);

    printf("--- OPERATOR INPUT (Demand Configuration) ---\n");
    for (i = 0; i < STATIONS; i++) {
        printf("Station %s (Waiting Drop): ", stations[i].name);
        scanf("%d %d", &stations[i].waiting, &stations[i].drop);
    }

    update_congestion_heap();

    bus1.routeLength = dijkstra(0, 5, graph, bus1.route);

    for(i=0; i<STATIONS; i++) {
        for(j=0; j<STATIONS; j++) {
            if(graph[i][j] > 0) {
                smartGraph[i][j] = graph[i][j] + (stations[j].waiting + stations[j].drop) * DEMAND_FACTOR;
            } else {
                smartGraph[i][j] = 0;
            }
        }
    }
    bus2.routeLength = dijkstra(0, 5, smartGraph, bus2.route);

    printf("\n--- SIMULATION START ---\n");
    printf("Bus 1 Route (Scheduled): ");
    for(i=0; i<bus1.routeLength; i++) printf("S%d ", bus1.route[i]);
    printf("(Len: %d)\n", bus1.routeLength);
    
    printf("Bus 2 Route (Smart): ");
    for(i=0; i<bus2.routeLength; i++) printf("S%d ", bus2.route[i]);
    printf("(Len: %d)\n", bus2.routeLength);

    if(bus1.routeLength == 0) { printf("Error: Bus 1 has no path!\n"); return; }
    if(bus2.routeLength == 0) { printf("Error: Bus 2 has no path!\n"); return; }

    while (step < maxSteps) {
        b1_done = (bus1.currentIndex >= bus1.routeLength);
        b2_done = (bus2.currentIndex >= bus2.routeLength);
        b3_done = (!bus3.active) || (bus3.currentIndex >= bus3.routeLength);

        if (b1_done && b2_done && b3_done) {
            break;
        }

        update_congestion_heap();
        worstStation = get_most_congested_station();

        if (!bus3.active && worstStation != -1 && stations[worstStation].waiting > CONGESTION_THRESHOLD) {
            printf("ALERT: Congestion at %s (%d waiting > %d threshold). Deploying Bus 3.\n",
                   stations[worstStation].name, stations[worstStation].waiting, CONGESTION_THRESHOLD);

            reliefDest = STATIONS - 1;

            for(i=0; i<STATIONS; i++) {
                for(j=0; j<STATIONS; j++) {
                    if(graph[i][j] > 0) {
                        reliefGraph[i][j] = graph[i][j] + (stations[j].waiting * 2);
                    } else {
                        reliefGraph[i][j] = 0;
                    }
                }
            }

            bus3.active = 1;
            bus3.passengers = 0;
            bus3.currentIndex = 0;
            bus3.routeLength = dijkstra(worstStation, reliefDest, reliefGraph, bus3.route);
            
            printf("🚑 Bus 3 Route: ");
            for(i=0; i<bus3.routeLength; i++) printf("S%d ", bus3.route[i]);
            printf("(Len: %d)\n", bus3.routeLength);
        }

        if (bus1.active && bus1.currentIndex < bus1.routeLength) {
            sid = bus1.route[bus1.currentIndex];
            s = &stations[sid];

            if (bus1.currentIndex == 0) {
                capacity_left = BUS_CAPACITY - bus1.passengers;
                boarded = (s->waiting < capacity_left) ? s->waiting : capacity_left;
                bus1.passengers += boarded;
                s->waiting -= boarded;
            }

            if (bus1.currentIndex == bus1.routeLength - 1) {
                bus1.passengers = 0;
            }

            emit_event(step, bus1.busId, s->name, s->waiting, bus1.passengers);
            bus1.currentIndex++;
        }

        if (bus2.active && bus2.currentIndex < bus2.routeLength && (step % 2 == 0)) {
            sid = bus2.route[bus2.currentIndex];
            s = &stations[sid];

            if (bus2.currentIndex == 0) {
                capacity_left = BUS_CAPACITY - bus2.passengers;
                boarded = (s->waiting < capacity_left) ? s->waiting : capacity_left;
                bus2.passengers += boarded;
                s->waiting -= boarded;
            }

            if (bus2.currentIndex == bus2.routeLength - 1) {
                bus2.passengers = 0;
            }

            emit_event(step, bus2.busId, s->name, s->waiting, bus2.passengers);
            bus2.currentIndex++;
        }

        if (bus3.active) {
            if (bus3.currentIndex >= bus3.routeLength) {
                bus3.active = 0;
            } else {
                sid = bus3.route[bus3.currentIndex];
                s = &stations[sid];

                if (bus3.currentIndex == 0) {
                    capacity_left = BUS_CAPACITY - bus3.passengers;
                    boarded = (s->waiting < capacity_left) ? s->waiting : capacity_left;
                    bus3.passengers += boarded;
                    s->waiting -= boarded;
                }

                if (bus3.currentIndex == bus3.routeLength - 1) {
                    bus3.passengers = 0;
                    printf("✅ Bus 3 completed relief mission.\n");
                    bus3.active = 0;
                }

                emit_event(step, bus3.busId, s->name, s->waiting, bus3.passengers);
                bus3.currentIndex++;
            }
        }

        step++;
    }

    printf("\nSIMULATION FINISHED at Step %d\n", step);
}
