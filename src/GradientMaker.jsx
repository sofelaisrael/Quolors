import React, { useState, useMemo } from 'react';
import Navbar from './Components/Navbar';
import Toast from './Components/Toast';
import { useCopyToClipboard } from './hooks/useCopyToClipboard';
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
  PlusCircle,
  Eye,
  EyeOff,
  Palette
} from 'lucide-react';

const GradientMaker = () => {
  const [colors, setColors] = useState(['#f72585', '#4361ee']);
  const [angle, setAngle] = useState(90);
  const [showCSS, setShowCSS] = useState(true);
  const { copyToClipboard, showNotification, notificationMessage } = useCopyToClipboard();

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
    copyToClipboard(`background: ${gradientCSS};`, 'Gradient CSS copied!');
  };

  const copyColor = (hex) => {
    copyToClipboard(hex, 'Color copied!');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-20">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-black text-gray-900 tracking-tight mb-4">Gradient Maker</h1>
          <p className="text-xl font-bold text-gray-400">Create beautiful CSS gradients for your next project</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Preview - Takes 2 columns */}
            <section className="lg:col-span-2 flex flex-col gap-8">
                {/* Gradient Preview */}
                <div className="relative group">
                    <div
                        className="h-[400px] rounded-[2rem] shadow-2xl transition-all duration-500 relative overflow-hidden border-4 border-white"
                        style={{ background: gradientCSS }}
                    >
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        
                        {/* Gradient Info Overlay */}
                        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg">
                            <div className="flex items-center gap-2">
                                <Palette size={16} className="text-blue-600" />
                                <span className="text-sm font-black text-gray-900">{colors.length} Colors</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm font-bold text-gray-600">{angle}°</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CSS Output */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                <Code size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-gray-900">CSS Code</h3>
                                <p className="text-sm text-gray-500">Click to copy gradient CSS</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowCSS(!showCSS)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title={showCSS ? 'Hide CSS' : 'Show CSS'}
                            >
                                {showCSS ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            <button
                                onClick={copyCSS}
                                className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all active:scale-95"
                                title="Copy CSS"
                            >
                                <Copy size={18} />
                            </button>
                        </div>
                    </div>
                    
                    <AnimatePresence>
                        {showCSS && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm text-gray-600 break-all leading-relaxed">
                                    background: {gradientCSS};
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Preset Gradients */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                            <Layers size={20} className="text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900">Preset Gradients</h3>
                            <p className="text-sm text-gray-500">Quick start with beautiful presets</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                            { colors: ['#667eea', '#764ba2'], name: 'Purple Dream' },
                            { colors: ['#f093fb', '#f5576c'], name: 'Pink Sunset' },
                            { colors: ['#4facfe', '#00f2fe'], name: 'Ocean Blue' },
                            { colors: ['#43e97b', '#38f9d7'], name: 'Fresh Mint' },
                            { colors: ['#fa709a', '#fee140'], name: 'Warm Sunrise' },
                            { colors: ['#30cfd0', '#330867'], name: 'Deep Ocean' }
                        ].map((preset, i) => (
                            <button
                                key={i}
                                onClick={() => setColors(preset.colors)}
                                className="h-20 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 relative overflow-hidden group"
                                style={{ background: `linear-gradient(135deg, ${preset.colors.join(', ')})` }}
                            >
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="absolute bottom-2 left-2 text-xs font-black text-white drop-shadow">
                                    {preset.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Controls - Takes 1 column */}
            <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-50 flex flex-col gap-8">
                {/* Color Controls */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Palette size={20} className="text-purple-600" />
                            <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Colors</span>
                        </div>
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-tighter">{colors.length} / 5</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        {colors.map((c, i) => (
                            <motion.div
                                layout
                                key={i}
                                className="flex items-center gap-3 group"
                            >
                                <div className="w-12 h-12 rounded-xl shadow-inner border-2 border-white" style={{ backgroundColor: c }} />
                                <input
                                    type="text"
                                    value={c}
                                    onChange={(e) => updateColor(i, e.target.value)}
                                    className="flex-1 h-12 px-4 text-lg font-black rounded-xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-blue-500 transition-all outline-none"
                                />
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => copyColor(c)}
                                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                                        title="Copy color"
                                    >
                                        <Copy size={16} />
                                    </button>
                                    {colors.length > 2 && (
                                        <button
                                            onClick={() => removeColor(i)}
                                            className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg transition-all"
                                            title="Remove color"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {colors.length < 5 && (
                            <button
                                onClick={addColor}
                                className="h-12 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center gap-2 text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all font-bold"
                            >
                                <PlusCircle size={20} />
                                Add Color
                            </button>
                        )}
                    </div>
                </div>

                {/* Angle Control */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <RefreshCw size={20} className="text-blue-600" />
                            <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Angle</span>
                        </div>
                        <span className="text-lg font-black text-gray-900">{angle}°</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={angle}
                            onChange={(e) => setAngle(e.target.value)}
                            className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 font-medium">
                            <span>0°</span>
                            <span>90°</span>
                            <span>180°</span>
                            <span>270°</span>
                            <span>360°</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <Layers size={20} className="text-green-600" />
                        <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Quick Actions</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setAngle((angle + 45) % 360)}
                            className="h-12 bg-gray-50 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-100 transition-all active:scale-95"
                        >
                            Rotate 45°
                        </button>
                        <button
                            onClick={() => setAngle((angle + 90) % 360)}
                            className="h-12 bg-gray-50 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-100 transition-all active:scale-95"
                        >
                            Rotate 90°
                        </button>
                    </div>
                </div>

                {/* Randomize Button */}
                <button
                    onClick={() => setColors(colors.map(() => chroma.random().hex()))}
                    className="h-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                    <RefreshCw size={20} />
                    Randomize Colors
                </button>
            </section>
        </div>
      </main>
      
      <Toast show={showNotification} message={notificationMessage} />
    </div>
  );
};

export default GradientMaker;
