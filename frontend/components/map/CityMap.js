import React from 'react';

const CityMap = () => {
    // Google Maps Style Constants
    const COLORS = {
        background: '#e5e7eb', // Google Maps neutral gray
        road: '#ffffff',
        roadBorder: '#d1d5db', // faint gray border for roads
        terminal: '#ffffff',
        hub: '#ffffff',
        stop: '#ffffff',
        label: '#374151',
    };

    const stations = [
        { id: 'S0', label: 'S0 Terminal', x: '10%', y: '50%', type: 'terminal' },
        { id: 'S1', label: 'S1 Stop', x: '35%', y: '25%', type: 'stop' },
        { id: 'S2', label: 'S2 Stop', x: '35%', y: '75%', type: 'stop' },
        { id: 'S3', label: 'S3 Hub', x: '65%', y: '35%', type: 'hub' },
        { id: 'S4', label: 'S4 Stop', x: '60%', y: '85%', type: 'stop' },
        { id: 'S5', label: 'S5 Terminal', x: '90%', y: '50%', type: 'terminal' },
    ];

    // SVG Map Drawing
    return (
        <div className="w-full h-full bg-[#ebebeb] relative select-none">
            {/* Background Texture/Pattern could go here */}

            {/* Use viewBox="0 0 100 100" to allow using 0-100 coordinates that scale automatically */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <defs>
                    <filter id="road-shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.1" />
                    </filter>
                </defs>

                {/* Roads: White paths with gray strokes */}
                <g stroke={COLORS.roadBorder} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 10 50 L 35 25" />
                    <path d="M 10 50 L 35 75" />
                    <path d="M 35 25 L 65 35" />
                    <path d="M 35 75 L 60 85" />
                    <path d="M 60 85 L 65 35" />
                    <path d="M 65 35 L 90 50" /> {/* Added S3->S5 */}
                    {/* Cross connections */}
                    <path d="M 35 25 L 35 75" />
                </g>
                <g stroke="#ffffff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 10 50 L 35 25" />
                    <path d="M 10 50 L 35 75" />
                    <path d="M 35 25 L 65 35" />
                    <path d="M 35 75 L 60 85" />
                    <path d="M 60 85 L 65 35" />
                    <path d="M 65 35 L 90 50" />
                    <path d="M 35 25 L 35 75" />
                </g>
            </svg>

            {/* Stations Markers */}
            {stations.map((station) => (
                <div
                    key={station.id}
                    className="absolute z-10 flex flex-col items-center group cursor-default"
                    style={{
                        left: station.x,
                        top: station.y,
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    {/* Marker Pin */}
                    <div className="relative flex items-center justify-center transition-transform hover:-translate-y-1">
                        <div className={`
                            w-4 h-4 rounded-full border-2 bg-white shadow-sm flex items-center justify-center
                            ${station.type === 'terminal' ? 'border-gray-800' : ''}
                            ${station.type === 'hub' ? 'border-blue-600' : ''}
                            ${station.type === 'stop' ? 'border-gray-400' : ''}
                        `}>
                            {station.type === 'terminal' && <div className="w-1.5 h-1.5 bg-gray-800 rounded-full" />}
                            {station.type === 'hub' && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                        </div>
                    </div>

                    {/* Label */}
                    <div className="absolute top-5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded shadow-sm border border-gray-100 whitespace-nowrap">
                        <span className="text-[10px] font-medium text-gray-700 block leading-none">
                            {station.label}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CityMap;
