import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  ChevronDown
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
      className="flex-1 flex flex-col items-center justify-center group h-full relative overflow-hidden"
      style={{ backgroundColor: color.hex, color: contrastColor }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 pointer-events-none" />

      {/* Top Controls */}
      <div className="absolute top-8 flex flex-col gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => dispatch(removeColumn(color.id))}
          className="p-2 hover:bg-black/10 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
        <div
          onPointerDown={(e) => dragControls.start(e)}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-black/10 rounded-full transition-colors"
        >
          <GripVertical size={20} />
        </div>
      </div>

      {/* Main Color Info */}
      <div className="flex flex-col items-center gap-4 z-10">
         <button
          onClick={() => dispatch(toggleLock(color.id))}
          className="p-3 hover:bg-black/10 rounded-xl transition-all mb-4"
        >
          {color.locked ? <Lock size={28} fill="currentColor" /> : <Unlock size={28} />}
        </button>

        <h2
          className="text-2xl font-bold tracking-wider cursor-pointer hover:scale-105 transition-transform uppercase"
          onClick={copyToClipboard}
        >
          {color.hex.replace('#', '')}
        </h2>

        <p className="text-sm font-medium opacity-60 uppercase tracking-widest">
          {chroma(color.hex).name()}
        </p>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-12 flex flex-col gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setShowShades(!showShades)}
          className="p-2 hover:bg-black/10 rounded-full transition-colors"
        >
          <Layers size={20} />
        </button>
        <button
          onClick={copyToClipboard}
          className="p-2 hover:bg-black/10 rounded-full transition-colors"
        >
          <Copy size={20} />
        </button>
      </div>

      {/* Shades Panel */}
      <AnimatePresence>
        {showShades && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 bg-white rounded-xl shadow-2xl p-2 flex flex-col gap-1 z-50"
          >
            {shades.map((s, i) => (
              <div
                key={i}
                onClick={() => {
                    dispatch(updateColor({ id: color.id, hex: s }));
                    setShowShades(false);
                }}
                className="w-12 h-10 rounded-md cursor-pointer hover:scale-110 transition-transform"
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
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white text-black rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 transition-all z-20 border border-gray-100"
      >
        <Plus size={16} />
      </button>
    </Reorder.Item>
  );
};

function Generate() {
  const dispatch = useDispatch();
  const colors = useSelector((state) => state.palette.colors);
  const theoryRule = useSelector((state) => state.palette.theoryRule);
  const [isExportOpen, setIsExportOpen] = useState(false);

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
      <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 bg-white z-30">
        <div className="flex items-center gap-8">
            <span className="text-sm text-gray-400 font-medium">Press <kbd className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-gray-600">Space</kbd> to generate!</span>

            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Rule:</span>
                <select
                    value={theoryRule}
                    onChange={(e) => dispatch(setTheoryRule(e.target.value))}
                    className="h-8 px-3 text-xs font-bold bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                    {['Random', 'Monochromatic', 'Analogous', 'Complementary', 'Triadic'].map(rule => (
                        <option key={rule} value={rule}>{rule}</option>
                    ))}
                </select>
            </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => dispatch(undo())}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            title="Undo"
          >
            <Undo2 size={20} />
          </button>
          <button
            onClick={() => dispatch(redo())}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            title="Redo"
          >
            <Redo2 size={20} />
          </button>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-lg transition-all font-semibold shadow-md active:scale-95"
          >
            <Layers size={18} />
            <span>Export</span>
          </button>
          <button
            onClick={() => dispatch(toggleFavorite(colors))}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-semibold shadow-md shadow-blue-200 active:scale-95 ml-2"
          >
            <Heart size={18} />
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
