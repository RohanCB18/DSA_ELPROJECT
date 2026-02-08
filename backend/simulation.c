#include <stdio.h>
#include <limits.h>
#include "simulation.h"
#include "station.h"
#include "bus.h"
#include "events.h"

#define STATIONS 6
#define INF 9999
#define CONGESTION_THRESHOLD 5

int graph[STATIONS][STATIONS] = {
    {0, 15, 25, 0, 0, 0},
    {0, 0, 20, 20, 0, 0},
    {0, 0, 0, 0, 20, 0},
    {0, 0, 0, 0, 15, 20},
    {0, 0, 0, 15, 0, 0},
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
    int i;
    Bus bus1 = {1, {0}, 0, 0, 0, 1};    
    
    int step = 0;
    int maxSteps = 30;
    int b1_done;
    int sid;
    Station *s;
    int capacity_left;

    // Initialize logic and get Inputs (Silent for frontend)
    for (i = 0; i < STATIONS; i++) {
        scanf("%d %d", &stations[i].waiting, &stations[i].drop);
    }

    bus1.routeLength = dijkstra(0, 5, graph, bus1.route);

    printf("\n--- SIMULATION START ---\n");
    printf("Bus 1 Route (Scheduled): ");
    for(i=0; i<bus1.routeLength; i++) printf("S%d ", bus1.route[i]); 
    printf("(Len: %d)\n", bus1.routeLength);

    if(bus1.routeLength == 0) { 
        // Keep error output as it might be useful for debugging
        printf("Error: Bus 1 has no path!\n"); 
        return; 
    }

    while (step < maxSteps) {
        b1_done = (bus1.currentIndex >= bus1.routeLength);

        if (b1_done) {
            break;
        }

        if (bus1.active && bus1.currentIndex < bus1.routeLength) {
            sid = bus1.route[bus1.currentIndex];
            s = &stations[sid];

            // 1. DROP Logic
            int flow_drop = 0;
            if (bus1.passengers > 0) {
                if (bus1.currentIndex == bus1.routeLength - 1) {
                    flow_drop = bus1.passengers; // Terminal: Everyone out
                } else if (s->drop > 0) {
                    flow_drop = (s->drop > bus1.passengers) ? bus1.passengers : s->drop;
                }
                bus1.passengers -= flow_drop;
                if(s->drop > 0) s->drop -= flow_drop;
            }

            
            int flow_board = 0;
            if (bus1.currentIndex < bus1.routeLength - 1) {
                capacity_left = BUS_CAPACITY - bus1.passengers;
                if (capacity_left > 0 && s->waiting > 0) {
                    flow_board = (s->waiting < capacity_left) ? s->waiting : capacity_left;
                    bus1.passengers += flow_board;
                    s->waiting -= flow_board;
                }
            }

            // Log event after flow changes
            emit_event(step, bus1.busId, s->name, s->waiting, bus1.passengers);
            bus1.currentIndex++;
        }

        step++;
    }

    printf("\nSIMULATION FINISHED at Step %d\n", step);
}
