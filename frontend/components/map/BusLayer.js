import React from 'react';
import { BusFront } from 'lucide-react';

const BusIcon = () => (
    <div className="bg-indigo-600 text-white p-1.5 rounded-md shadow-lg border border-indigo-700">
        <BusFront size={20} />
    </div>
);

export default function BusLayer({ buses }) {
    const COORDS = {
        0: { x: 10, y: 50 },
        1: { x: 35, y: 25 },
        2: { x: 35, y: 75 },
        3: { x: 65, y: 25 },
        4: { x: 65, y: 75 },
        5: { x: 90, y: 50 },
    };

    return (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            {Object.entries(buses).map(([busId, busData]) => {
                const stationId = busData.location;
                const coords = COORDS[stationId];

                if (!coords) return null;

                return (
                    <div
                        key={busId}
                        className="absolute transition-all duration-700 ease-in-out"
                        style={{
                            left: `${coords.x}%`,
                            top: `${coords.y}%`,
                            transform: 'translate(-50%, -50%)',
                            zIndex: 50
                        }}
                    >
                        <div className="relative group">
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                Bus {busId} • {busData.passengers ? busData.passengers.length : 0} pax
                            </div>

                            <div className="drop-shadow-md hover:scale-110 transition-transform cursor-pointer pointer-events-auto">
                                <BusIcon />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
