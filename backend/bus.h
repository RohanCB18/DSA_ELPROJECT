#ifndef BUS_HEADER_H
#define BUS_HEADER_H

#define MAX_ROUTE 10
#define BUS_CAPACITY 100

typedef struct {
    int busId;
    int route[MAX_ROUTE];
    int routeLength;
    int currentIndex;
    int passengers;
    int passengerIDs[BUS_CAPACITY];
    int active; 
} Bus;

#endif
