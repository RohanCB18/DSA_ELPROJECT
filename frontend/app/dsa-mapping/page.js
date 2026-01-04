'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
    Network,
    ListOrdered,
    GitCommitHorizontal,
    Database,
    ArrowRightLeft,
    GitBranch
} from 'lucide-react';

export default function DSAMappingPage() {
    const mappings = [
        {
            title: 'Graph (Adjacency List)',
            usedFor: 'City map representation',
            why: 'Supports Dijkstra routing',
            breaksWithout: 'No connectivity model',
            icon: <Network className="w-5 h-5 text-blue-600" />,
            color: 'from-blue-50 to-blue-100 border-blue-200'
        },
        {
            title: 'Priority Queue / Heap',
            usedFor: 'Congestion detection',
            why: 'Identifies most congested station',
            breaksWithout: 'Triggers Bus 3',
            icon: <ListOrdered className="w-5 h-5 text-purple-600" />,
            color: 'from-purple-50 to-purple-100 border-purple-200'
        },
        {
            title: 'Queue',
            usedFor: 'Bus movement sequencing',
            why: 'Event processing order',
            breaksWithout: 'Chaotic bus stops',
            icon: <GitCommitHorizontal className="w-5 h-5 text-green-600" />,
            color: 'from-green-50 to-green-100 border-green-200'
        },
        {
            title: 'Linked List',
            usedFor: 'Passenger state inside a bus',
            why: 'Dynamic add/remove operations',
            breaksWithout: 'Fixed capacity only',
            icon: <GitBranch className="w-5 h-5 text-indigo-600" />,
            color: 'from-indigo-50 to-indigo-100 border-indigo-200'
        },
        {
            title: 'Hash Map',
            usedFor: 'Station ID → Station metadata',
            why: 'Fast lookup for events',
            breaksWithout: 'Slow O(N) rendering',
            icon: <Database className="w-5 h-5 text-orange-600" />,
            color: 'from-orange-50 to-orange-100 border-orange-200'
        },
        {
            title: 'Dijkstra’s Algorithm',
            usedFor: 'Shortest path computation',
            why: 'Congestion-aware routing',
            breaksWithout: 'Blind movement',
            icon: <ArrowRightLeft className="w-5 h-5 text-red-600" />,
            color: 'from-red-50 to-red-100 border-red-200'
        }
    ];

    return (
        <main className="h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col overflow-hidden">
            <Navbar />

            <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 h-full min-h-0">
                <section className="relative py-6 flex-shrink-0 text-center">
                    <div className="inline-flex items-center px-3 py-1 bg-purple-50 border border-purple-100 rounded-full text-xs font-medium text-purple-700 mb-2">
                        <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></span>
                        System Architecture
                    </div>

                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        Data Structures & Algorithms Mapping
                    </h1>

                    <p className="max-w-2xl mx-auto text-sm text-gray-600">
                        This page demonstrates how each core data structure directly contributes to routing, congestion handling, and simulation realism.
                    </p>
                </section>

                <section className="flex-1 min-h-0 overflow-y-auto pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pr-2">
                        {mappings.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 overflow-hidden flex flex-col"
                            >
                                <div className={`px-4 py-3 bg-gradient-to-r ${item.color} flex items-center justify-between border-b`}>
                                    <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                                    {item.icon}
                                </div>

                                <div className="p-4 space-y-3 flex-1 flex flex-col justify-center">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Where it is used</span>
                                        <span className="text-sm font-medium text-gray-800">{item.usedFor}</span>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Why it is needed</span>
                                        <span className="text-sm font-medium text-gray-800">{item.why}</span>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">What breaks without it</span>
                                        <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1.5 rounded border border-red-100 self-start">
                                            {item.breaksWithout}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center border-t border-gray-100 pt-6">
                        <p className="text-xs text-gray-500 italic max-w-xl mx-auto">
                            Note: This is not a toy demo. Each structure was chosen for a specific operational reason, ensuring the system mirrors real-world transport decision logic.
                        </p>
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}
