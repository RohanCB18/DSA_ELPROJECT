import React from 'react';

const PriorityQueue = ({ heap = [] }) => {


    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-full">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Congestion Heap (Max-Heap)
            </h3>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] text-gray-400 border-b pb-1">
                    <span>Index</span>
                    <span>Station</span>
                    <span>Waiting</span>
                </div>
                {heap.map((node, i) => (
                    <div key={node.id} className={`
                        flex justify-between items-center p-2 rounded text-xs transition-all duration-300
                        ${i === 0 ? 'bg-red-50 border-red-200 border' : 'bg-gray-50 border-gray-100 border'}
                    `}>
                        <span className="font-mono text-gray-400 w-6">[{i}]</span>
                        <span className="font-bold text-gray-700">{node.name}</span>
                        <div className="flex items-center gap-1">
                            <div
                                className="h-1.5 rounded-full bg-red-500 transition-all duration-500"
                                style={{ width: `${Math.min(node.waiting * 2, 50)}px` }}
                            ></div>
                            <span className={`font-mono font-bold ${i === 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                {node.waiting}
                            </span>
                        </div>
                    </div>
                ))}
                {heap.length === 0 && (
                    <div className="text-gray-400 text-xs italic text-center py-4">Heap Empty</div>
                )}
            </div>
            <div className="mt-2 text-[10px] text-gray-400 text-center">
                * Root (Index 0) always has max waiting
            </div>
        </div>
    );
};

export default PriorityQueue;
