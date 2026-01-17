import React, { useRef, useEffect } from 'react';
import { ArrowRight, Circle, CheckCircle2 } from 'lucide-react';

const StationQueue = ({ busId, route = [], currentIdx }) => {
    const scrollRef = useRef(null);

    // Auto-scroll to active item
    useEffect(() => {
        if (scrollRef.current && currentIdx >= 0) {
            const activeEl = scrollRef.current.children[currentIdx];
            if (activeEl) {
                activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [currentIdx]);

    if (!route || route.length === 0) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-28 flex items-center justify-center text-gray-400 text-xs italic">
                Route Queue will appear here...
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full overflow-hidden">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${busId === 1 ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
                Route Queue (Linear Queue)
            </h3>

            <div className="relative">
                {/* Horizontal Scrolling Container */}
                <div
                    ref={scrollRef}
                    className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-200 px-4"
                >
                    {route.map((stationId, idx) => {
                        const isVisited = idx < currentIdx;
                        const isActive = idx === currentIdx;
                        const isUpcoming = idx > currentIdx;

                        return (
                            <div key={idx} className="flex items-center shrink-0">
                                {/* Connector Line (Before) */}
                                {idx > 0 && (
                                    <div className={`w-6 h-0.5 mx-2 ${isVisited || isActive ? 'bg-blue-300' : 'bg-gray-200'}`} />
                                )}

                                <div className={`
                                    relative flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-500
                                    ${isActive
                                        ? 'bg-blue-50 border-blue-500 scale-110 shadow-md z-10'
                                        : isVisited
                                            ? 'bg-gray-50 border-gray-200 opacity-60 grayscale'
                                            : 'bg-white border-gray-200 opacity-80'
                                    }
                                    ${isActive ? 'min-w-[80px]' : 'min-w-[60px]'}
                                `}>
                                    {/* Status Icon */}
                                    <div className="mb-1">
                                        {isVisited ? (
                                            <CheckCircle2 size={16} className="text-green-500" />
                                        ) : isActive ? (
                                            <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse border-2 border-white ring-2 ring-blue-200" />
                                        ) : (
                                            <Circle size={14} className="text-gray-300" />
                                        )}
                                    </div>

                                    <span className={`text-sm font-bold ${isActive ? 'text-blue-700' : 'text-gray-600'}`}>
                                        S{stationId}
                                    </span>

                                    <span className="text-[9px] uppercase tracking-wider text-gray-400 mt-0.5">
                                        {isActive ? 'Current' : isVisited ? 'Done' : 'Next'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StationQueue;
