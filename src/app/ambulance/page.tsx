"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import MapComponent from '@/components/Map';
import { MOCK_ROUTES } from '@/lib/mock-data';
import { findBestRoute } from '@/lib/routing-engine';
import { AlertTriangle, Siren, MapPin, Activity, UserPlus, Send, Stethoscope, Lock, CheckCircle, Zap, Trash2, Users } from 'lucide-react';

export default function AmbulancePage() {
    const [isEmergency, setIsEmergency] = useState(false);
    const [bestRoute, setBestRoute] = useState<any | null>(null);
    const [greenCorridorRequested, setGreenCorridorRequested] = useState(false);

    // Patient List State
    const [patients, setPatients] = useState<any[]>([]);
    const [showAddPatient, setShowAddPatient] = useState(false);
    const [newPatient, setNewPatient] = useState({
        condition: 'Cardiac Arrest',
        age: '',
        gender: 'Male',
        notes: ''
    });

    // Hospital Resources State
    const [hospitalResources, setHospitalResources] = useState<any>(null);
    const [requestStatus, setRequestStatus] = useState<'IDLE' | 'PENDING' | 'APPROVED'>('IDLE');

    // Live Signals State
    const [liveSignals, setLiveSignals] = useState<any[]>([]);

    useEffect(() => {
        // 1. Sync Hospital Resources
        const checkApproval = () => {
            const approvalData = localStorage.getItem('hospital_data_approved');
            if (approvalData) {
                setHospitalResources(JSON.parse(approvalData));
                setRequestStatus('APPROVED');
                localStorage.removeItem('hospital_data_approved');
            }
        };

        // 2. Sync Traffic Signals
        const checkSignals = () => {
            const signalsData = localStorage.getItem('traffic_signals');
            if (signalsData) {
                setLiveSignals(JSON.parse(signalsData));
            }
        };

        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'hospital_data_approved') checkApproval();
            if (e.key === 'traffic_signals') checkSignals();
        };

        window.addEventListener('storage', handleStorage);
        const interval = setInterval(() => {
            checkApproval();
            checkSignals();
        }, 1000);

        checkSignals();

        return () => {
            window.removeEventListener('storage', handleStorage);
            clearInterval(interval);
        };
    }, []);

    const handleStartEmergency = () => {
        setIsEmergency(true);
        // @ts-ignore
        const best = findBestRoute(MOCK_ROUTES);
        setBestRoute(best as any);
    };

    const handleGreenCorridor = () => {
        setGreenCorridorRequested(true);
        alert("Green Corridor Request Sent to Traffic Control!");
        const requestData = {
            type: 'GREEN_CORRIDOR_REQUEST',
            ambulanceId: 'AMB-101',
            location: 'Sector 42 Intersection',
            timestamp: Date.now()
        };
        localStorage.setItem('traffic_alert', JSON.stringify(requestData));
        window.dispatchEvent(new Event('storage'));
    };

    const handleAddPatient = () => {
        if (!newPatient.condition || !newPatient.age) {
            alert("Please fill in Condition and Age");
            return;
        }
        const patient = {
            id: Date.now(),
            ...newPatient,
            status: 'DRAFT'
        };
        setPatients(prev => [...prev, patient]);
        setNewPatient({ condition: 'Cardiac Arrest', age: '', gender: 'Male', notes: '' });
        setShowAddPatient(false);
    };

    const handleRemovePatient = (id: number) => {
        setPatients(prev => prev.filter(p => p.id !== id));
    };

    const handleSendAlert = (patient: any) => {
        const alertPayload = {
            id: patient.id,
            type: 'CRITICAL',
            eta: '12 min',
            message: `${patient.condition} - ${patient.gender} ${patient.age}yo`,
            timestamp: Date.now()
        };
        localStorage.setItem('hospital_alert', JSON.stringify(alertPayload));
        window.dispatchEvent(new Event('storage'));

        setPatients(prev => prev.map(p => p.id === patient.id ? { ...p, status: 'SENT' } : p));
        alert(`Alert sent for ${patient.condition}!`);
    };

    const handleRequestHospitalData = () => {
        setRequestStatus('PENDING');
        localStorage.setItem('hospital_data_request', JSON.stringify({
            ambulanceId: 'AMB-101',
            timestamp: Date.now()
        }));
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-6 font-sans">
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10">
                        <Image src="/logo.jpg" alt="RapidResQ" fill className="object-cover" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Ambulance Command</h1>
                        <div className="text-xs font-bold text-blue-400 tracking-wider">RAPIDRESQ SYSTEM</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-medium text-green-400">System Online</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel: Controls */}
                <div className="space-y-6">

                    {/* Hospital Status Card */}
                    <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 shadow-xl">
                        <h2 className="text-lg font-semibold mb-3 text-blue-400 flex items-center gap-2">
                            <Stethoscope className="w-5 h-5" />
                            Nearest Hospital Status
                        </h2>

                        {requestStatus === 'IDLE' && (
                            <div className="text-center py-4">
                                <p className="text-neutral-500 text-sm mb-3">Data Locked by Hospital Admin</p>
                                <button
                                    onClick={handleRequestHospitalData}
                                    className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 mx-auto"
                                >
                                    <Lock className="w-4 h-4" /> Request Access
                                </button>
                            </div>
                        )}

                        {requestStatus === 'PENDING' && (
                            <div className="text-center py-4">
                                <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                                <p className="text-blue-300 text-sm animate-pulse">Waiting for Approval...</p>
                            </div>
                        )}

                        {requestStatus === 'APPROVED' && hospitalResources && (
                            <div className="animate-in fade-in zoom-in duration-300">
                                <div className="flex justify-center mb-4 text-green-400 text-xs font-bold items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> Access Granted
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="p-2 bg-neutral-700/50 rounded border border-neutral-600">
                                        <div className="text-xs text-neutral-400">ICU Beds</div>
                                        <div className={`font-bold ${hospitalResources.icuBeds > 0 ? 'text-green-400' : 'text-red-500'}`}>
                                            {hospitalResources.icuBeds}
                                        </div>
                                    </div>
                                    <div className="p-2 bg-neutral-700/50 rounded border border-neutral-600">
                                        <div className="text-xs text-neutral-400">Ventilators</div>
                                        <div className={`font-bold ${hospitalResources.ventilators > 0 ? 'text-purple-400' : 'text-red-500'}`}>
                                            {hospitalResources.ventilators}
                                        </div>
                                    </div>
                                    <div className="p-2 bg-neutral-700/50 rounded border border-neutral-600">
                                        <div className="text-xs text-neutral-400">Doctors</div>
                                        <div className="font-bold text-white">{hospitalResources.doctors}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* LIVE SIGNALS CARD */}
                    <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 shadow-xl">
                        <h2 className="text-lg font-semibold mb-3 text-yellow-500 flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            Live Route Signals
                        </h2>
                        <div className="space-y-2">
                            {liveSignals.length === 0 && <p className="text-neutral-500 text-sm">No Signal Data...</p>}
                            {liveSignals.map(sig => (
                                <div key={sig.id} className="flex justify-between items-center bg-neutral-700/30 p-2 rounded border border-neutral-700">
                                    <span className="text-xs font-medium text-neutral-300">{sig.name}</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${sig.state === 'GREEN' ? 'bg-green-900 text-green-400 border border-green-700' : 'bg-red-900 text-red-400 border border-red-700'}`}>
                                        {sig.state}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 shadow-xl">
                        <h2 className="text-lg font-semibold mb-4 text-neutral-200">Emergency Status</h2>
                        {!isEmergency ? (
                            <button
                                onClick={handleStartEmergency}
                                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg shadow-lg shadow-red-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <AlertTriangle className="w-6 h-6" />
                                START EMERGENCY
                            </button>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-200 flex items-center gap-3">
                                    <Activity className="w-6 h-6 animate-pulse" />
                                    <span className="font-semibold">EMERGENCY MODE ACTIVE</span>
                                </div>

                                <button
                                    onClick={handleGreenCorridor}
                                    disabled={greenCorridorRequested}
                                    className={`w-full py-3 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${greenCorridorRequested ? 'bg-green-700 text-white cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 text-black'}`}
                                >
                                    {greenCorridorRequested ? 'Signal Requested' : 'Request Green Corridor'}
                                </button>

                                {/* MULTI-PATIENT MANAGEMENT */}
                                <div className="bg-neutral-700/30 rounded-lg p-4 border border-neutral-600">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-bold text-sm text-blue-300 flex items-center gap-2">
                                            <Users className="w-4 h-4" /> Patients Onboard ({patients.length})
                                        </h3>
                                        {!showAddPatient && (
                                            <button
                                                onClick={() => setShowAddPatient(true)}
                                                className="bg-blue-600 hover:bg-blue-500 p-1.5 rounded text-white"
                                            >
                                                <UserPlus className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Add Patient Form */}
                                    {showAddPatient && (
                                        <div className="bg-neutral-800 p-3 rounded mb-3 border border-blue-500/30 animate-in fade-in zoom-in">
                                            <input
                                                type="text"
                                                placeholder="Condition (e.g. Trauma)"
                                                className="w-full bg-neutral-900 border border-neutral-600 rounded p-2 text-sm mb-2"
                                                value={newPatient.condition}
                                                onChange={e => setNewPatient({ ...newPatient, condition: e.target.value })}
                                            />
                                            <div className="flex gap-2 mb-2">
                                                <input
                                                    type="number"
                                                    placeholder="Age"
                                                    className="w-1/3 bg-neutral-900 border border-neutral-600 rounded p-2 text-sm"
                                                    value={newPatient.age}
                                                    onChange={e => setNewPatient({ ...newPatient, age: e.target.value })}
                                                />
                                                <select
                                                    className="w-2/3 bg-neutral-900 border border-neutral-600 rounded p-2 text-sm"
                                                    value={newPatient.gender}
                                                    onChange={e => setNewPatient({ ...newPatient, gender: e.target.value })}
                                                >
                                                    <option>Male</option>
                                                    <option>Female</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => setShowAddPatient(false)} className="flex-1 py-1 text-xs text-neutral-400 bg-neutral-700 rounded hover:bg-neutral-600">Cancel</button>
                                                <button onClick={handleAddPatient} className="flex-1 py-1 text-xs font-bold text-white bg-blue-600 rounded hover:bg-blue-500">Add Patient</button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Patient List */}
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {patients.length === 0 && !showAddPatient && (
                                            <div className="text-center text-neutral-500 text-xs py-2 italic">No patients added</div>
                                        )}
                                        {patients.map(p => (
                                            <div key={p.id} className="bg-neutral-800 p-3 rounded border border-neutral-600 flex justify-between items-center group">
                                                <div>
                                                    <div className="font-bold text-sm text-neutral-200">{p.condition}</div>
                                                    <div className="text-xs text-neutral-500">{p.gender}, {p.age}yo</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {p.status === 'SENT' ? (
                                                        <span className="text-xs lg:text-[10px] text-green-400 font-bold border border-green-900 bg-green-900/20 px-2 py-1 rounded">NOTIFIED</span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleSendAlert(p)}
                                                            className="bg-blue-600/20 hover:bg-blue-600 hover:text-white text-blue-400 border border-blue-600/50 p-1.5 rounded transition-all"
                                                            title="Notify Hospital"
                                                        >
                                                            <Send className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleRemovePatient(p.id)} className="text-neutral-600 hover:text-red-400">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>

                    {[bestRoute].map(route => route && (
                        <div key={route.id} className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-lg font-semibold mb-4 text-blue-400 flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                AI Recommended Route
                            </h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-neutral-700/50 rounded-lg border border-neutral-600">
                                    <div className="text-2xl font-bold text-white mb-1">{route.name}</div>
                                    <div className="flex justify-between text-sm text-neutral-400 mt-2">
                                        <span>Score: {route.finalScore.toFixed(1)}</span>
                                        <span>{route.distanceKm} km</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="p-2 bg-neutral-700/30 rounded">
                                        <div className="text-xs text-neutral-400">Traffic</div>
                                        <div className="font-bold text-yellow-400">{route.trafficScore}</div>
                                    </div>
                                    <div className="p-2 bg-neutral-700/30 rounded">
                                        <div className="text-xs text-neutral-400">Signals</div>
                                        <div className="font-bold text-blue-400">{route.signalCount}</div>
                                    </div>
                                    <div className="p-2 bg-neutral-700/30 rounded">
                                        <div className="text-xs text-neutral-400">ETA</div>
                                        <div className="font-bold text-green-400">~15m</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Panel: Map */}
                <div className="lg:col-span-2 bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden shadow-xl min-h-[500px] relative">
                    <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10">
                        Live Traffic Feed
                    </div>
                    {/* Pass Route Coordinates Here */}
                    <MapComponent routeCoordinates={bestRoute?.coordinates} />
                </div>
            </div>
        </div>
    );
}
