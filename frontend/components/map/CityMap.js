import React from 'react';

const CityMap = ({ stations = [], activeRoute = [] }) => {
    const COORDS = {
        0: { x: 10, y: 50, label: 'S0' },
        1: { x: 35, y: 25, label: 'S1' },
        2: { x: 35, y: 75, label: 'S2' },
        3: { x: 65, y: 25, label: 'S3' },
        4: { x: 65, y: 75, label: 'S4' },
        5: { x: 90, y: 50, label: 'S5' },
    };

    const SEGMENTS = [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 1, to: 3 },
        { from: 1, to: 2 },
        { from: 2, to: 4 },
        { from: 3, to: 5 },
        { from: 4, to: 5 },
    ];

    const isActiveSegment = (from, to) => {
        if (!activeRoute || activeRoute.length < 2) return false;
        for (let i = 0; i < activeRoute.length - 1; i++) {
            if (activeRoute[i] === from && activeRoute[i + 1] === to) return true;
            if (activeRoute[i] === to && activeRoute[i + 1] === from) return true;
        }
        return false;
    };

    return (
        <div className="w-full h-full bg-[#f3f4f6] relative select-none">
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                {SEGMENTS.map((seg, i) => (
                    <line
                        key={`base-${i}`}
                        x1={COORDS[seg.from].x}
                        y1={COORDS[seg.from].y}
                        x2={COORDS[seg.to].x}
                        y2={COORDS[seg.to].y}
                        stroke="#d1d5db"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                ))}

                {SEGMENTS.map((seg, i) => (
                    isActiveSegment(seg.from, seg.to) && (
                        <line
                            key={`active-${i}`}
                            x1={COORDS[seg.from].x}
                            y1={COORDS[seg.from].y}
                            x2={COORDS[seg.to].x}
                            y2={COORDS[seg.to].y}
                            stroke="#4f46e5"
                            strokeWidth="3"
                            strokeLinecap="round"
                            className="drop-shadow-sm transition-all duration-500"
                        />
                    )
                ))}

                {Object.entries(COORDS).map(([id, pos]) => {
                    const isStationActive = activeRoute.includes(parseInt(id));
                    return (
                        <g key={id}>
                            <circle
                                cx={pos.x}
                                cy={pos.y}
                                r={isStationActive ? 3 : 2}
                                fill={isStationActive ? "#ffffff" : "#f9fafb"}
                                stroke={isStationActive ? "#4f46e5" : "#6b7280"}
                                strokeWidth={isStationActive ? 1 : 0.5}
                                className="transition-all duration-300"
                            />
                            <text
                                x={pos.x}
                                y={pos.y + 6}
                                fontSize="3"
                                textAnchor="middle"
                                fill="#374151"
                                className="font-mono font-bold"
                            >
                                {pos.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default CityMap;
