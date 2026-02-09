import { useState, useRef, useCallback } from 'react';

export function useSimulation() {
    const [buses, setBuses] = useState({});
    const [stations, setStations] = useState([]);
    const [heap, setHeap] = useState([]);
    const [activeRoutes, setActiveRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);

    const [isSimulating, setIsSimulating] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const [history, setHistory] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);

    const abortControllerRef = useRef(null);

    const startSimulation = async (stationsInput) => {
        resetSimulation();
        setIsSimulating(true);
        const initialStations = stationsInput.map((s, i) => ({
            id: i,
            name: `S${i}`,
            waiting: parseInt(s.waiting),
            drop: parseInt(s.drop)
        }));
        setStations(initialStations);
        setHeapFromStations(initialStations);

        abortControllerRef.current = new AbortController();

        try {
            const response = await fetch('/api/simulation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stations: stationsInput }),
                signal: abortControllerRef.current.signal,
            });

            if (!response.body) throw new Error('No readable stream');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let rawLines = [];

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop();
                rawLines.push(...lines.filter(l => l.trim()));
            }

            parseSimulationOutput(rawLines, initialStations);

        } catch (error) {
            console.error('Simulation error:', error);
            setIsSimulating(false);
        }
    };

    const parseSimulationOutput = (lines, initialStations) => {
        let timeline = [];
        let currentStepEvents = [];
        let lastStep = -1;
        let routeInfo = null;

        const getStep = (line) => {
            const match = line.match(/STEP=(\d+)/);
            return match ? parseInt(match[1]) : -1;
        };

        lines.forEach(line => {
            if (line.startsWith('ROUTE_SELECTED')) {
                const parts = {};
                line.split(' ').slice(1).forEach(p => {
                    const [k, v] = p.split('=');
                    parts[k] = v;
                });

                routeInfo = {
                    id: parseInt(parts.ROUTE_ID),
                    name: parts.ROUTE_NAME,
                    path: parts.PATH.split(',').map(s => parseInt(s.replace('S', ''))),
                    score: parseInt(parts.SCORE),
                    reason: parts.REASON
                };
                setSelectedRoute(routeInfo);
            }
            else if (line.startsWith('EVENT')) {
                const step = getStep(line);
                if (step !== lastStep) {
                    if (currentStepEvents.length > 0) {
                        timeline.push({ step: lastStep, events: [...currentStepEvents] });
                    }
                    currentStepEvents = [];
                    lastStep = step;
                }
                currentStepEvents.push(line);
            }
        });

        if (currentStepEvents.length > 0) {
            timeline.push({ step: lastStep, events: currentStepEvents });
        }

        setHistory(timeline);
        setCurrentStepIndex(-1);
    };

    const nextStep = () => {
        if (currentStepIndex >= history.length - 1) {
            setIsCompleted(true);
            setIsSimulating(false);
            return;
        }

        const nextIdx = currentStepIndex + 1;
        const stepData = history[nextIdx];
        setCurrentStepIndex(nextIdx);

        if (!stepData) return;

        processEvents(stepData.events);

        if (nextIdx >= history.length - 1) {
            setIsCompleted(true);
        }
    };

    const processEvents = (events) => {
        const newBuses = { ...buses };
        let stationsUpdate = [...stations];

        events.forEach(line => {
            if (line.startsWith('EVENT')) {
                const parts = {};
                line.split(' ').slice(1).forEach(p => {
                    const [k, v] = p.split('=');
                    parts[k] = v;
                });

                const busId = parseInt(parts.BUS);
                const stationName = parts.STATION;
                const stationId = parseInt(stationName.replace('S', ''));
                const waiting = parseInt(parts.DEMAND_SIGNAL);
                const onBus = parseInt(parts.ONBUS);

                // Parse real passenger IDs
                let passengerList = [];
                if (parts.PASSENGERS) {
                    passengerList = parts.PASSENGERS.split(',')
                        .filter(id => id.trim() !== '')
                        .map(id => ({ id: `P${id}`, dest: 'S5' }));
                } else {
                    // Fallback if empty or not present
                    passengerList = Array(onBus).fill({ id: '?', dest: 'S5' });
                }

                newBuses[busId] = {
                    id: busId,
                    location: stationId,
                    passengers: passengerList,
                    routePath: selectedRoute ? selectedRoute.path : []
                };

                const sIdx = stationsUpdate.findIndex(s => s.id === stationId);
                if (sIdx !== -1) {
                    stationsUpdate[sIdx] = { ...stationsUpdate[sIdx], waiting: waiting };
                }
            }
        });

        setBuses(newBuses);
        setStations(stationsUpdate);
        setHeapFromStations(stationsUpdate);
    };

    const setHeapFromStations = (currentStations) => {
        const sorted = [...currentStations].sort((a, b) => b.waiting - a.waiting);
        setHeap(sorted);
    };

    const getBusRoute = (busId) => {
        return selectedRoute ? selectedRoute.path : [];
    };

    const resetSimulation = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setBuses({});
        setHistory([]);
        setCurrentStepIndex(-1);
        setIsSimulating(false);
        setIsCompleted(false);
        setActiveRoutes([]);
        setHeap([]);
        setSelectedRoute(null);
    }, []);

    return {
        stations,
        buses,
        heap,
        selectedRoute,
        isSimulating,
        isCompleted,
        currentStepIndex,
        totalSteps: history.length,
        startSimulation,
        nextStep,
        resetSimulation,
        getBusRoute
    };
}
