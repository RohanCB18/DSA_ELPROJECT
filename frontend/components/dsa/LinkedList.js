import React from 'react';
import { ArrowRight, User } from 'lucide-react';

const LinkedList = ({ busId, passengers = [], active }) => {
    if (!active) return null;

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${busId === 1 ? 'bg-blue-500' : busId === 2 ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                Bus {busId} Passengers (Linked List)
            </h3>

            <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 min-h-[60px]">
                <div className="text-xs text-gray-400 font-mono mr-2">HEAD</div>

                {passengers.length === 0 ? (
                    <div className="text-gray-400 italic text-sm">Empty</div>
                ) : (
                    passengers.map((p, idx) => (
                        <div key={`${busId}-p-${idx}`} className="flex items-center animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="flex flex-col items-center bg-gray-50 border-2 border-gray-300 rounded-md p-2 min-w-[60px]">
                                <User size={16} className="text-gray-600 mb-1" />
                                <span className="text-xs font-bold text-gray-800">{p.id}</span>
                            </div>

                            <div className="mx-2 text-gray-400">
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    ))
                )}

                {passengers.length > 0 && (
                    <div className="text-xs text-gray-400 font-mono">NULL</div>
                )}
            </div>
        </div>
    );
};

export default LinkedList;
