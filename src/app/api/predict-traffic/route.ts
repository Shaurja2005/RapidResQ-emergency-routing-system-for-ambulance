import { NextResponse } from 'next/server';
import { predictTrafficDensity, TrafficInput, WeatherCondition } from '@/lib/traffic-model';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate inputs (basic validation)
        const { timeOfDay, dayOfWeek, weather, historicalCongestionLevel } = body;

        if (
            typeof timeOfDay !== 'number' ||
            typeof dayOfWeek !== 'number' ||
            !weather ||
            typeof historicalCongestionLevel !== 'number'
        ) {
            return NextResponse.json(
                { error: 'Invalid input. Required: timeOfDay, dayOfWeek, weather, historicalCongestionLevel' },
                { status: 400 }
            );
        }

        const input: TrafficInput = {
            timeOfDay,
            dayOfWeek,
            weather: weather as WeatherCondition,
            historicalCongestionLevel
        };

        const score = predictTrafficDensity(input);

        return NextResponse.json({
            score,
            level: score > 70 ? 'High' : score > 40 ? 'Moderate' : 'Low',
            factors: {
                timeEx: timeOfDay,
                weatherEx: weather
            }
        });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
