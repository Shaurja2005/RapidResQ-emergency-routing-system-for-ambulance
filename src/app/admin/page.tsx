"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import MapComponent from '@/components/Map';
import { Shield, Radio, Activity, Zap, Siren, AlertTriangle } from 'lucide-react';

const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

const MOCK_AMBULANCES = [
    { id: '1', name: 'AMB-101', status: 'CRITICAL', lat: 28.6139, lng: 77.2090 },
    { id: '2', name: 'AMB-205', status: 'IDLE', lat: 28.6200, lng: 77.2100 },
];

const DEFAULT_SIGNALS = [
    { id: 'sig-1', name: 'Connaught Place Circle', state: 'GREEN' },
    { id: 'sig-2', name: 'India Gate South', state: 'RED' },
    { id: 'sig-3', name: 'AIIMS Flyover', state: 'RED' },
];

export default function AdminPage() {
    const [signals, setSignals] = useState(DEFAULT_SIGNALS);
    const [icons, setIcons] = useState<{ critical: any; idle: any } | null>(null);
    const [emergencyAlert, setEmergencyAlert] = useState<any | null>(null);

    useEffect(() => {
        // 1. Icon Setup
        (async () => {
            const L = (await import('leaflet')).default;

            const criticalIcon = new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            const idleIcon = new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            setIcons({ critical: criticalIcon, idle: idleIcon });
        })();

        // 2. Alert & Signal Sync Listener
        const handleStorageChange = () => {
            const alertData = localStorage.getItem('traffic_alert');
            if (alertData) {
                setEmergencyAlert(JSON.parse(alertData));
            }
        };

        // Load initial signals if present
        const savedSignals = localStorage.getItem('traffic_signals');
        if (savedSignals) {
            setSignals(JSON.parse(savedSignals));
        } else {
            // Init storage
            localStorage.setItem('traffic_signals', JSON.stringify(DEFAULT_SIGNALS));
        }

        // Listen to storage events (cross-tab interaction)
        window.addEventListener('storage', handleStorageChange);

        // Check initial alert
        const initialAlert = localStorage.getItem('traffic_alert');
        if (initialAlert) setEmergencyAlert(JSON.parse(initialAlert));

        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const toggleSignal = (id: string) => {
        setSignals(prev => {
            const newSignals = prev.map(s =>
                s.id === id ? { ...s, state: s.state === 'RED' ? 'GREEN' : 'RED' } : s
            );
            // Sync to storage
            localStorage.setItem('traffic_signals', JSON.stringify(newSignals));
            window.dispatchEvent(new Event('storage'));
            return newSignals;
        });
    };

    const clearAlert = () => {
        setEmergencyAlert(null);
        localStorage.removeItem('traffic_alert');
    };

    return (
        <div className="flex h-screen bg-neutral-950 text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 border-r border-neutral-800 flex flex-col bg-neutral-900">
                <div className="p-6 border-b border-neutral-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="relative w-8 h-8 rounded overflow-hidden">
                            <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
                        </div>
                        <h1 className="text-xl font-black tracking-wide">RapidResQ</h1>
                    </div>
                    <div className="text-xs font-bold text-blue-500 tracking-widest uppercase">Traffic Control Center</div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <div>
                        <h2 className="text-sm font-semibold text-neutral-400 mb-3 uppercase tracking-wider">Signals Override</h2>
                        <div className="space-y-3">
                            {signals.map(s => (
                                <div key={s.id} className="bg-neutral-800 p-3 rounded-lg border border-neutral-700 flex justify-between items-center group hover:border-neutral-500 transition-colors">
                                    <div>
                                        <div className="font-medium text-sm">{s.name}</div>
                                        <div className={`text-xs mt-1 font-bold ${s.state === 'GREEN' ? 'text-green-500' : 'text-red-500'}`}>
                                            {s.state}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleSignal(s.id)}
                                        className={`p-2 rounded-md ${s.state === 'GREEN' ? 'bg-red-900/50 hover:bg-red-900 text-red-200' : 'bg-green-900/50 hover:bg-green-900 text-green-200'} transition-all`}
                                    >
                                        <Zap className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-neutral-400 mb-3 uppercase tracking-wider">Active Units</h2>
                        <div className="space-y-3">
                            {MOCK_AMBULANCES.map(amp => (
                                <div key={amp.id} className="bg-neutral-800 p-3 rounded-lg border border-neutral-700 flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${amp.status === 'CRITICAL' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                                    <div>
                                        <div className="font-medium text-sm">{amp.name}</div>
                                        <div className="text-xs text-neutral-500">{amp.status}</div>
                                    </div>
                                    <Radio className="w-4 h-4 ml-auto text-neutral-600" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Map View */}
            <div className="flex-1 relative">
                <div className="absolute top-6 right-6 z-[1000] flex gap-2">
                    <div className="bg-black/80 backdrop-blur text-white px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2 shadow-xl">
                        <Activity className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium">System Optimal</span>
                    </div>
                </div>

                {/* EMERGENCY ALERT BANNER */}
                {emergencyAlert && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-lg animate-bounce-in">
                        <div className="bg-red-600/90 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl border-2 border-red-400 flex items-center gap-4">
                            <div className="bg-white/20 p-2 rounded-full animate-pulse">
                                <Siren className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg uppercase tracking-wider">Green Corridor Request</h3>
                                <p className="text-sm text-red-100">Unit {emergencyAlert.ambulanceId} at {emergencyAlert.location}</p>
                            </div>
                            <button
                                onClick={clearAlert}
                                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors font-bold text-xs"
                            >
                                ACKNOWLEDGE
                            </button>
                        </div>
                    </div>
                )}

                <MapComponent>
                    {/* Simulated Ambulance Markers - Only render if icons are ready */}
                    {icons && MOCK_AMBULANCES.map(amb => (
                        // @ts-ignore
                        <Marker
                            key={amb.id}
                            position={[amb.lat, amb.lng]}
                            icon={amb.status === 'CRITICAL' ? icons.critical : icons.idle}
                        >
                            {/* @ts-ignore */}
                            <Popup>
                                <div className="text-slate-900 font-bold">{amb.name}</div>
                                <div className="text-slate-600 text-xs">{amb.status}</div>
                            </Popup>
                        </Marker>
                    ))}
                </MapComponent>
            </div>
        </div>
    );
}
