import { useState, useRef, useCallback } from 'react';

export function useSimulation() {
    const [buses, setBuses] = useState({});
    const [stations, setStations] = useState([]); // Array of {id, name, waiting, drop}
    const [heap, setHeap] = useState([]); // For Priority Queue
    const [activeRoutes, setActiveRoutes] = useState([]);

    const [isSimulating, setIsSimulating] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // Playback State
    const [history, setHistory] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);

    const abortControllerRef = useRef(null);

    const startSimulation = async (stationsInput) => {
        resetSimulation();
        setIsSimulating(true);
        // Initialize stations state with input
        const initialStations = stationsInput.map((s, i) => ({
            id: i,
            name: `S${i}`,
            waiting: parseInt(s.waiting),
            drop: parseInt(s.drop)
        }));
        setStations(initialStations);
        updateHeap(initialStations);

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
                buffer = lines.pop(); // Keep incomplete line
                rawLines.push(...lines.filter(l => l.trim()));
            }

            parseSimulationOutput(rawLines, initialStations);

        } catch (error) {
            console.error('Simulation error:', error);
            setIsSimulating(false);
        }
    };

    const parseSimulationOutput = (lines, initialStations) => {
        // We need to group lines by STEP
        // Lines look like: EVENT STEP=0 ...
        // We will build a 'timeline' array where each index is a step
        // containing the state Delta or absolute state for that step.

        let timeline = [];
        let currentStepEvents = [];
        let lastStep = -1;

        // Helper to extract step count
        const getStep = (line) => {
            const match = line.match(/STEP=(\d+)/);
            return match ? parseInt(match[1]) : -1;
        };

        lines.forEach(line => {
            if (line.startsWith('EVENT')) {
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
            // We can also capture ALERT lines if needed and attach to current step
            else if (line.startsWith('ALERT')) {
                currentStepEvents.push(line);
            }
            else if (line.startsWith('Route') || line.includes('Route')) {
                currentStepEvents.push(line);
            }
        });

        // Push last batch
        if (currentStepEvents.length > 0) {
            timeline.push({ step: lastStep, events: currentStepEvents });
        }

        setHistory(timeline);
        setCurrentStepIndex(-1); // Ready to start
        // Auto-advance to step 0 immediately so user sees initial state? 
        // Or wait for first click? User said "every click advances".
        // Let's set index to -1, so first click does Step 0.
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

        // Apply changes based on events in this step
        processEvents(stepData.events);

        // Check if this was the last step
        if (nextIdx >= history.length - 1) {
            setIsCompleted(true);
        }
    };

    const processEvents = (events) => {
        const newBuses = { ...buses };
        let stationsUpdate = [...stations];

        events.forEach(line => {
            if (line.startsWith('EVENT')) {
                // EVENT STEP=0 BUS=1 STATION=S0 DEMAND_SIGNAL=0 ONBUS=10
                const parts = {};
                line.split(' ').slice(1).forEach(p => {
                    const [k, v] = p.split('=');
                    parts[k] = v;
                });

                const busId = parseInt(parts.BUS);
                const stationName = parts.STATION;
                const stationId = parseInt(stationName.replace('S', ''));
                const waiting = parseInt(parts.DEMAND_SIGNAL); // This is the REMAINING waiting at station
                const onBus = parseInt(parts.ONBUS);

                // Update Bus Location & Passengers
                if (!newBuses[busId]) newBuses[busId] = { route: [] };

                // Track route history for visual
                const currentRoute = newBuses[busId].route || [];
                // If this station isn't last added, add it (simple dedup)
                // Actually for queue visual, we probably want the full PLANNED route.
                // But the backend doesn't emit full route easily in EVENT line.
                // We'll simulate the "Queue" by showing visited stations vs upcoming (inferred possibly?)
                // Or we can just track where it IS.

                // Update Bus State
                newBuses[busId] = {
                    ...newBuses[busId],
                    id: busId,
                    location: stationId,
                    passengers: Array(onBus).fill({ dest: '?' }) // We don't have individual destinations from C, just count. Mocking for visual.
                };

                // Update Station Waiting Count
                // Find station by ID and update
                const sIdx = stationsUpdate.findIndex(s => s.id === stationId);
                if (sIdx !== -1) {
                    stationsUpdate[sIdx] = { ...stationsUpdate[sIdx], waiting: waiting };
                }

                // Highlight route on map
                // (Disabled for step-by-step to reduce chaos, or keep?)
                // updateBusPosition handles highlighting in original code.
            }
            if (line.startsWith('Bus') && line.includes('Route')) {
                // Capture route info if possible (e.g. "Bus 1 Route: S0 S1 ...")
                // Parsing this allows us to populate the 'Queue' for each bus
                const match = line.match(/Bus (\d) Route.*: (.*) \(Len/);
                if (match) {
                    const bId = parseInt(match[1]);
                    const routeStr = match[2].trim(); // "S0 S1 S3..."
                    const routeArr = routeStr.split(' ').map(s => parseInt(s.replace('S', '')));

                    if (!newBuses[bId]) newBuses[bId] = {};
                    newBuses[bId].fullRoute = routeArr;
                }
            }
        });

        setBuses(newBuses);
        setStations(stationsUpdate);
        updateHeap(stationsUpdate);
    };

    const updateHeap = (currentStations) => {
        // Simple manual heapify for visualization
        // Sort by waiting desc
        const sorted = [...currentStations].sort((a, b) => b.waiting - a.waiting);
        setHeap(sorted);
    };

    // Helper to get bus route queue
    const getBusRoute = (busId) => {
        // Return full route if known, or visited + current
        return buses[busId]?.fullRoute || [];
    };

    const getCurrentStationIdx = (busId) => {
        const loc = buses[busId]?.location;
        const route = buses[busId]?.fullRoute || [];
        return route.indexOf(loc);
    };

    const updateBusPosition = (busId, stationId) => {
        // Legacy support if needed, mostly handled in processEvents now
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
    }, []);

    return {
        stations,
        buses,
        heap,
        isSimulating,
        isCompleted,
        currentStepIndex,
        totalSteps: history.length,
        startSimulation,
        nextStep,
        resetSimulation,
        getBusRoute,
        getCurrentStationIdx
    };
}
