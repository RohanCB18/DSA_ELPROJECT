'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import CityMap from '@/components/map/CityMap';
import BusLayer from '@/components/map/BusLayer';
import { useSimulation } from '@/hooks/useSimulation';
import LinkedList from '@/components/dsa/LinkedList';
import HashMap from '@/components/dsa/HashMap';
import StationQueue from '@/components/dsa/StationQueue';
import PriorityQueue from '@/components/dsa/heap';
import { Map as MapIcon, RotateCcw, Play } from 'lucide-react';

export default function OperatorPage() {
    const [stationsInput, setStationsInput] = useState([
        { waiting: '', drop: '' },
        { waiting: '', drop: '' },
        { waiting: '', drop: '' },
        { waiting: '', drop: '' },
        { waiting: '', drop: '' },
        { waiting: '', drop: '' },
    ]);

    const {
        stations,
        buses,
        heap,
        selectedRoute,
        isSimulating,
        isCompleted,
        currentStepIndex,
        totalSteps,
        startSimulation,
        nextStep,
        resetSimulation,
    } = useSimulation();

    // Helper to get current index of bus 1 for Queue Viz
    const getBusCurrentIndex = (busId) => {
        if (!buses[busId] || !selectedRoute) return -1;
        return selectedRoute.path.indexOf(buses[busId].location);
    };

    const handleInputChange = (index, field, value) => {
        const newInputs = [...stationsInput];
        newInputs[index][field] = value;
        setStationsInput(newInputs);
    };

    const handleStart = () => {
        const payload = stationsInput.map(s => ({
            waiting: s.waiting || 0,
            drop: s.drop || 0
        }));
        startSimulation(payload);
    };

    const handleReset = () => {
        resetSimulation();
        setStationsInput([
            { waiting: '', drop: '' },
            { waiting: '', drop: '' },
            { waiting: '', drop: '' },
            { waiting: '', drop: '' },
            { waiting: '', drop: '' },
            { waiting: '', drop: '' },
        ]);
    };

    const isFormValid = stationsInput.every(s =>
        s.waiting !== '' && s.drop !== '' && !isNaN(parseInt(s.waiting)) && !isNaN(parseInt(s.drop))
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-4 space-y-4">

                {/* 1. Top Control Panel: Inputs & Controls */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">

                        {/* Inputs Grid */}
                        <div className="flex-grow grid grid-cols-3 md:grid-cols-6 gap-2 w-full md:w-auto">
                            {stationsInput.map((station, idx) => (
                                <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-100 min-w-[100px]">
                                    <div className="font-bold text-xs text-slate-700 mb-1 text-center">S{idx}</div>
                                    <div className="flex gap-1">
                                        <input
                                            type="number"
                                            placeholder="Wait"
                                            className="w-full px-1 py-1 text-xs border rounded focus:ring-1 focus:ring-indigo-500"
                                            value={station.waiting}
                                            onChange={(e) => handleInputChange(idx, 'waiting', e.target.value)}
                                            disabled={isSimulating}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Drop"
                                            className="w-full px-1 py-1 text-xs border rounded focus:ring-1 focus:ring-indigo-500"
                                            value={station.drop}
                                            onChange={(e) => handleInputChange(idx, 'drop', e.target.value)}
                                            disabled={isSimulating}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 shrink-0">
                            {!isSimulating ? (
                                <button
                                    onClick={handleStart}
                                    disabled={!isFormValid}
                                    className={`px-6 py-2 rounded-lg transition flex items-center gap-2 font-medium ${isFormValid
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                        }`}
                                >
                                    <Play size={18} /> Start Simulation
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={nextStep}
                                        disabled={isCompleted}
                                        className={`px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 ${isCompleted
                                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                            }`}
                                    >
                                        <Play size={18} /> {isCompleted ? 'Finished' : 'Next Step'}
                                    </button>
                                    <button
                                        onClick={handleReset}
                                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition flex items-center gap-2"
                                    >
                                        <RotateCcw size={18} /> Reset
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-slate-800 px-1">Live Data Structures (Single Bus Mode)</h2>

                {/* 2. Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">

                    {/* Left Column (Data Structures) - Spans 6/12 */}
                    <div className="lg:col-span-6 flex flex-col gap-4">

                        {/* A. Linked List (Passengers) */}
                        <LinkedList
                            busId={1}
                            passengers={buses[1]?.passengers || []}
                            active={true}
                        />

                        {/* B. Grid for HashMap & Heap */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                            {/* HashMap */}
                            <HashMap stations={isSimulating || isCompleted ? stations : []} />

                            {/* Heap */}
                            <PriorityQueue heap={isSimulating || isCompleted ? heap : []} />
                        </div>

                        {/* C. Route Info Panel (If Active) */}
                        {isSimulating && selectedRoute && (
                            <div className="bg-slate-900 text-white p-4 rounded-lg shadow-md border border-slate-700">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs uppercase tracking-wider text-slate-400">Selected Route</span>
                                    <span className="font-bold text-indigo-400">{selectedRoute.name}</span>
                                </div>
                                <div className="text-sm font-mono mb-1">
                                    Path: {selectedRoute.path.map(s => `S${s}`).join(' → ')}
                                </div>
                                <div className="text-xs text-slate-400">
                                    Score: {selectedRoute.score} • Reason: {selectedRoute.reason}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (Map & Queue) - Spans 6/12 */}
                    <div className="lg:col-span-6 flex flex-col gap-4">

                        {/* Map Container */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex-grow h-[400px] flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-semibold flex items-center gap-2 text-slate-700">
                                    <MapIcon className="w-5 h-5 text-indigo-600" />
                                    Live City View
                                </h2>
                                <div className="text-sm font-mono text-slate-500">
                                    Step: <span className="text-slate-900 font-bold">{currentStepIndex + 1}</span> / {totalSteps || '?'}
                                </div>
                            </div>

                            <div className="relative flex-grow bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                                <CityMap
                                    stations={stations}
                                    activeRoute={selectedRoute ? selectedRoute.path : []}
                                />
                                <BusLayer buses={buses} />
                            </div>
                        </div>

                        {/* Route Queue (Linear Queue) */}
                        <StationQueue
                            busId={1}
                            route={selectedRoute ? selectedRoute.path : []}
                            currentIdx={getBusCurrentIndex(1)}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
