export const STATION_COORDINATES = {
    S0: { x: 10, y: 50 },
    S1: { x: 35, y: 25 },
    S2: { x: 35, y: 75 },
    S3: { x: 65, y: 35 },
    S4: { x: 60, y: 85 },
    S5: { x: 90, y: 50 },
};

export const CONNECTION_PATHS = {
    "S0_S1": { d: "M 10 50 L 35 25" },
    "S0_S2": { d: "M 10 50 L 35 75" },
    "S1_S2": { d: "M 35 25 L 35 75" },
    "S1_S3": { d: "M 35 25 L 65 35" },
    "S2_S4": { d: "M 35 75 L 60 85" },
    "S3_S4": { d: "M 65 35 L 60 85" },
    "S3_S5": { d: "M 65 35 L 90 50" },
    "S4_S3": { d: "M 60 85 L 65 35" },
    "S4_S5": { d: "M 60 85 L 90 50" },
};
