import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from './Components/Navbar';
import { motion } from 'framer-motion';
import {
  Monitor,
  Smartphone,
  Layout,
  ExternalLink,
  Layers,
  CreditCard,
  Palette
} from 'lucide-react';

const MockLandingPage = ({ colors }) => {
  const bg = colors[0]?.hex || '#FFFFFF';
  const primary = colors[1]?.hex || '#264653';
  const secondary = colors[2]?.hex || '#2a9d8f';
  const accent = colors[3]?.hex || '#e9c46a';
  const text = colors[4]?.hex || '#222222';

  return (
    <div className="w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[600px]">
        <div className="flex-1 flex flex-col">
            <header className="h-16 flex items-center justify-between px-8 border-b border-gray-50">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: primary }} />
                    <span className="font-bold text-gray-900">Brand</span>
                </div>
                <div className="flex gap-4">
                    <div className="w-4 h-4 rounded-full bg-gray-100" />
                    <div className="w-4 h-4 rounded-full bg-gray-100" />
                </div>
            </header>
            <main className="flex-1 p-12 flex flex-col justify-center gap-8">
                <div className="flex flex-col gap-4">
                    <div className="h-4 w-32 rounded-full" style={{ backgroundColor: secondary, opacity: 0.2 }} />
                    <h2 className="text-4xl font-black leading-none" style={{ color: text }}>
                        Beautiful designs, <br /> simplified.
                    </h2>
                    <p className="text-lg font-medium text-gray-400 max-w-sm">
                        Visualize how your color palette looks on real-world UI components.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="px-8 py-3 rounded-xl font-bold text-white shadow-lg" style={{ backgroundColor: primary }}>
                        Get Started
                    </button>
                    <button className="px-8 py-3 rounded-xl font-bold border-2" style={{ borderColor: secondary, color: secondary }}>
                        Learn More
                    </button>
                </div>
            </main>
        </div>
        <div className="flex-1 p-12 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: bg }}>
            <div className="grid grid-cols-2 gap-6 w-full relative z-10">
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-50 flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-2xl" style={{ backgroundColor: accent }} />
                    <div className="h-3 w-20 rounded-full bg-gray-100" />
                    <div className="h-3 w-32 rounded-full bg-gray-50" />
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-50 flex flex-col gap-4 translate-y-8">
                    <CreditCard size={24} style={{ color: primary }} />
                    <div className="h-3 w-24 rounded-full bg-gray-100" />
                    <div className="h-3 w-16 rounded-full" style={{ backgroundColor: secondary }} />
                </div>
                <div className="col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-gray-50 flex items-center justify-between -translate-x-4">
                    <div className="flex flex-col gap-3">
                        <div className="h-4 w-40 rounded-full" style={{ backgroundColor: primary }} />
                        <div className="h-3 w-24 rounded-full bg-gray-100" />
                    </div>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                        <Layout size={24} style={{ color: text }} />
                    </div>
                </div>
            </div>
            {/* Abstract Background Shapes */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: secondary, opacity: 0.1 }} />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: accent, opacity: 0.1 }} />
        </div>
    </div>
  );
};

function Visualizer() {
  const colors = useSelector(state => state.palette.colors);
  const [device, setDevice] = useState('desktop');

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-20">
        <header className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="text-center md:text-left">
            <h1 className="text-6xl font-black text-gray-900 tracking-tight mb-4">Palette Visualizer</h1>
            <p className="text-xl font-bold text-gray-400">Check your colors on real designs in real-time</p>
          </div>
          <div className="flex bg-white rounded-2xl border border-gray-100 p-1.5 shadow-sm">
            <button
                onClick={() => setDevice('desktop')}
                className={`p-4 rounded-xl transition-all ${device === 'desktop' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
            >
                <Monitor size={24} />
            </button>
            <button
                onClick={() => setDevice('mobile')}
                className={`p-4 rounded-xl transition-all ${device === 'mobile' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
            >
                <Smartphone size={24} />
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-4 gap-12">
            {/* Current Palette Sidebar */}
            <aside className="lg:col-span-1 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-50 flex flex-col gap-6 self-start">
                <div className="flex items-center gap-2 mb-2">
                    <Palette size={20} className="text-blue-600" />
                    <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Active Palette</span>
                </div>
                <div className="flex flex-col gap-4">
                    {colors.map((c, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-xl shadow-inner" style={{ backgroundColor: c.hex }} />
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">{c.hex}</span>
                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Color {i + 1}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <Link to="/Generate" className="mt-4 flex items-center justify-center gap-2 h-14 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl transition-all font-bold text-sm">
                    <ExternalLink size={18} />
                    Edit Palette
                </Link>
            </aside>

            {/* Preview Area */}
            <section className="lg:col-span-3 flex justify-center">
                <div className={`transition-all duration-500 ${device === 'mobile' ? 'max-w-sm w-full' : 'w-full'}`}>
                    <MockLandingPage colors={colors} />
                </div>
            </section>
        </div>
      </main>
    </div>
  );
}

export default Visualizer;
