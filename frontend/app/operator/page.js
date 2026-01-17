'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import CityMap from '@/components/map/CityMap';
import BusLayer from '@/components/map/BusLayer';
import { useSimulation } from '@/hooks/useSimulation';
import LinkedList from '@/components/dsa/LinkedList';
import HashMap from '@/components/dsa/HashMap';
import StationQueue from '@/components/dsa/StationQueue';
import PriorityQueue from '@/components/dsa/PriorityQueue';
import {
    Play,
    RotateCcw,
    Settings2,
    StepForward,
    MapPin,
    AlertTriangle
} from 'lucide-react';

export default function OperatorPage() {
    const [stations, setStations] = useState([
        { id: 'S0', waiting: '', drop: '' },
        { id: 'S1', waiting: '', drop: '' },
        { id: 'S2', waiting: '', drop: '' },
        { id: 'S3', waiting: '', drop: '' },
        { id: 'S4', waiting: '', drop: '' },
        { id: 'S5', waiting: '', drop: '' },
    ]);

    const {
        stations: simStations,
        buses,
        heap,
        isSimulating,
        isCompleted,
        startSimulation,
        nextStep,
        resetSimulation,
        getBusRoute,
        getCurrentStationIdx
    } = useSimulation();

    const handleChange = (index, field, value) => {
        if (!/^\d*$/.test(value)) return;
        const updated = [...stations];
        updated[index][field] = value;
        setStations(updated);
    };

    const isValidInput = stations.every(
        (s) =>
            s.waiting !== '' &&
            s.drop !== '' &&
            Number(s.waiting) >= 0 &&
            Number(s.drop) >= 0
    );

    const handleStart = () => {
        if (!isValidInput) return;
        startSimulation(stations);
    };

    return (
        <main className="h-screen bg-gray-50 flex flex-col overflow-hidden">
            <Navbar />

            <div className="flex-1 flex max-w-[1920px] mx-auto w-full px-6 py-4 gap-6 min-h-0">

                {/* LEFT PANEL (60%) */}
                <div className="w-[60%] flex flex-col gap-4 overflow-y-auto pr-2">

                    {/* Top Row: Config & Controls */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                <Settings2 size={16} /> Configuration
                            </h2>
                            <div className="flex gap-2">
                                {!isSimulating && !isCompleted && (
                                    <button
                                        onClick={handleStart}
                                        disabled={!isValidInput}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all
                                            ${isValidInput ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' : 'bg-gray-100 text-gray-400'}`}
                                    >
                                        <Play size={14} /> Start Simulation
                                    </button>
                                )}

                                {isSimulating && !isCompleted && (
                                    <button
                                        onClick={nextStep}
                                        className="px-6 py-1.5 rounded-md text-sm font-bold bg-green-600 text-white hover:bg-green-700 shadow-md flex items-center gap-2 animate-pulse"
                                    >
                                        <StepForward size={16} fill="currentColor" /> SIMULATE (NEXT STEP)
                                    </button>
                                )}

                                {isCompleted && (
                                    <div className="px-4 py-1.5 rounded-md text-sm font-bold bg-gray-800 text-white flex items-center gap-2">
                                        Simulation Completed
                                    </div>
                                )}

                                {(isSimulating || isCompleted) && (
                                    <button
                                        onClick={resetSimulation}
                                        className="px-3 py-1.5 rounded-md text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    >
                                        <RotateCcw size={14} /> Reset
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Input Grid */}
                        <div className="grid grid-cols-6 gap-2">
                            {stations.map((s, idx) => (
                                <div key={s.id} className="bg-gray-50 p-2 rounded border border-gray-100">
                                    <div className="font-bold text-center text-gray-700 mb-1">{s.id}</div>
                                    <input
                                        placeholder="Wait"
                                        value={s.waiting}
                                        onChange={(e) => handleChange(idx, 'waiting', e.target.value)}
                                        disabled={isSimulating || isCompleted}
                                        className="w-full text-xs p-1 mb-1 border rounded text-center text-gray-900 bg-white"
                                    />
                                    <input
                                        placeholder="Drop"
                                        value={s.drop}
                                        onChange={(e) => handleChange(idx, 'drop', e.target.value)}
                                        disabled={isSimulating || isCompleted}
                                        className="w-full text-xs p-1 border rounded text-center text-gray-900 bg-white"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Data Structures Section */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Live Data Structures (Single Bus Mode)</h2>

                        {/* 1. Linked List (Bus 1 Only) */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-700">Passenger List (Linked List)</h3>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Bus Capacity: 10</span>
                            </div>
                            <LinkedList
                                key={1}
                                busId={1}
                                passengers={buses[1]?.passengers || []}
                                active={true}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* 2. Hash Map */}
                            <HashMap stations={isSimulating || isCompleted ? simStations : []} />

                            {/* 3. Priority Queue */}
                            <PriorityQueue heap={isSimulating || isCompleted ? heap : []} />
                        </div>

                        {/* 4. Queue (Bus 1 Route Only) */}
                        <div className="pt-2 pb-20">
                            <StationQueue
                                key={1}
                                busId={1}
                                route={getBusRoute(1)}
                                currentIdx={getCurrentStationIdx(1)}
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL (40%) - MAP */}
                <div className="w-[40%] flex flex-col min-h-0 bg-white rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-gray-200/50">
                        <h2 className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-blue-500" />
                            Live City View
                        </h2>
                    </div>

                    <CityMap />
                    <BusLayer buses={buses} activeRoutes={[]} />
                    {/* Note: activeRoutes highlighting disabled for step-mode to keep it clean, or can re-enable */}

                    <div className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-md p-2 rounded-lg shadow-sm border border-gray-200/50 text-[10px] space-y-1.5 min-w-[100px]">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-gray-600">Bus 1 (Regular)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-gray-600">Bus 2 (Smart)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="text-gray-600 font-medium">Bus 3 (Relief)</span>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
