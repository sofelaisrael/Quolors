import React, { useState, useMemo } from 'react';
import Navbar from './Components/Navbar';
import { motion } from 'framer-motion';
import chroma from 'chroma-js';
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowRightLeft,
  Settings2,
  Smartphone,
  Monitor,
  Type
} from 'lucide-react';

const ContrastGrade = ({ score, text, size }) => {
  const isPass = score >= (size === 'large' ? 3 : 4.5);
  const grade = score >= 7 ? 'AAA' : score >= 4.5 ? 'AA' : score >= 3 ? 'AA Large' : 'Fail';
  const pass = (size === 'large' && score >= 3) || (size === 'normal' && score >= 4.5);

  return (
    <div className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
      <div className="flex flex-col">
        <span className="text-sm font-black text-gray-400 uppercase tracking-tighter mb-1">{text}</span>
        <span className="text-2xl font-black text-gray-900">{grade}</span>
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${pass ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
        {pass ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
      </div>
    </div>
  );
};

function Contrast() {
  const [background, setBackground] = useState('#FFFFFF');
  const [text, setText] = useState('#264653');

  const contrastRatio = useMemo(() => {
    try {
        return chroma.contrast(text, background).toFixed(2);
    } catch {
        return 0;
    }
  }, [text, background]);

  const swapColors = () => {
    setBackground(text);
    setText(background);
  };

  const getRandomPair = () => {
    setBackground(chroma.random().hex());
    setText(chroma.random().hex());
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-20">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-black text-gray-900 tracking-tight mb-4">Contrast Checker</h1>
          <p className="text-xl font-bold text-gray-400">Ensure your designs meet accessibility standards</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Controls */}
          <section className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100">
             <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-4">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Background Color</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="color"
                            value={background}
                            onChange={(e) => setBackground(e.target.value)}
                            className="w-20 h-20 rounded-2xl cursor-pointer border-none p-0 bg-transparent overflow-hidden"
                        />
                        <input
                            type="text"
                            value={background}
                            onChange={(e) => setBackground(e.target.value)}
                            className="flex-1 h-16 px-6 text-xl font-black rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-blue-500 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="flex justify-center -my-6 relative z-10">
                    <button
                        onClick={swapColors}
                        className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-xl active:scale-90"
                    >
                        <ArrowRightLeft size={24} className="rotate-90" />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Text Color</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="color"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-20 h-20 rounded-2xl cursor-pointer border-none p-0 bg-transparent overflow-hidden"
                        />
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="flex-1 h-16 px-6 text-xl font-black rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-blue-500 transition-all outline-none"
                        />
                    </div>
                </div>

                <button
                    onClick={getRandomPair}
                    className="h-16 flex items-center justify-center gap-3 text-lg font-black bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                >
                    <RefreshCw size={24} />
                    Generate Random Pair
                </button>
             </div>
          </section>

          {/* Preview & Results */}
          <section className="flex flex-col gap-8">
             <div
                className="h-96 rounded-[2.5rem] flex flex-col items-center justify-center p-12 transition-all shadow-xl shadow-gray-100 overflow-hidden relative"
                style={{ backgroundColor: background, color: text }}
             >
                <div className="text-center z-10">
                    <h2 className="text-5xl font-black mb-4">Sample Text</h2>
                    <p className="text-lg font-medium opacity-80 leading-relaxed max-w-sm mx-auto">
                        This is a preview of how the text looks on this background. Accessibility matters for all users.
                    </p>
                </div>
                <div className="absolute top-10 right-10 flex items-center gap-3 px-4 py-2 bg-black/5 rounded-full backdrop-blur-sm">
                    <Monitor size={20} />
                    <Smartphone size={20} />
                </div>
             </div>

             <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100">
                <div className="flex items-end justify-between mb-10">
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Contrast Ratio</span>
                        <span className="text-7xl font-black text-gray-900 tracking-tighter">{contrastRatio}</span>
                    </div>
                    <div className={`px-6 py-3 rounded-2xl text-xl font-black ${contrastRatio >= 4.5 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                        {contrastRatio >= 4.5 ? 'PASS' : 'FAIL'}
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <ContrastGrade score={contrastRatio} text="Normal Text" size="normal" />
                    <ContrastGrade score={contrastRatio} text="Large Text" size="large" />
                    <ContrastGrade score={contrastRatio} text="UI Components" size="large" />
                    <div className="p-6 bg-gray-50 border border-gray-100 rounded-3xl flex items-center gap-4">
                        <Type size={24} className="text-gray-400" />
                        <span className="text-sm font-bold text-gray-500 leading-tight">WCAG 2.1 compliance for accessibility.</span>
                    </div>
                </div>
             </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Contrast;
