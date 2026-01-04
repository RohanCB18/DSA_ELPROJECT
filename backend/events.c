#include <stdio.h>
#include "events.h"

void emit_event(
    int step,
    int busId,
    char *station,
    int waiting,
    int onboard
) {
    printf(
        "EVENT STEP=%d BUS=%d STATION=%s DEMAND_SIGNAL=%d ONBUS=%d\n",
        step, busId, station, waiting, onboard
    );
}
