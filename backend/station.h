#ifndef STATION_HEADER_H
#define STATION_HEADER_H

typedef struct {
    int id;
    char name[10];
    int waiting;   
    int drop;     
} Station;

#endif
