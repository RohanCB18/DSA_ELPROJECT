import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  const features = [
    {
      title: 'Graph-Based Routing',
      description: 'Shortest path computation using Dijkstra\'s algorithm on a predefined city transport graph.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Congestion Handling',
      description: 'Passenger demand analysis and dynamic deployment of a relief bus using priority queues.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Real-Time Simulation',
      description: 'Step-by-step bus movement and state updates driven entirely by backend-generated events.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'DSA-Centric Design',
      description: 'Explicit use of graphs, queues, heaps, linked lists, and hash maps mapped to real-world transport behavior.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <main className="h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col overflow-hidden">

      <Navbar />

      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 h-full min-h-0">

        <section className="relative py-4 flex-shrink-0">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-medium text-blue-700 mb-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
              Data Structures & Algorithms in Action
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
              Intelligent Public Transport
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Routing & Simulation
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm text-gray-600 mb-4 leading-relaxed">
              A backend-driven transport simulation that demonstrates real-world application of graphs, priority queues, and congestion-aware routing.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/operator"
                className="group inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-lg
                           font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
              >
                Get Started
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <Link
                href="/dsa-mapping"
                className="inline-flex items-center bg-white text-gray-700 px-5 py-2 rounded-lg
                           font-semibold hover:bg-gray-50 transition border-2 border-gray-200 hover:border-gray-300 text-sm"
              >
                Explore DSA Mapping
              </Link>
            </div>
          </div>
        </section>

        <section className="flex-1 min-h-0 flex flex-col justify-center py-4">
          <div className="text-center mb-4 flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              What This System Demonstrates
            </h2>
            <p className="text-xs text-gray-600">
              Bridging theory with practice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto pr-2 pb-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg text-white mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />

    </main>
  );
}