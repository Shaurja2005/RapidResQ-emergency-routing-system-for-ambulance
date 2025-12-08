"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Polyline = dynamic(
    () => import('react-leaflet').then((mod) => mod.Polyline),
    { ssr: false }
);

const center = {
    lat: 28.6139,
    lng: 77.2090
};

interface MapComponentProps {
    children?: React.ReactNode;
    routeCoordinates?: [number, number][]; // Array of [lat, lng]
}

export default function MapComponent({ children, routeCoordinates }: MapComponentProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Fix Leaflet icons
        (async () => {
            const L = (await import('leaflet')).default;
            // @ts-ignore
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });
        })();
    }, []);

    if (!isMounted) {
        return <div className="w-full h-full bg-neutral-800 animate-pulse flex items-center justify-center text-neutral-500">Loading Map...</div>;
    }

    return (
        <div className="w-full h-full">
            {/* @ts-ignore */}
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Draw Route Polyline if coordinates exist */}
                {routeCoordinates && (
                    // @ts-ignore
                    <Polyline
                        positions={routeCoordinates}
                        pathOptions={{ color: 'blue', weight: 5, opacity: 0.7 }}
                    />
                )}
                {children}
            </MapContainer>
        </div>
    );
}
