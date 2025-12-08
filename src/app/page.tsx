import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Activity, ShieldCheck, Siren, Shield, Stethoscope } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.jpg"
                alt="RapidResQ Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">RapidResQ</span>
          </div>
          <div className="text-sm font-medium text-slate-500">
            AI-Powered Emergency Response
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              Live System Active
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1]">
              Faster Routes.<br />
              <span className="text-blue-600">Saved Lives.</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
              RapidResQ uses AI traffic prediction and green corridors to reduce ambulance response times by up to 40%.
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#dashboards" className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20">
                Launch System <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-50"></div>
            <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                    <Siren className="w-8 h-8 text-red-600 mb-3" />
                    <div className="text-2xl font-bold text-slate-900">12 min</div>
                    <div className="text-sm text-slate-500">Avg Response Time</div>
                  </div>
                  <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <Activity className="w-8 h-8 text-green-600 mb-3" />
                    <div className="text-2xl font-bold text-slate-900">98%</div>
                    <div className="text-sm text-slate-500">Route Efficiency</div>
                  </div>
                </div>
                <div className="bg-slate-900 p-6 rounded-xl text-white flex flex-col justify-between">
                  <Shield className="w-8 h-8 text-blue-400" />
                  <div>
                    <div className="text-3xl font-bold mb-1">Zero</div>
                    <div className="text-blue-200 text-sm">Traffic Delays in Green Corridors</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portals Section */}
      <div id="dashboards" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Command Centers</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Select your role to enter the specific dashboard. Real-time synchronization is active across all portals.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Ambulance Card */}
            <Link href="/ambulance" className="group bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="bg-red-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Siren className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Ambulance Driver</h3>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Access AI navigation, request green corridors, and send patient vitals to hospitals.
              </p>
              <div className="flex items-center text-red-600 font-bold group-hover:gap-2 transition-all">
                Enter Dashboard <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            {/* Traffic Control Card */}
            <Link href="/admin" className="group bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="bg-slate-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Traffic Control</h3>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Monitor active units, control traffic signals, and approve green corridor requests.
              </p>
              <div className="flex items-center text-slate-700 font-bold group-hover:gap-2 transition-all">
                Enter Dashboard <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            {/* Hospital Card */}
            <Link href="/hospital" className="group bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Hospital Admin</h3>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Manage resource availability (ICU/Beds) and receive incoming critical patient alerts.
              </p>
              <div className="flex items-center text-blue-600 font-bold group-hover:gap-2 transition-all">
                Enter Dashboard <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-slate-200 py-12 text-center text-slate-400 text-sm">
        <p>&copy; 2024 RapidResQ System. All rights reserved.</p>
      </footer>
    </div>
  );
}
