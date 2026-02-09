'use client';
import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
    const [activeLink, setActiveLink] = useState('/');

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/operator', label: 'Operator Console' }
    ];

    return (
        <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
                            <svg
                                className="w-8 h-8"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect
                                    x="4"
                                    y="6"
                                    width="16"
                                    height="10"
                                    rx="1.5"
                                    fill="#7bb9e8"
                                    stroke="#1e293b"
                                    strokeWidth="1.2"
                                />

                                <path
                                    d="M5.5 6 L5.5 4.5 C5.5 3.5 6 3 7 3 L17 3 C18 3 18.5 3.5 18.5 4.5 L18.5 6"
                                    fill="#7bb9e8"
                                    stroke="#1e293b"
                                    strokeWidth="1.2"
                                    strokeLinejoin="round"
                                />

                                <rect x="6" y="7.5" width="3.5" height="3" rx="0.5" fill="#e8f0fe" stroke="#1e293b" strokeWidth="1" />
                                <rect x="10.5" y="7.5" width="3.5" height="3" rx="0.5" fill="#e8f0fe" stroke="#1e293b" strokeWidth="1" />
                                <rect x="15" y="7.5" width="3.5" height="3" rx="0.5" fill="#e8f0fe" stroke="#1e293b" strokeWidth="1" />

                                <rect x="4" y="12" width="16" height="1.5" fill="#fbbf24" />

                                <rect x="16.5" y="6" width="2.5" height="5" rx="0.3" fill="#d0e7f7" stroke="#1e293b" strokeWidth="1" />

                                <circle cx="8" cy="16.5" r="2.2" fill="#334155" stroke="#1e293b" strokeWidth="1.2" />
                                <circle cx="8" cy="16.5" r="1.2" fill="#64748b" />

                                <circle cx="16" cy="16.5" r="2.2" fill="#334155" stroke="#1e293b" strokeWidth="1.2" />
                                <circle cx="16" cy="16.5" r="1.2" fill="#64748b" />

                                <rect x="4.5" y="14" width="1" height="1" rx="0.3" fill="#fbbf24" stroke="#1e293b" strokeWidth="0.8" />
                                <rect x="18.5" y="14" width="1" height="1" rx="0.3" fill="#fbbf24" stroke="#1e293b" strokeWidth="0.8" />

                                <rect x="3" y="9" width="1" height="1.5" rx="0.3" fill="#334155" stroke="#1e293b" strokeWidth="0.8" />
                                <rect x="20" y="9" width="1" height="1.5" rx="0.3" fill="#334155" stroke="#1e293b" strokeWidth="0.8" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-semibold text-gray-900 leading-tight">
                                Intelligent Transport Simulation
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                                DSA Experiential Learning Project
                            </span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setActiveLink(link.href)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeLink === link.href
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <button className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;