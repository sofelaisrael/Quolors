import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Image,
  Contrast,
  Eye,
  Grid3x3,
  Droplets,
  Sparkles,
  Download,
  Settings,
  LogIn,
  UserPlus
} from 'lucide-react';

const ToolsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const tools = [
    { icon: Palette, label: 'Generate', href: '/Generate', description: 'Create color palettes' },
    { icon: Image, label: 'Image Picker', href: '/ImagePicker', description: 'Extract colors from images' },
    { icon: Contrast, label: 'Contrast Checker', href: '/Contrast', description: 'Check color accessibility' },
    { icon: Eye, label: 'Visualizer', href: '/Visualizer', description: 'Preview on designs' },
    { icon: Grid3x3, label: 'Explore', href: '/Explore', description: 'Browse palettes' },
    { icon: Droplets, label: 'Color Details', href: '/ColorDetails', description: 'Color information' },
    { icon: Sparkles, label: 'Favorites', href: '/Favorites', description: 'Saved palettes' },
  ];

  const handleToolClick = (href) => {
    setIsOpen(false);
    navigate(href);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-black bg-white border border-gray-100 rounded-xl hover:border-blue-200 transition-all shadow-sm"
      >
        <Settings size={18} />
        <span>Tools</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-full left-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden min-w-[280px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-2">
                {tools.map((tool, index) => (
                  <button
                    key={tool.label}
                    onClick={() => handleToolClick(tool.href)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <tool.icon size={18} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{tool.label}</div>
                      <div className="text-xs text-gray-500">{tool.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToolsDropdown;
