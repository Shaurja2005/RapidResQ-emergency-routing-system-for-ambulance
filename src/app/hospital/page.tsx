"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Activity, Thermometer, Users, Clock, AlertCircle, ShieldCheck } from 'lucide-react';

export default function HospitalPage() {
    const [resources, setResources] = useState({
        icuBeds: 5,
        ventilators: 2,
        doctors: 8
    });

    const [alerts, setAlerts] = useState<any[]>([]);

    // Request Verification State
    const [incomingRequest, setIncomingRequest] = useState<any>(null);

    const updateResource = (key: keyof typeof resources, change: number) => {
        setResources(prev => {
            const newState = { ...prev, [key]: Math.max(0, prev[key] + change) };
            return newState;
        });
    };

    useEffect(() => {
        // Clear cleanup
        localStorage.removeItem('hospital_alert');
        localStorage.removeItem('hospital_data_request');
        localStorage.removeItem('hospital_data_approved');

        const checkStorage = () => {
            // Check Incoming Patient Alerts
            const alertData = localStorage.getItem('hospital_alert');
            if (alertData) {
                const newAlert = JSON.parse(alertData);
                setAlerts(prev => {
                    if (prev.some(a => a.id === newAlert.id)) return prev;
                    return [newAlert, ...prev];
                });
            }

            // Check Data Requests
            const requestData = localStorage.getItem('hospital_data_request');
            if (requestData) {
                setIncomingRequest(JSON.parse(requestData));
            }
        };

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'hospital_alert' || e.key === 'hospital_data_request') checkStorage();
        };
        window.addEventListener('storage', handleStorageChange);

        const interval = setInterval(checkStorage, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    const handleApproveRequest = () => {
        // Send Data Back
        localStorage.setItem('hospital_data_approved', JSON.stringify(resources));
        window.dispatchEvent(new Event('storage'));

        // Clear Request
        setIncomingRequest(null);
        localStorage.removeItem('hospital_data_request');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8 relative">
            <header className="flex justify-between items-center mb-10 border-b border-slate-200 pb-6">
                <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                        <Image src="/logo.jpg" alt="RapidResQ" fill className="object-cover" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">RapidResQ</h1>
                        <p className="text-slate-500 font-medium">Hospital Resource Gateway</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        System Active
                    </div>
                </div>
            </header>

            {/* DATA ACCESS REQUEST BANNER */}
            {incomingRequest && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
                    <div className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-blue-400" />
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-wider text-blue-400">Access Request</h3>
                                <p className="text-xs text-slate-300">Ambulance {incomingRequest.ambulanceId} requesting vital stats</p>
                            </div>
                        </div>
                        <button
                            onClick={handleApproveRequest}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-900/50"
                        >
                            APPROVE ACCESS
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Resource Management */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-blue-600" />
                        Live Resources
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="text-slate-500 text-sm font-semibold uppercase">ICU Beds</div>
                            <div className="text-4xl font-bold my-4 text-blue-600">{resources.icuBeds}</div>
                            <div className="flex gap-2">
                                <button onClick={() => updateResource('icuBeds', -1)} className="flex-1 py-1 rounded bg-slate-100 hover:bg-slate-200 font-bold">-</button>
                                <button onClick={() => updateResource('icuBeds', 1)} className="flex-1 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold">+</button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="text-slate-500 text-sm font-semibold uppercase">Ventilators</div>
                            <div className="text-4xl font-bold my-4 text-purple-600">{resources.ventilators}</div>
                            <div className="flex gap-2">
                                <button onClick={() => updateResource('ventilators', -1)} className="flex-1 py-1 rounded bg-slate-100 hover:bg-slate-200 font-bold">-</button>
                                <button onClick={() => updateResource('ventilators', 1)} className="flex-1 py-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-600 font-bold">+</button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="text-slate-500 text-sm font-semibold uppercase">ER Doctors</div>
                            <div className="text-4xl font-bold my-4 text-green-600">{resources.doctors}</div>
                            <div className="flex gap-2">
                                <button onClick={() => updateResource('doctors', -1)} className="flex-1 py-1 rounded bg-slate-100 hover:bg-slate-200 font-bold">-</button>
                                <button onClick={() => updateResource('doctors', 1)} className="flex-1 py-1 rounded bg-green-50 hover:bg-green-100 text-green-600 font-bold">+</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Incoming Alerts */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-5 h-5" />
                        Incoming Priority
                    </h2>

                    <div className="space-y-4">
                        {alerts.map(alert => (
                            <div key={alert.id} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm animate-in fade-in slide-in-from-right duration-500">
                                <div className="flex justify-between items-start">
                                    <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full font-bold">{alert.type}</span>
                                    <div className="flex items-center gap-1 text-red-600 font-bold">
                                        <Clock className="w-4 h-4" />
                                        {alert.eta}
                                    </div>
                                </div>
                                <div className="mt-3 font-medium text-slate-800">
                                    {alert.message}
                                </div>
                                <div className="mt-3 text-sm text-slate-500 flex justify-between">
                                    <span>Recommended: Prepare Trauma Team</span>
                                    <span className="text-xs text-slate-400">{new Date(alert.timestamp || Date.now()).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        ))}

                        {alerts.length === 0 && (
                            <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                                No active alerts
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
