import React, { useState, useMemo } from 'react';
import Navbar from './Components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import chroma from 'chroma-js';
import {
  ArrowRight,
  RefreshCw,
  Copy,
  Code,
  Layers,
  GripVertical,
  Plus,
  X,
  PlusCircle
} from 'lucide-react';

const GradientMaker = () => {
  const [colors, setColors] = useState(['#f72585', '#4361ee']);
  const [angle, setAngle] = useState(90);

  const gradientCSS = useMemo(() => {
    return `linear-gradient(${angle}deg, ${colors.join(', ')})`;
  }, [colors, angle]);

  const addColor = () => {
    if (colors.length < 5) {
        setColors([...colors, chroma.random().hex()]);
    }
  };

  const removeColor = (index) => {
    if (colors.length > 2) {
        setColors(colors.filter((_, i) => i !== index));
    }
  };

  const updateColor = (index, hex) => {
    const newColors = [...colors];
    newColors[index] = hex;
    setColors(newColors);
  };

  const copyCSS = () => {
    navigator.clipboard.writeText(`background: ${gradientCSS};`);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-20">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-black text-gray-900 tracking-tight mb-4">Gradient Maker</h1>
          <p className="text-xl font-bold text-gray-400">Create beautiful CSS gradients for your next project</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Preview */}
            <section className="flex flex-col gap-8">
                <div
                    className="h-[500px] rounded-[3rem] shadow-2xl transition-all duration-500 relative overflow-hidden group border-8 border-white"
                    style={{ background: gradientCSS }}
                >
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Code size={20} className="text-blue-600" />
                            <span className="text-sm font-black text-gray-900 uppercase tracking-widest">CSS Output</span>
                        </div>
                        <button
                            onClick={copyCSS}
                            className="p-3 hover:bg-gray-50 rounded-xl transition-all text-blue-600 active:scale-90"
                        >
                            <Copy size={20} />
                        </button>
                    </div>
                    <code className="block p-6 bg-gray-50 rounded-2xl font-mono text-sm text-gray-600 break-all leading-relaxed">
                        background: {gradientCSS};
                    </code>
                </div>
            </section>

            {/* Controls */}
            <section className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-50 flex flex-col gap-10">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Gradient Colors</label>
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-tighter">{colors.length} / 5</span>
                    </div>
                    <div className="flex flex-col gap-4">
                        {colors.map((c, i) => (
                            <motion.div
                                layout
                                key={i}
                                className="flex items-center gap-4 group"
                            >
                                <div className="w-16 h-16 rounded-2xl shadow-inner border-2 border-white" style={{ backgroundColor: c }} />
                                <input
                                    type="text"
                                    value={c}
                                    onChange={(e) => updateColor(i, e.target.value)}
                                    className="flex-1 h-16 px-6 text-xl font-black rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-blue-500 transition-all outline-none"
                                />
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => removeColor(i)}
                                        className="p-3 hover:bg-rose-50 text-rose-500 rounded-xl transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                        {colors.length < 5 && (
                            <button
                                onClick={addColor}
                                className="h-16 border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center gap-2 text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all font-bold"
                            >
                                <PlusCircle size={24} />
                                Add color
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Angle</label>
                        <span className="text-xl font-black text-gray-900">{angle}°</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={angle}
                        onChange={(e) => setAngle(e.target.value)}
                        className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                <button
                    onClick={() => setColors(colors.map(() => chroma.random().hex()))}
                    className="h-20 bg-gray-900 text-white text-xl font-black rounded-3xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-95 mt-4"
                >
                    <RefreshCw size={24} />
                    Randomize Gradient
                </button>
            </section>
        </div>
      </main>
    </div>
  );
};

export default GradientMaker;
