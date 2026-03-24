import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Heart, ExternalLink, Palette, Download, Eye } from 'lucide-react';
import chroma from 'chroma-js';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { useNotifications } from '../utils/notifications';

const ColorDetailsModal = ({ isOpen, onClose, colorHex }) => {
  const [colorName, setColorName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { addNotification } = useNotifications();

  const color = chroma(colorHex);

  useEffect(() => {
    const fetchColorName = async () => {
      try {
        const response = await fetch(`https://www.thecolorapi.com/id?hex=${colorHex.replace('#', '')}`);
        const data = await response.json();
        if (data.name) {
          setColorName(data.name.value);
        }
      } catch (error) {
        console.error('Failed to fetch color name:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && colorHex) {
      fetchColorName();
    }
  }, [isOpen, colorHex]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      addNotification('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      addNotification('Failed to copy', 'error');
    }
  };

  const isFavorite = () => {
    // This would need to be implemented based on your favorites structure
    return false;
  };

  const handleFavorite = () => {
    if (!isAuthenticated) {
      addNotification('Please login to save colors', 'warning');
      return;
    }
    const colorObj = {
      hex: colorHex,
      name: colorName,
      id: Math.random().toString(36).substr(2, 9),
    };
    dispatch(toggleFavorite([colorObj]));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-t-3xl w-full max-w-2xl mx-auto max-h-[85vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{colorName || 'Color Details'}</h2>
              <p className="text-lg font-mono text-gray-700">{colorHex.toUpperCase()}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Color Preview */}
            <div className="mb-8">
              <div
                className="h-32 rounded-2xl shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundColor: colorHex }}
                onClick={() => copyToClipboard(colorHex)}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/10 rounded-2xl">
                  <Copy size={24} className="text-white" />
                </div>
              </div>
            </div>

            {/* Color Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Color Values</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group" onClick={() => copyToClipboard(colorHex)}>
                    <span className="font-medium text-gray-600">HEX</span>
                    <span className="font-mono font-bold text-gray-900 group-hover:text-blue-600">{colorHex.toUpperCase()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group" onClick={() => copyToClipboard(color.rgb().join(', '))}>
                    <span className="font-medium text-gray-600">RGB</span>
                    <span className="font-mono font-bold text-gray-900 group-hover:text-blue-600">{color.rgb().join(', ')}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group" onClick={() => copyToClipboard(`hsl(${Math.round(color.hsl()[0])}, ${Math.round(color.hsl()[1])}%, ${Math.round(color.hsl()[2])}%)`)}>
                    <span className="font-medium text-gray-600">HSL</span>
                    <span className="font-mono font-bold text-gray-900 group-hover:text-blue-600">
                      {Math.round(color.hsl()[0])}°, {Math.round(color.hsl()[1])}%, {Math.round(color.hsl()[2])}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Actions</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => copyToClipboard(colorHex)}
                    className="flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Copy size={18} />
                    {copied ? 'Copied!' : 'Copy HEX'}
                  </button>
                  
                  <button
                    onClick={handleFavorite}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-colors font-medium ${
                      isFavorite()
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : isAuthenticated
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-400 text-white cursor-not-allowed'
                    }`}
                  >
                    <Heart size={18} fill={isFavorite() ? 'currentColor' : 'none'} />
                    {isFavorite() ? 'Saved' : (isAuthenticated ? 'Save' : 'Login to Save')}
                  </button>
                  
                  <button
                    className="flex items-center justify-center gap-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <Palette size={18} />
                    Generate Palette
                  </button>
                  
                  <button
                    className="flex items-center justify-center gap-2 p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    <Download size={18} />
                    Download Info
                  </button>
                </div>
              </div>
            </div>

            {/* Color Variations */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Color Variations</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[0.1, 0.2, 0.3, 0.4].map((lightness, i) => (
                  <div key={`light-${i}`} className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">Light {i + 1}</p>
                    <div
                      className="h-16 rounded-lg"
                      style={{ backgroundColor: color.set('hsl.l', lightness).hex() }}
                    />
                    <p className="text-xs font-mono text-center text-gray-500">
                      {color.set('hsl.l', lightness).hex().toUpperCase()}
                    </p>
                  </div>
                ))}
                
                {/* Original */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Original</p>
                  <div
                    className="h-16 rounded-lg border-2 border-blue-500"
                    style={{ backgroundColor: colorHex }}
                  />
                  <p className="text-xs font-mono text-center text-gray-500 font-bold">
                    {colorHex.toUpperCase()}
                  </p>
                </div>
                
                {[0.6, 0.7, 0.8, 0.9].map((lightness, i) => (
                  <div key={`dark-${i}`} className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">Dark {i + 1}</p>
                    <div
                      className="h-16 rounded-lg"
                      style={{ backgroundColor: color.set('hsl.l', lightness).hex() }}
                    />
                    <p className="text-xs font-mono text-center text-gray-500">
                      {color.set('hsl.l', lightness).hex().toUpperCase()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ColorDetailsModal;
