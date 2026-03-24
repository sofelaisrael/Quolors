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
  Heart,
  Undo2,
  Redo2,
  Maximize2,
  Grid,
  ChevronDown,
  Eye,
  Share2,
  Bookmark,
  Sparkles,
  Search
} from 'lucide-react';
import { motion, Reorder, AnimatePresence, useDragControls } from 'framer-motion';
import chroma from 'chroma-js';
import { toggleFavorite } from './store/slices/favoritesSlice';
import { openColorDetailsModal } from './store/slices/uiSlice';
import Navbar from './Components/Navbar';
import ExportModal from './Components/ExportModal';

const ColorBar = ({ color, index, total }) => {
  const dispatch = useDispatch();
  const contrastColor = chroma.contrast(color.hex, 'black') > 4.5 ? 'black' : 'white';
  const dragControls = useDragControls();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(color.hex.toUpperCase());
  };

  return (
    <Reorder.Item
      value={color}
      dragListener={false}
      dragControls={dragControls}
      className="flex-1 flex flex-col items-center justify-end pb-24 group h-full relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: color.hex, color: contrastColor }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 pointer-events-none" />

      {/* Interaction Icons (Visible on Hover) */}
      <div className="flex flex-col gap-6 opacity-0 group-hover:opacity-100 transition-all duration-300 mb-12">
        <button
          onClick={() => dispatch(removeColumn(color.id))}
          className="p-2 hover:bg-black/10 rounded-full transition-colors"
          title="Remove color"
        >
          <X size={20} />
        </button>
        <button
          onClick={() => dispatch(openColorDetailsModal(color))}
          className="p-2 hover:bg-black/10 rounded-full transition-colors"
          title="View shades"
        >
          <Grid size={20} />
        </button>
        <div
          onPointerDown={(e) => dragControls.start(e)}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-black/10 rounded-full transition-colors"
          title="Drag to reorder"
        >
          <GripVertical size={20} />
        </div>
        <button
          onClick={() => dispatch(toggleFavorite([color]))}
          className="p-2 hover:bg-black/10 rounded-full transition-colors"
          title="Save color"
        >
          <Bookmark size={20} />
        </button>
      </div>

      {/* Main Color Info (Always at bottom) */}
      <div className="flex flex-col items-center gap-2 z-10 px-2 w-full">
         <button
          onClick={() => dispatch(toggleLock(color.id))}
          className="p-3 hover:bg-black/10 rounded-xl transition-all mb-4"
        >
          {color.locked ? <Lock size={28} fill="currentColor" /> : <Unlock size={28} />}
        </button>

        <h2
          className="text-2xl font-bold tracking-wider cursor-pointer hover:scale-105 transition-transform uppercase mb-1"
          onClick={copyToClipboard}
        >
          {color.hex.replace('#', '')}
        </h2>

        <p className="text-xs font-bold opacity-60 uppercase tracking-widest text-center truncate w-full">
          {chroma(color.hex).name()}
        </p>
      </div>

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
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleKeyDown = useCallback((e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      dispatch(generatePalette());
    }
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    dispatch(setPalette(colors));
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <Navbar />

      {/* Sub-header / Toolbar */}
      <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 bg-white z-30">
        <div className="flex items-center gap-8">
            <span className="text-sm text-gray-400 font-medium">Press the spacebar to generate color palettes!</span>
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

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600" title="View">
            <Eye size={20} />
          </button>
          <button
            onClick={() => setIsExportOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            title="Export"
          >
            <Share2 size={20} />
          </button>
          <button
            onClick={() => dispatch(toggleFavorite(colors))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            title="Save palette"
          >
            <Heart size={20} />
          </button>

          <div className="w-px h-6 bg-gray-200 mx-2" />
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
            <Maximize2 size={20} />
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
