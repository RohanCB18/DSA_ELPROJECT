import React from 'react';
import BusIcon from './BusIcon';
import { STATION_COORDINATES, CONNECTION_PATHS } from '@/lib/mapData';

export default function BusLayer({ buses, activeRoutes }) {

    return (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">

            <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                {activeRoutes.map((route, idx) => {
                    let pathData = CONNECTION_PATHS[route.id];
                    if (!pathData) {
                        // try reverse
                        const [from, to] = route.id.split('_');
                        pathData = CONNECTION_PATHS[`${to}_${from}`];
                    }

                    if (!pathData) return null;

                    let strokeColor = '#94a3b8'; // Default slate-400
                    // Google Maps Traffic Colors
                    if (route.busId == 1) strokeColor = '#4285F4'; // Google Blue
                    else if (route.busId == 2) strokeColor = '#34A853'; // Google Green
                    else if (route.busId == 3) strokeColor = '#EA4335'; // Google Red (Heavy Traffic/Emergency)

                    return (
                        <path
                            key={`${route.id}-${idx}`}
                            d={pathData.d}
                            stroke={strokeColor}
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                            className="transition-all duration-500 opacity-60"
                        />
                    );
                })}
            </svg>

            {Object.entries(buses).map(([busId, busData]) => {
                const stationId = busData.location;
                // Fix key lookup: simulation uses ints (0), mapData uses strings ("S0")
                const coords = STATION_COORDINATES[`S${stationId}`] || STATION_COORDINATES[stationId];

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
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                Bus {busId} • {busData.passengers ? busData.passengers.length : 0} pax
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                            </div>

                            <div className="drop-shadow-md hover:scale-110 transition-transform">
                                <BusIcon busId={parseInt(busId)} />
                            </div>
                        </div>
                    </div>
                );
            })}

        </div>
    );
}
