#include <stdio.h>
#include "events.h"

void emit_event(
    int step,
    int busId,
    char *station,
    int waiting,
    int onboard,
    int *passengerIDs
) {
    printf(
        "EVENT STEP=%d BUS=%d STATION=%s DEMAND_SIGNAL=%d ONBUS=%d PASSENGERS=",
        step, busId, station, waiting, onboard
    );
    for(int i=0; i<onboard; i++) {
        printf("%d%s", passengerIDs[i], (i<onboard-1)?",":"");
    }
    printf("\n");
}
