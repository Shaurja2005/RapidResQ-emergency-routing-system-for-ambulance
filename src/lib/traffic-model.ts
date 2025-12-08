export type WeatherCondition = 'clear' | 'rain' | 'snow' | 'fog';

export interface TrafficInput {
    timeOfDay: number; // 0-23 hours
    dayOfWeek: number; // 0 (Sun) - 6 (Sat)
    weather: WeatherCondition;
    historicalCongestionLevel: number; // 0-10 (10 is very high)
}

/**
 * Predicts traffic density score (0-100) based on weighted inputs.
 * Uses a simulated Linear Regression / Weighted Logic approach.
 */
export function predictTrafficDensity(input: TrafficInput): number {
    let score = input.historicalCongestionLevel * 5; // Base score (0-50)

    // 1. Time of Day Impact
    // Rush hours: 8-10 AM (8,9) and 5-7 PM (17,18,19)
    if ((input.timeOfDay >= 8 && input.timeOfDay <= 10) || (input.timeOfDay >= 17 && input.timeOfDay <= 19)) {
        score += 30; // High impact
    } else if (input.timeOfDay >= 22 || input.timeOfDay <= 5) {
        score -= 10; // Late night traffic reduction
    } else {
        score += 10; // Normal daytime
    }

    // 2. Day of Week Impact
    // Weekends (0, 6) usually less traffic
    if (input.dayOfWeek === 0 || input.dayOfWeek === 6) {
        score -= 15;
    } else {
        score += 5; // Weekday penalty
    }

    // 3. Weather Impact
    switch (input.weather) {
        case 'rain':
            score += 20;
            break;
        case 'snow':
            score += 30;
            break;
        case 'fog':
            score += 15;
            break;
        case 'clear':
        default:
            score += 0;
            break;
    }

    // Normalize score to 0-100 range
    return Math.max(0, Math.min(100, score));
}
