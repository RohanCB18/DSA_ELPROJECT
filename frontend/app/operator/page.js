'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import CityMap from '@/components/map/CityMap';
import BusLayer from '@/components/map/BusLayer';
import { useSimulation } from '@/hooks/useSimulation';
import {
    Play,
    RotateCcw,
    Settings2,
    Users,
    MapPin,
    Activity,
    Radio,
    AlertTriangle,
    Info
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
        logs,
        buses,
        activeRoutes,
        isSimulating,
        startSimulation,
        resetSimulation
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

    const handleSimulate = () => {
        if (!isValidInput) return;
        startSimulation(stations);
    };

    return (
        <main className="h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col overflow-hidden">
            <Navbar />

            <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-6 py-4 gap-6 min-h-0">

                {/* Left Panel: Controls & Logs */}
                <div className="flex flex-col gap-4 w-full lg:w-1/3 min-h-0">

                    {/* Control Panel */}
                    <section className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col flex-shrink-0 max-h-[60%]">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-xl">
                            <div className="flex items-center gap-2">
                                <Settings2 className="w-4 h-4 text-gray-500" />
                                <h2 className="text-sm font-semibold text-gray-900">Config</h2>
                            </div>
                            {isSimulating && (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 border border-green-100 rounded-full">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Live</span>
                                </div>
                            )}
                        </div>

                        <div className="overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200">
                            <div className="grid grid-cols-1 gap-2">
                                {stations.map((s, idx) => (
                                    <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                                        <div className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-700 rounded font-bold text-xs ring-1 ring-blue-100">
                                            {s.id}
                                        </div>

                                        <div className="flex-1 grid grid-cols-2 gap-2">
                                            <div className="relative">
                                                <Users className="w-3 h-3 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="text"
                                                    value={s.waiting}
                                                    onChange={(e) => handleChange(idx, 'waiting', e.target.value)}
                                                    disabled={isSimulating}
                                                    placeholder="Wait"
                                                    className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400 transition-all text-center text-gray-900"
                                                />
                                            </div>
                                            <div className="relative">
                                                <MapPin className="w-3 h-3 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="text"
                                                    value={s.drop}
                                                    onChange={(e) => handleChange(idx, 'drop', e.target.value)}
                                                    disabled={isSimulating}
                                                    placeholder="Drop"
                                                    className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400 transition-all text-center text-gray-900"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-3 border-t border-gray-100 bg-gray-50/50 rounded-b-xl space-y-2">
                            <button
                                onClick={handleSimulate}
                                disabled={!isValidInput || isSimulating}
                                className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all transform active:scale-95
                                    ${isValidInput && !isSimulating
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <Play className="w-4 h-4 fill-current" />
                                {isSimulating ? 'Simulating...' : 'Start Simulation'}
                            </button>
                            <button
                                onClick={resetSimulation}
                                className="w-full flex items-center justify-center gap-2 py-2 bg-white border-2 border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset
                            </button>
                        </div>
                    </section>

                    {/* System Feed */}
                    <section className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col flex-1 min-h-0">
                        <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-xl">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-gray-500" />
                                <h2 className="text-sm font-semibold text-gray-900">System Events</h2>
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono">Real-time</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-200 bg-gray-50/30">
                            {logs.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                                    <Radio className="w-8 h-8 opacity-20" />
                                    <span className="text-xs">System Idle. Waiting for input...</span>
                                </div>
                            )}
                            {logs.map((log) => (
                                <div key={log.id} className="flex gap-3 text-xs animate-in slide-in-from-left-2 duration-300">
                                    <div className={`mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full ring-2 ring-opacity-20
                                         ${log.type === 'alert' ? 'bg-red-500 ring-red-500' : ''}
                                         ${log.type === 'success' ? 'bg-green-500 ring-green-500' : ''}
                                         ${log.type === 'route' ? 'bg-blue-500 ring-blue-500' : ''}
                                         ${log.type === 'info' || log.type === 'system' ? 'bg-gray-400 ring-gray-400' : ''}
                                     `} />
                                    <div className="flex flex-col gap-0.5">
                                        <span className={`
                                            ${log.type === 'alert' ? 'text-red-700 font-medium' : ''}
                                            ${log.type === 'success' ? 'text-green-700 font-medium' : ''}
                                            ${log.type === 'route' ? 'text-blue-700' : ''}
                                            ${log.type === 'info' || log.type === 'system' ? 'text-gray-600' : ''}
                                         `}>
                                            {log.message}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Panel: Map */}
                <div className="w-full lg:w-2/3 flex flex-col min-h-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative group">
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-gray-200/50">
                        <h2 className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-blue-500" />
                            Live City View
                        </h2>
                    </div>
                    <CityMap />
                    <BusLayer buses={buses} activeRoutes={activeRoutes} />

                    {/* Map Legend overlay */}
                    <div className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-md p-2 rounded-lg shadow-sm border border-gray-200/50 text-[10px] space-y-1.5 min-w-[100px]">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-gray-600">Bus 1 (Regular)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-gray-600">Bus 2 (Regular)</span>
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
