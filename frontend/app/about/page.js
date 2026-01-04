'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
    Info,
    Map,
    Cpu,
    GraduationCap,
    Lightbulb,
    CheckCircle2
} from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col overflow-hidden">
            <Navbar />

            <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-6 h-full min-h-0">

                {/* Header */}
                <section className="relative py-6 flex-shrink-0 text-center">
                    <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-medium text-blue-700 mb-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                        Project Overview
                    </div>

                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                        About the Project
                    </h1>

                    <p className="max-w-2xl mx-auto text-sm text-gray-600 leading-relaxed">
                        The Intelligent Transport Simulation is a backend-driven system designed to model real-world urban transit challenges.
                        By leveraging strict DSA principles, it solves dynamic routing and congestion problems in a constrained city environment.
                    </p>
                </section>

                {/* Main Content Area */}
                <section className="flex-1 min-h-0 overflow-y-auto pb-6 pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Problem Statement */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-50 rounded-lg text-red-600">
                                    <Info className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">The Problem</h2>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                Urban transport suffers from static inefficiencies. Traditional routing fails to adapt to sudden passenger surges, leading to overcrowding and delays.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Existing academic projects often focus on frontend visualization without implementing the underlying logic that makes transport systems "intelligent"—specifically, the lack of visibility into system-level behavior and dynamic decision making.
                            </p>
                        </div>

                        {/* Solution Overview */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                    <Lightbulb className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">The Solution</h2>
                            </div>
                            <ul className="space-y-3">
                                {[
                                    "Backend-driven simulation engine for true state management",
                                    "Graph-based routing using Dijkstra's algorithm",
                                    "Real-time congestion detection via Priority Queues",
                                    "Dynamic deployment of relief buses (Bus 3)",
                                    "Frontend acting purely as a state visualization layer"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Academic Relevance */}
                        <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">Academic Relevance</h2>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Algorithmic Thinking</h3>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Moving beyond CRUD apps to solve computational problems using graph traversal and optimization algorithms.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">System Modeling</h3>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Representing physical entities (buses, stations, passengers) as interacting memory structures.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Data Structure Trade-offs</h3>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Justifying the use of HashMaps for O(1) lookups vs Linked Lists for dynamic passenger management.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                            Project Outcomes
                        </p>
                        <p className="text-xs text-gray-600 max-w-2xl mx-auto">
                            This project validates the practical application of DSA in building scalable, intelligent systems, providing a clear scope for future extensions like AI-driven predictivity and multi-modal transport support.
                        </p>
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}
