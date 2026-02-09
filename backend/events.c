#include <stdio.h>
#include "events.h"

void emit_event(
    int step,
    int busId,
    char *station,
    int waiting,
    int drop,
    int onboard,
    int *passengerIDs
) {
    printf(
        "EVENT STEP=%d BUS=%d STATION=%s DEMAND_SIGNAL=%d DROP=%d ONBUS=%d PASSENGERS=",
        step, busId, station, waiting, drop, onboard
    );
    for(int i=0; i<onboard; i++) {
        printf("%d%s", passengerIDs[i], (i<onboard-1)?",":"");
    }
    printf("\n");
    fflush(stdout);
}
