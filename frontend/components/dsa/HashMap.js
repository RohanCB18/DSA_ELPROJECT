import React from 'react';

const HashMap = ({ stations }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-full">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Station Data (Hash Map)
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="col-span-2 flex border-b border-gray-100 pb-1 mb-1 text-gray-400">
                    <span className="w-1/3">Key (ID)</span>
                    <span className="w-2/3">Value (Wait/Drop)</span>
                </div>
                {stations.map((s) => (
                    <React.Fragment key={s.id}>
                        <div className="bg-gray-50 p-2 rounded border border-gray-100 flex items-center justify-between transition-all duration-300 hover:bg-blue-50">
                            <span className="text-blue-600 font-bold">"{s.name}"</span>
                            <span className="text-gray-500">→</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-gray-200 flex items-center gap-2 shadow-sm transition-all duration-300">
                            <span className="text-purple-600 font-bold">
                                {'{ w:'}<span className="text-red-500">{s.waiting}</span>, d:{s.drop} {'}'}
                            </span>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default HashMap;
