# Intelligent Transport Simulation System

A DSA-based experiential learning project demonstrating real-time public transport routing and congestion management using graph algorithms, priority queues, and dynamic programming.

## 🎯 Project Overview

This system simulates an intelligent public transport network with:
- **3 Buses**: Scheduled, Smart (congestion-avoiding), and Relief (emergency response)
- **6 Stations**: Connected via weighted graph representing physical distances
- **Real-time Routing**: Dijkstra's algorithm with dynamic weight adjustment
- **Congestion Detection**: Max-heap priority queue for identifying hotspots
- **Live Visualization**: Interactive web interface with real-time bus tracking

## 📁 Folder Structure

```
intelligent-transport-simulation/
├── backend/                    # C Simulation Engine
│   ├── main.c                  # Entry point
│   ├── simulation.c            # Core simulation logic
│   ├── simulation.h
│   ├── bus.c                   # Bus data structures
│   ├── bus.h
│   ├── station.c               # Station data structures
│   ├── station.h
│   ├── events.c                # Event emission for frontend
│   ├── events.h
│   └── backend_sim.exe         # Compiled executable
│
├── frontend/                   # Next.js Web Application
│   ├── app/
│   │   ├── page.js             # Landing page
│   │   ├── operator/
│   │   │   └── page.js         # Simulation control panel
│   │   ├── dsa-mapping/
│   │   │   └── page.js         # DSA concepts explanation
│   │   ├── about/
│   │   │   └── page.js         # Project information
│   │   ├── api/
│   │   │   └── simulation/
│   │   │       └── route.js    # Backend API bridge
│   │   ├── layout.js
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.js
│   │   │   └── Footer.js
│   │   └── map/
│   │       ├── CityMap.js      # SVG city visualization
│   │       └── BusLayer.js     # Real-time bus overlay
│   ├── hooks/
│   │   └── useSimulation.js    # Simulation state management
│   ├── lib/
│   │   └── mapData.js          # Station coordinates & paths
│   ├── public/
│   ├── package.json
│   └── next.config.mjs
│
├── .gitignore
└── README.md
```

## 🔧 System Architecture

### Backend (C)

**Data Structures:**
- **Graph**: 6x6 adjacency matrix (weighted, undirected)
- **Max Heap**: Priority queue for congestion detection (O(log N) operations)
- **Dijkstra's Algorithm**: Shortest path computation with dynamic graphs

**Bus Routing Logic:**
1. **Bus 1 (Scheduled)**: Uses base graph (fixed route, predictable)
2. **Bus 2 (Smart)**: Uses demand-aware graph
   - `weight = base_weight + (waiting + drop) * DEMAND_FACTOR`
   - Avoids congested stations by taking alternative routes
3. **Bus 3 (Relief)**: Triggered when `station.waiting > 40`
   - Source: Most congested station (heap root)
   - Destination: Terminal (S5)
   - Uses runtime congestion graph

**Simulation Flow:**
```
1. Operator inputs demand (waiting/drop per station)
2. Compute routes using Dijkstra on respective graphs
3. Step-based simulation (max 30 steps)
4. Emit EVENT lines for frontend consumption
5. Deploy Bus 3 if congestion threshold exceeded
```

### Frontend (Next.js)

**Architecture:**
- **Server-Side Rendering**: Next.js App Router
- **Streaming API**: `/api/simulation` spawns C backend, streams stdout
- **State Management**: React hooks (`useSimulation`)
- **Real-time Updates**: Parses EVENT lines, updates bus positions

**Data Flow:**
```
Operator Input → API Route → Spawn backend_sim.exe → Stream stdout
                                                    ↓
                                        Parse EVENT/ALERT lines
                                                    ↓
                                    Update React state (buses, logs)
                                                    ↓
                                        Render on CityMap + BusLayer
```

## 🚀 Setup Instructions

### Prerequisites
- **Backend**: GCC compiler (MinGW on Windows, gcc on Linux/Mac)
- **Frontend**: Node.js 18+ and npm

### Installation

1. **Clone Repository**
   ```bash
   cd intelligent-transport-simulation
   ```

2. **Backend Setup**
   ```bash
   cd backend
   gcc main.c simulation.c bus.c events.c station.c -o backend_sim.exe -std=c99
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

## 📖 Usage

### Running the Application

1. **Start Frontend Dev Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Access at: `http://localhost:3000`

2. **Navigate to Operator Console**
   - Click "Get Started" or navigate to `/operator`

3. **Configure Simulation**
   - Enter `Waiting` (passengers waiting) and `Drop` (destination demand) for each station
   - Example: S0: Wait=10, Drop=0; S1: Wait=5, Drop=0; Rest=0

4. **Start Simulation**
   - Click "Start Simulation"
   - Watch buses move on the map
   - Monitor System Events log for real-time updates

### Testing Backend Standalone

```bash
cd backend
./backend_sim.exe
# Enter input when prompted:
# S0: 10 0
# S1: 5 0
# S2: 0 0
# S3: 0 0
# S4: 0 0
# S5: 0 0
```

## 🧪 DSA Concepts Demonstrated

| Concept | Implementation | Location |
|---------|---------------|----------|
| **Graph (Weighted)** | 6x6 adjacency matrix | `simulation.c:13-20` |
| **Dijkstra's Algorithm** | Shortest path routing | `simulation.c:67-109` |
| **Max Heap** | Congestion detection | `simulation.c:31-65` |
| **Dynamic Programming** | Graph weight adjustment | `simulation.c:141-150` |
| **Greedy Algorithm** | Bus capacity boarding | `simulation.c:211-216` |
| **Event-Driven Simulation** | Step-based state updates | `simulation.c:164-274` |

## 🎓 Academic Context

**Course**: Data Structures & Algorithms (Experiential Learning)  
**Objective**: Apply theoretical DSA concepts to solve real-world transport optimization problems  
**Key Learning Outcomes**:
- Graph traversal and shortest path algorithms
- Priority queue implementation and applications
- Real-time system design and event-driven architecture
- Full-stack integration (C backend + JavaScript frontend)

## 🛠️ Technical Stack

- **Backend**: C (C99 standard)
- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Icons**: Lucide React
- **Build Tools**: GCC, npm
- **Deployment**: Local development (extensible to Vercel/cloud)

## 📝 License

Educational project for DSA coursework.

## 👥 Contributors

Developed as part of DSA Experiential Learning curriculum.
