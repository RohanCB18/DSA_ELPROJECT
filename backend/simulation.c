#include <stdio.h>
#include <string.h>
#include "simulation.h"
#include "station.h"
#include "bus.h"
#include "events.h"

#define STATIONS 6
#define BUS_CAPACITY 100

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

typedef struct {
    int id;
    int path[STATIONS];
    int len;
    char name[10];
} Route;

Route routes[3] = {
    {1, {0, 1, 3, 5}, 4, "R1"},
    {2, {0, 2, 4, 5}, 4, "R2"},
    {3, {0, 1, 2, 4, 5}, 5, "R3"}
};

typedef struct {
    int id;
    int waiting;
} HeapNode;

HeapNode heap[STATIONS];
int heapSize = 0;

void heap_swap(int i, int j) {
    HeapNode temp = heap[i];
    heap[i] = heap[j];
    heap[j] = temp;
}

void heapify(int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < heapSize && heap[left].waiting > heap[largest].waiting)
        largest = left;

    if (right < heapSize && heap[right].waiting > heap[largest].waiting)
        largest = right;

    if (largest != i) {
        heap_swap(i, largest);
        heapify(largest);
    }
}

void build_heap() {
    heapSize = 0;
    for (int i = 0; i < STATIONS; i++) {
        heap[heapSize].id = i;
        heap[heapSize].waiting = stations[i].waiting;
        heapSize++;
    }
    for (int i = heapSize / 2 - 1; i >= 0; i--) {
        heapify(i);
    }
}

int calculate_score(Route *r) {
    int score = 0;
    for (int i = 1; i < r->len - 1; i++) {
        int sid = r->path[i];
        score += stations[sid].waiting;
    }
    return score;
}

void start_simulation() {
    int i;
    Bus bus1;
    memset(&bus1, 0, sizeof(Bus));
    bus1.busId = 1;
    bus1.active = 1;
    
    int step = 0;
    int maxSteps = 30;
    int b1_done;
    int sid;
    
    for (i = 0; i < STATIONS; i++) {
        if (scanf("%d %d", &stations[i].waiting, &stations[i].drop) != 2) {
             stations[i].waiting = 0;
             stations[i].drop = 0;
        }
    }

    int bestRouteIdx = 0;
    int maxScore = -1;
    
    for (i = 0; i < 3; i++) {
        int score = calculate_score(&routes[i]);
        
        if (score > maxScore) {
            maxScore = score;
            bestRouteIdx = i;
        } else if (score == maxScore) {
            if (routes[i].len < routes[bestRouteIdx].len) {
                bestRouteIdx = i;
            }
        }
    }

    Route selected = routes[bestRouteIdx];
    
    bus1.routeLength = selected.len;
    for(i=0; i<selected.len; i++) {
        bus1.route[i] = selected.path[i];
    }
    bus1.currentIndex = 0;

    printf("ROUTE_SELECTED ROUTE_ID=%d ROUTE_NAME=%s PATH=", selected.id, selected.name);
    for(i=0; i<selected.len; i++) {
        printf("S%d%s", selected.path[i], (i<selected.len-1)?",":"");
    }
    printf(" SCORE=%d REASON=MAX_INTERMEDIATE_DEMAND\n", maxScore);
    
    if (bus1.routeLength == 0) return;

    printf("\n--- SIMULATION START ---\n");

    int next_passenger_id = 101; 
    
    while (step < maxSteps) {
        b1_done = (bus1.currentIndex >= bus1.routeLength);

        if (b1_done) {
            break;
        }

        if (bus1.active && bus1.currentIndex < bus1.routeLength) {
            sid = bus1.route[bus1.currentIndex];
            Station *s = &stations[sid];

            int flow_drop = 0;
            if (s->drop > 0 && bus1.passengers > 0) {
                 flow_drop = (s->drop < bus1.passengers) ? s->drop : bus1.passengers;
                 
                 if (flow_drop < bus1.passengers) {
                     memmove(bus1.passengerIDs, bus1.passengerIDs + flow_drop, (bus1.passengers - flow_drop) * sizeof(int));
                 }
                 for(int k = bus1.passengers - flow_drop; k < bus1.passengers; k++) {
                     bus1.passengerIDs[k] = 0;
                 }
                 
                 bus1.passengers -= flow_drop;
                 s->drop -= flow_drop;
            }

            int flow_board = 0;
            if (sid != 5) {
                int capacity_left = BUS_CAPACITY - bus1.passengers;
                if (capacity_left > 0 && s->waiting > 0) {
                     flow_board = (s->waiting < capacity_left) ? s->waiting : capacity_left;
                     
                     for(int k=0; k<flow_board; k++) {
                        bus1.passengerIDs[bus1.passengers + k] = next_passenger_id++;
                     }
                     
                     bus1.passengers += flow_board;
                     s->waiting -= flow_board;
                }
            }

            emit_event(step, bus1.busId, s->name, s->waiting, s->drop, bus1.passengers, bus1.passengerIDs);
            
            build_heap();

            bus1.currentIndex++;
        }

        step++;
    }

    printf("\nSIMULATION FINISHED at Step %d\n", step);
}
