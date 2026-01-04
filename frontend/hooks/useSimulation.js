import { useState, useRef, useCallback } from 'react';

export function useSimulation() {
    const [logs, setLogs] = useState([]);
    const [buses, setBuses] = useState({});
    const [activeRoutes, setActiveRoutes] = useState([]);
    const [isSimulating, setIsSimulating] = useState(false);

    const abortControllerRef = useRef(null);

    const addLog = (message, type = 'info') => {
        setLogs(prev => [...prev, { message, type, id: Date.now() + Math.random() }]);
    };

    const startSimulation = async (stationsInput) => {
        resetSimulation();
        setIsSimulating(true);
        addLog('Simulation starting...', 'system');

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

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');

                buffer = lines.pop();

                for (const line of lines) {
                    if (line.trim()) processLine(line.trim());
                    await new Promise(r => setTimeout(r, 600));
                }
            }

            addLog('Simulation completed.', 'system');
            setIsSimulating(false);

        } catch (error) {
            if (error.name === 'AbortError') {
                addLog('Simulation reset.', 'system');
            } else {
                console.error('Simulation error:', error);
                addLog(`Error: ${error.message}`, 'error');
                setIsSimulating(false);
            }
        }
    };

    const processLine = (line) => {
        console.log('Backend:', line);

        if (line.startsWith('EVENT')) {
            const parts = {};
            line.split(' ').slice(1).forEach(part => {
                const [key, val] = part.split('=');
                parts[key] = val;
            });

            const { BUS, STATION } = parts;
            if (BUS && STATION) {
                updateBusPosition(BUS, STATION);
            }

        } else if (line.startsWith('ALERT')) {
            addLog(line, 'alert');

        } else if (line.startsWith('Route')) {
            addLog(line, 'route');

        } else if (line.includes('Total Passengers')) {
            addLog(line, 'success');
        }
    };

    const updateBusPosition = (busId, stationId) => {
        setBuses(prev => {
            const prevStation = prev[busId]?.location;

            if (prevStation && prevStation !== stationId) {
                highlightRoute(prevStation, stationId, busId);
            }

            return {
                ...prev,
                [busId]: { location: stationId }
            };
        });
    };

    const highlightRoute = (from, to, busId) => {
        const key1 = `${from}_${to}`;
        const key2 = `${to}_${from}`;

        const routeKey = key1;

        setActiveRoutes(prev => {
            return [...prev, { id: routeKey, busId }];
        });

        setTimeout(() => {
            setActiveRoutes(prev => prev.filter(r => r.id !== routeKey || r.busId !== busId));
        }, 1000);
    };

    const resetSimulation = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setLogs([]);
        setBuses({});
        setActiveRoutes([]);
        setIsSimulating(false);
    }, []);

    return {
        logs,
        buses,
        activeRoutes,
        isSimulating,
        startSimulation,
        resetSimulation
    };
}
