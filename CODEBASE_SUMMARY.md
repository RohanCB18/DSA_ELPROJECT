# Intelligent Transport Simulation - Codebase Summary

## Overview

This is a **DSA (Data Structures & Algorithms) Experiential Learning** project that simulates an intelligent public transport system. It demonstrates real-world application of graph algorithms, priority queues, and event-driven architecture.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                      │
│  ┌──────────────┐  ┌────────────────┐  ┌──────────────────────┐ │
│  │ Operator UI  │  │  City Map (SVG)│  │ DSA Visualizations   │ │
│  │ (Input Form) │  │  + Bus Layer   │  │ (Heap, HashMap, etc.)│ │
│  └──────┬───────┘  └───────▲────────┘  └──────────▲───────────┘ │
│         │                  │                      │             │
│         ▼                  │                      │             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              useSimulation.js (React Hook)               │   │
│  │  - Fetches from /api/simulation                          │   │
│  │  - Parses EVENT lines from backend                       │   │
│  │  - Updates bus positions, stations, heap                 │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                   │
│                             ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              /api/simulation (route.js)                  │   │
│  │  - Spawns backend_sim via WSL                            │   │
│  │  - Streams stdout to frontend                            │   │
│  └──────────────────────────┬───────────────────────────────┘   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (C - simulation.c)                 │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────────┐  │
│  │ Adjacency Matrix│  │ Dijkstra's    │  │ Max-Heap for      │  │
│  │ (Weighted Graph)│  │ Algorithm     │  │ Congestion        │  │
│  └────────────────┘  └────────────────┘  └───────────────────┘  │
│                                                                 │
│  Output: EVENT STEP=0 BUS=1 STATION=S0 DEMAND_SIGNAL=5 ONBUS=3  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Backend (C)

### Files
| File | Purpose |
|------|---------|
| `main.c` | Entry point - calls `start_simulation()` |
| `simulation.c` | Core logic: graph, Dijkstra, heap, simulation loop |
| `simulation.h` | Function declarations |
| `bus.h` | Bus struct definition (id, route, passengers, capacity=10) |
| `station.h` | Station struct (id, name, waiting, drop) |
| `events.c` / `events.h` | `emit_event()` - outputs structured EVENT lines |

### Key Data Structures

1. **Weighted Graph (Adjacency Matrix)**
   ```c
   int graph[6][6] = {
       {0, 15, 25, 0, 0, 0},   // S0 → S1(15), S2(25)
       {0, 0, 20, 20, 0, 0},   // S1 → S2(20), S3(20)
       ...
   };
   ```
   - 6 stations (S0-S5) connected with edge weights representing travel time/distance

2. **Max-Heap (Priority Queue)**
   - Tracks most congested stations by `waiting` count
   - Used to identify hotspots for potential relief bus deployment
   - Operations: `heap_push()`, `update_congestion_heap()`, `get_most_congested_station()`

3. **Dijkstra's Algorithm**
   - `dijkstra(src, dest, adj, pathOut)` → returns shortest path
   - Used to compute optimal bus route from S0 to S5

### Simulation Flow
1. Read operator input (waiting/drop passengers per station)
2. Build congestion heap
3. Compute bus route using Dijkstra
4. Step-based loop (max 30 steps):
   - At each station: DROP passengers → PICKUP passengers
   - Emit `EVENT` line with current state
5. Output `SIMULATION FINISHED`

### Event Format (stdout)
```
EVENT STEP=0 BUS=1 STATION=S0 DEMAND_SIGNAL=5 ONBUS=10
```

---

## Frontend (Next.js 15 + React 19)

### Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.js` | Landing page with feature cards |
| `/operator` | `app/operator/page.js` | **Main simulation console** - input form + live visualization |
| `/dsa-mapping` | `app/dsa-mapping/page.js` | Explains DSA concepts used |
| `/about` | `app/about/page.js` | Project information |

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `Navbar.js` | `components/layout/` | Navigation bar |
| `Footer.js` | `components/layout/` | Page footer |
| `CityMap.js` | `components/map/` | SVG visualization of 6 stations with connections |
| `BusLayer.js` | `components/map/` | Overlay showing bus positions on the map |
| `BusIcon.js` | `components/map/` | Animated bus icon |
| `LinkedList.js` | `components/dsa/` | Visual: passengers on bus as linked list |
| `HashMap.js` | `components/dsa/` | Visual: station data as hash map |
| `heap.js` | `components/dsa/` | Visual: congestion priority queue |
| `StationQueue.js` | `components/dsa/` | Visual: bus route as queue |

### Core Hook: `useSimulation.js`

```javascript
const {
    stations,        // Array of station states
    buses,           // Bus positions & passengers
    heap,            // Priority queue visualization data
    isSimulating,    // Is simulation in progress?
    isCompleted,     // Has simulation finished?
    startSimulation, // Trigger backend execution
    nextStep,        // Advance one simulation step
    resetSimulation  // Clear all state
} = useSimulation();
```

**Key Functions:**
- `startSimulation(stationsInput)` → POSTs to `/api/simulation`, reads stream
- `parseSimulationOutput(lines)` → Groups EVENT lines by STEP into timeline
- `nextStep()` → Advances playback, calls `processEvents()`
- `processEvents(events)` → Updates bus location, station waiting, heap

### API Route: `/api/simulation/route.js`

- Receives station configuration as JSON
- Spawns `backend_sim` via WSL
- Pipes input to stdin, streams stdout back to frontend
- Converts Windows paths to WSL format (`/mnt/c/...`)

---

## Map Topology

```
        S1 ─────────── S3
       /│\             /│\
      / │ \           / │ \
     /  │  \         /  │  \
   S0   │   ────────┘   │   S5
     \  │               │  /
      \ │               │ /
       \│/              │/
        S2 ─────────── S4
```

Station coordinates defined in `lib/mapData.js`:
- S0: Origin (left)
- S5: Terminal (right)

---

## DSA Concepts Demonstrated

| Concept | Implementation | Location |
|---------|---------------|----------|
| **Graph (Adjacency Matrix)** | 6x6 weighted matrix | `simulation.c:13-20` |
| **Dijkstra's Algorithm** | Shortest path routing | `simulation.c:67-109` |
| **Max-Heap / Priority Queue** | Congestion detection | `simulation.c:31-65` |
| **Greedy Algorithm** | Passenger boarding (fill to capacity) | `simulation.c:169-178` |
| **Event-Driven Architecture** | C emits events, JS parses & renders | `events.c`, `useSimulation.js` |
| **Linked List** | Passenger list visualization | `LinkedList.js` |
| **Hash Map** | Station lookup visualization | `HashMap.js` |
| **Queue** | Bus route progression | `StationQueue.js` |

---

## How to Run

### 1. Compile Backend (WSL)
```bash
cd "/mnt/c/Users/rohan/OneDrive/Desktop/cursorOP/rohit_sp/dsa-el/backend"
gcc main.c simulation.c events.c -o backend_sim -std=c99
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Access
Open `http://localhost:3000/operator` and:
1. Enter waiting/drop values for each station
2. Click "Start Simulation"
3. Click "SIMULATE (NEXT STEP)" repeatedly to advance

---

## Tech Stack

- **Backend**: C (C99)
- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Icons**: Lucide React
- **Execution**: WSL (Ubuntu) for running C binary on Windows
