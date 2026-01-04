#ifndef EVENTS_HEADER_H
#define EVENTS_HEADER_H

void emit_event(
    int step,
    int busId,
    char *station,
    int waiting,
    int onboard
);

#endif
