import { predictTrafficDensity, TrafficInput } from './traffic-model';

export interface RouteOption {
    id: string;
    name: string;
    distanceKm: number; // Shortest Distance
    signalCount: number; // Signal Count
    trafficInput: TrafficInput; // To calculate Traffic Density
}

export interface ScoredRoute extends RouteOption {
    trafficScore: number;
    finalScore: number;
}

/**
 * Calculates the Final Route Score based on the formula:
 * (Shortest Distance × 0.4) + (Traffic Density × 0.4) + (Signal Count × 0.2)
 * Lower score is better.
 */
export function calculateRouteScore(route: RouteOption): ScoredRoute {
    // 1. Get Traffic Density (0-100)
    const trafficScore = predictTrafficDensity(route.trafficInput);

    // 2. Normalize inputs to comparable scales if needed, 
    // but for the formula provided, we assume raw values or normalized ranges.
    // Distance usually 5-20km. Traffic 0-100. Signals 0-10.
    // Weighted sum might be dominated by Traffic(100) vs Distance(10).
    // Let's assume the formula implies direct multiplication or we normalize.
    // User Formula: (Shortest Distance × 0.4) + (Traffic Density × 0.4) + (Signal Count × 0.2)
    // Example: 10km * 0.4 = 4.  Traffic 50 * 0.4 = 20. Signals 5 * 0.2 = 1. Total = 25.
    // Seems reasonable.

    const finalScore =
        (route.distanceKm * 0.4) +
        (trafficScore * 0.4) +
        (route.signalCount * 0.2);

    return {
        ...route,
        trafficScore,
        finalScore
    };
}

/**
 * Selects the best route from a list of options.
 */
export function findBestRoute(routes: RouteOption[]): ScoredRoute | null {
    if (routes.length === 0) return null;

    const scoredRoutes = routes.map(calculateRouteScore);

    // Sort by lowest Final Score
    scoredRoutes.sort((a, b) => a.finalScore - b.finalScore);

    return scoredRoutes[0];
}
