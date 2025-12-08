import { RouteOption } from './routing-engine';

export interface RouteOptionWithCoords extends RouteOption {
    coordinates: [number, number][]; // Lat, Lng array
}

export const MOCK_ROUTES: RouteOptionWithCoords[] = [
    {
        id: 'route-1',
        name: 'Main Highway (Fastest usually)',
        distanceKm: 12,
        signalCount: 4,
        trafficInput: {
            timeOfDay: 18,
            dayOfWeek: 1,
            weather: 'clear',
            historicalCongestionLevel: 8
        },
        // Simulated Path (New Delhi area)
        coordinates: [
            [28.6139, 77.2090], // Start
            [28.6150, 77.2120],
            [28.6200, 77.2150],
            [28.6250, 77.2100],
            [28.6300, 77.2180], // End
        ]
    },
    {
        id: 'route-2',
        name: 'City Shortcut (More signals)',
        distanceKm: 9,
        signalCount: 12,
        trafficInput: {
            timeOfDay: 18,
            dayOfWeek: 1,
            weather: 'clear',
            historicalCongestionLevel: 6
        },
        coordinates: [
            [28.6139, 77.2090], // Start
            [28.6145, 77.2080],
            [28.6160, 77.2050],
            [28.6180, 77.2060],
            [28.6300, 77.2180], // End
        ]
    },
    {
        id: 'route-3',
        name: 'Backroads (Longer but empty)',
        distanceKm: 15,
        signalCount: 2,
        trafficInput: {
            timeOfDay: 18,
            dayOfWeek: 1,
            weather: 'clear',
            historicalCongestionLevel: 2
        },
        coordinates: [
            [28.6139, 77.2090], // Start
            [28.6100, 77.2000], // Detour
            [28.6050, 77.2100],
            [28.6200, 77.2250],
            [28.6300, 77.2180], // End
        ]
    }
];
