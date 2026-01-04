
export default function BusIcon({ busId }) {
    const BUS_COLORS = {
        1: {
            body: '#7bb9e8',   // Blue
            glow: 'from-blue-100 to-blue-200'
        },
        2: {
            body: '#6ee7b7',   // Green
            glow: 'from-green-100 to-green-200'
        },
        3: {
            body: '#f87171',   // Red
            glow: 'from-red-100 to-red-200'
        }
    };

    const color = BUS_COLORS[busId] || BUS_COLORS[1]; // Fallback to Bus 1

    return (
        <div
            className={`flex items-center justify-center w-12 h-12 rounded-lg shadow-md 
                  bg-gradient-to-br ${color.glow}`}
        >
            <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Bus Body */}
                <rect
                    x="4"
                    y="6"
                    width="16"
                    height="10"
                    rx="1.5"
                    fill={color.body}
                    stroke="#1e293b"
                    strokeWidth="1.2"
                />

                {/* Roof */}
                <path
                    d="M5.5 6 L5.5 4.5 C5.5 3.5 6 3 7 3 L17 3 C18 3 18.5 3.5 18.5 4.5 L18.5 6"
                    fill={color.body}
                    stroke="#1e293b"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                />

                {/* Windows */}
                <rect x="6" y="7.5" width="3.5" height="3" rx="0.5" fill="#e8f0fe" stroke="#1e293b" strokeWidth="1" />
                <rect x="10.5" y="7.5" width="3.5" height="3" rx="0.5" fill="#e8f0fe" stroke="#1e293b" strokeWidth="1" />
                <rect x="15" y="7.5" width="3.5" height="3" rx="0.5" fill="#e8f0fe" stroke="#1e293b" strokeWidth="1" />

                {/* Stripe */}
                <rect x="4" y="12" width="16" height="1.5" fill="#fbbf24" />

                {/* Wheels */}
                <circle cx="8" cy="16.5" r="2.2" fill="#334155" />
                <circle cx="16" cy="16.5" r="2.2" fill="#334155" />
            </svg>
        </div>
    );
}
