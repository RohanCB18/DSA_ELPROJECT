export const STATION_COORDINATES = {
    S0: { x: 10, y: 50 },
    S1: { x: 35, y: 25 },
    S2: { x: 35, y: 75 },
    S3: { x: 65, y: 35 },
    S4: { x: 60, y: 85 },
    S5: { x: 90, y: 50 },
};

// Define valid connections for route highlighting
// Key format: "FROM_TO"
export const CONNECTION_PATHS = {
    "S0_S1": { d: "M 10 50 L 35 25" }, // Rough straight lines for now, or curved if needed
    "S0_S2": { d: "M 10 50 L 35 75" },
    "S1_S3": { d: "M 35 25 L 65 35" },
    "S1_S2": { d: "M 35 25 L 35 75" },
    "S2_S4": { d: "M 35 75 L 60 85" },
    "S2_S3": { d: "M 35 75 L 65 35" }, // Diagonal
    "S3_S5": { d: "M 65 35 L 90 50" }, // Added direct link S3->S5
    "S4_S5": { d: "M 60 85 L 90 50" },
    "S3_S4": { d: "M 65 35 L 60 85" }, // If exists
};
