import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  generatePalette,
  undo,
  redo,
  setTheoryRule,
  reorderColors,
  addColumn,
  removeColumn,
  toggleLock,
  updateColor,
  setPalette
} from './store/slices/paletteSlice';
import {
  Lock,
  Unlock,
  Plus,
  X,
  GripVertical,
  Copy,
  Heart,
  Undo2,
  Redo2,
  Maximize2,
  Layers,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import { motion, Reorder, AnimatePresence, useDragControls } from 'framer-motion';
import chroma from 'chroma-js';
import { toggleFavorite } from './store/slices/favoritesSlice';
import Navbar from './Components/Navbar';
import ExportModal from './Components/ExportModal';

const ColorBar = ({ color, index, total }) => {
  const dispatch = useDispatch();
  const [showShades, setShowShades] = useState(false);
  const contrastColor = chroma.contrast(color.hex, 'black') > 4.5 ? 'black' : 'white';
  const dragControls = useDragControls();

  // Dynamic text sizing based on number of columns
  const getTextSize = () => {
    if (total >= 9) return 'text-lg';
    if (total >= 7) return 'text-xl';
    if (total >= 5) return 'text-2xl';
    return 'text-3xl';
  };

  const getNameSize = () => {
    if (total >= 9) return 'text-xs';
    if (total >= 7) return 'text-xs';
    if (total >= 5) return 'text-xs';
    return 'text-sm';
  };

  // Dynamic spacing and padding based on number of columns
  const getPadding = () => {
    if (total >= 9) return 'px-2';
    if (total >= 7) return 'px-3';
    return 'px-4';
  };

  const getButtonPadding = () => {
    if (total >= 9) return 'p-2';
    if (total >= 7) return 'p-2.5';
    return 'p-3';
  };

  const getButtonSize = () => {
    if (total >= 9) return 18;
    if (total >= 7) return 20;
    return 22;
  };

  const getIconSize = () => {
    if (total >= 9) return 24;
    if (total >= 7) return 28;
    return 32;
  };

  useEffect(() => {
    // Fetch a better name from The Color API
    const fetchPremiumName = async () => {
      try {
        const response = await fetch(`https://www.thecolorapi.com/id?hex=${color.hex.replace('#', '')}`);
        const data = await response.json();
        if (data.name && data.name.value !== color.name) {
          dispatch(updateColor({ id: color.id, name: data.name.value }));
        }
      } catch (error) {
        console.error("Failed to fetch name:", error);
      }
    };
    fetchPremiumName();
  }, [color.hex, color.id, dispatch]);

  const shades = chroma.scale([
    chroma(color.hex).darken(2).hex(),
    color.hex,
    chroma(color.hex).brighten(2).hex()
  ]).colors(9);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(color.hex.toUpperCase());
  };

  return (
    <Reorder.Item
      value={color}
      dragListener={false}
      dragControls={dragControls}
      className="flex-1 flex flex-col items-center justify-center group h-full relative overflow-hidden transition-colors duration-200"
      style={{ backgroundColor: color.hex, color: contrastColor }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 pointer-events-none" />

      {/* Top Controls */}
      <div className="absolute top-10 flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        <button
          onClick={() => dispatch(removeColumn(color.id))}
          className={`${getButtonPadding()} hover:bg-black/10 rounded-full transition-colors`}
          title="Remove Color"
        >
          <X size={getButtonSize()} />
        </button>
        <div
          onPointerDown={(e) => dragControls.start(e)}
          className={`cursor-grab active:cursor-grabbing ${getButtonPadding()} hover:bg-black/10 rounded-full transition-colors`}
          title="Drag to Reorder"
        >
          <GripVertical size={getButtonSize()} />
        </div>
      </div>

      {/* Main Color Info */}
      <div className="flex flex-col items-center gap-2 z-10 select-none">
        <button
          onClick={() => dispatch(toggleLock(color.id))}
          className={`p-4 hover:bg-black/10 rounded-2xl transition-all mb-8 ${color.locked ? 'bg-black/5' : ''}`}
        >
          {color.locked ? <Lock size={getIconSize()} fill="currentColor" /> : <Unlock size={getIconSize()} />}
        </button>

        <h2
          className={`${getTextSize()} font-black tracking-widest cursor-pointer hover:scale-105 transition-transform uppercase drop-shadow-sm mb-1`}
          onClick={copyToClipboard}
        >
          {color.hex.replace('#', '')}
        </h2>

        <p className={`${getNameSize()} h-5 font-black opacity-40 uppercase tracking-[0.2em] max-w-[120px] text-center leading-tight`}>
          {color.name || 'Loading...'}
        </p>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-12 flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-[-8px] group-hover:translate-y-0 transition-all duration-300">
        <button
          onClick={() => setShowShades(!showShades)}
          className={`${getButtonPadding()} hover:bg-black/10 rounded-full transition-colors`}
          title="Show Shades"
        >
          <Layers size={getButtonSize()} />
        </button>
        <button
          onClick={copyToClipboard}
          className={`${getButtonPadding()} hover:bg-black/10 rounded-full transition-colors`}
          title="Copy HEX"
        >
          <Copy size={getButtonSize()} />
        </button>
      </div>

      {/* Shades Panel */}
      <AnimatePresence>
        {showShades && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-32 bg-white rounded-[24px] shadow-2xl p-2.5 flex flex-col gap-1.5 z-50 border border-gray-100"
          >
            {shades.map((s, i) => (
              <div
                key={i}
                onClick={() => {
                  dispatch(updateColor({ id: color.id, hex: s }));
                  setShowShades(false);
                }}
                className="w-14 h-11 rounded-xl cursor-pointer hover:scale-110 transition-transform shadow-sm"
                style={{ backgroundColor: s }}
                title={s}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Column Button */}
      <button
        onClick={() => dispatch(addColumn(index + 1))}
        className={`absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white text-black rounded-full shadow-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 transition-all z-20 border border-gray-50 text-gray-400 hover:text-black ${total >= 9 ? '-right-3 w-7 h-7' : ''}`}
      >
        <Plus size={total >= 9 ? 16 : 20} strokeWidth={3} />
      </button>
    </Reorder.Item>
  );
};

function Generate() {
  const dispatch = useDispatch();
  const colors = useSelector((state) => state.palette.colors);
  const theoryRule = useSelector((state) => state.palette.theoryRule);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [fromVisualizer, setFromVisualizer] = useState(false);

  // Load palette from URL if specified and check if coming from visualizer
  useEffect(() => {
    const fromParam = searchParams.get('from');
    setFromVisualizer(fromParam === 'visualizer');
    
    const paletteName = searchParams.get('palette');
    if (paletteName) {
      // Find the palette in our explore collection
      const EXPLORE_PALETTES = [
        { name: 'ocean-breeze', colors: ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'] },
        { name: 'sunset-vibrance', colors: ['#f72585', '#b5179e', '#7209b7', '#560bad', '#480ca8', '#3f37c9', '#4361ee', '#4cc9f0'] },
        { name: 'fire-gradient', colors: ['#03071e', '#370617', '#6a040f', '#9d0208', '#d00000', '#dc2f02', '#e85d04', '#f48c06', '#faa307', '#ffba08'] },
        { name: 'coastal-waters', colors: ['#ffffff', '#8ecae6', '#219ebc', '#023047', '#ffb703', '#fb8500'] },
        { name: 'forest-moss', colors: ['#dad7cd', '#a3b18a', '#588157', '#3a5a40', '#344e41'] },
        { name: 'coral-reef', colors: ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#073b4c'] },
        { name: 'cotton-candy', colors: ['#ff99c8', '#fcf6bd', '#d0f4de', '#a9def9', '#e4c1f9'] },
        { name: 'deep-sea', colors: ['#001219', '#005f73', '#0ae88c', '#94d2bd', '#e9d8a6', '#ee9b00', '#ca6702', '#bb3e03', '#ae2012', '#9b2226'] },
        { name: 'minimal-gray', colors: ['#353535', '#3c6e71', '#ffffff', '#d9d9d9', '#284b63'] },
        { name: 'autumn-warmth', colors: ['#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f', '#90be6d', '#43aa8b', '#4d908e', '#577590', '#277da1'] },
        { name: 'vintage-dust', colors: ['#22223b', '#4a4e69', '#9a8c98', '#c9ada7', '#f2e9e4'] },
        { name: 'earth-tones', colors: ['#606c38', '#283618', '#fefae0', '#dda15e', '#bc6c25'] },
        { name: 'peach-blush', colors: ['#ffcdb2', '#ffb4a2', '#e5989b', '#b5838d', '#6d597a'] },
        { name: 'tropical-mix', colors: ['#118ab2', '#073b4c', '#ffd166', '#06d6a0', '#ef476f'] },
        { name: 'midnight-blue', colors: ['#2b2d42', '#8d99ae', '#edf2f4', '#ef233c', '#d90429'] },
        { name: 'desert-sun', colors: ['#003049', '#d62828', '#f77f00', '#fcbf49', '#eae2b7'] },
      ];
      
      const palette = EXPLORE_PALETTES.find(p => p.name === paletteName);
      if (palette) {
        const paletteObj = palette.colors.map(hex => ({
          hex,
          locked: false,
          id: Math.random().toString(36).substr(2, 9),
        }));
        dispatch(setPalette(paletteObj));
      }
    }
  }, [searchParams, dispatch]);

  const handleKeyDown = useCallback((e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      dispatch(generatePalette());
    }
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    // Initialize history with current colors if history is empty
    dispatch(setPalette(colors));
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <Navbar />

      {/* Toolbar */}
      <div className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white z-30 shadow-[0_1px_5px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-10">
          {fromVisualizer && (
            <button
              onClick={() => navigate('/Visualizer')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-all"
            >
              <ArrowLeft size={16} />
              Back to Visualizer
            </button>
          )}
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-0.5 leading-none">Shortcut</span>
            <span className="text-xs text-gray-500 font-bold leading-none italic">Press <kbd className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-gray-900 not-italic font-black">Space</kbd> to generate!</span>
          </div>

          <div className="flex items-center gap-3 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100/50">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-3">Mode</span>
            <select
              value={theoryRule}
              onChange={(e) => dispatch(setTheoryRule(e.target.value))}
              className="h-9 px-4 text-xs font-black bg-white border-2 border-gray-100 rounded-[14px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer transition-all shadow-sm"
            >
              {['Random', 'Monochromatic', 'Analogous', 'Complementary', 'Triadic'].map(rule => (
                <option key={rule} value={rule}>{rule}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100/50 mr-4">
            <button
              onClick={() => dispatch(undo())}
              className="p-2.5 hover:bg-white rounded-[12px] transition-all text-gray-400 hover:text-black hover:shadow-sm"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={20} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => dispatch(redo())}
              className="p-2.5 hover:bg-white rounded-[12px] transition-all text-gray-400 hover:text-black hover:shadow-sm"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={20} strokeWidth={2.5} />
            </button>
          </div>

          <div className="w-px h-8 bg-gray-100 mx-2" />

          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-2.5 px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-100 rounded-2xl transition-all font-black text-sm active:scale-95 shadow-sm"
          >
            <Layers size={18} strokeWidth={2.5} />
            <span>Export</span>
          </button>

          <button
            onClick={() => dispatch(toggleFavorite(colors))}
            className="flex items-center gap-2.5 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all font-black text-sm shadow-xl shadow-blue-100 active:scale-95 scale-105 ml-2"
          >
            <Heart size={18} fill="currentColor" strokeWidth={2.5} />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Generator Area */}
      <Reorder.Group
        axis="x"
        values={colors}
        onReorder={(newOrder) => dispatch(reorderColors(newOrder))}
        className="flex-1 flex overflow-hidden w-full"
      >
        {colors.map((color, index) => (
          <ColorBar
            key={color.id}
            color={color}
            index={index}
            total={colors.length}
          />
        ))}
      </Reorder.Group>

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
}

export default Generate;
