import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Heart, ExternalLink, Palette, Download, Eye } from 'lucide-react';
import chroma from 'chroma-js';
import Navbar from './Components/Navbar';
import { toggleFavorite } from './store/slices/favoritesSlice';
import { useNotifications } from './utils/notifications';

function ColorDetails() {
  const { hex } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorites);
  const { addNotification } = useNotifications();
  const [colorName, setColorName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const colorHex = hex.startsWith('#') ? hex : `#${hex}`;
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

    fetchColorName();
  }, [colorHex]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(colorHex.toUpperCase());
      setCopied(true);
      addNotification('Color copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      addNotification('Failed to copy color', 'error');
    }
  };

  const isFavorite = () => {
    return favorites?.palettes?.some(palette => 
      palette.colors.length === 1 && palette.colors[0].hex === colorHex
    );
  };

  const handleFavorite = () => {
    if (!isAuthenticated) {
      addNotification('Please login to save colors', 'warning');
      navigate('/Login');
    } else {
      const colorObj = {
        hex: colorHex,
        name: colorName,
        id: Math.random().toString(36).substr(2, 9),
      };
      dispatch(toggleFavorite([colorObj]));
    }
  };

  const generatePalette = () => {
    const palette = [
      colorHex,
      color.set('hsl.l', 0.2).hex(),
      color.set('hsl.l', 0.4).hex(),
      color.set('hsl.l', 0.6).hex(),
      color.set('hsl.l', 0.8).hex()
    ];
    navigate(`/Generate?palette=custom-${Date.now()}`);
  };

  const downloadColor = () => {
    const dataStr = JSON.stringify({
      hex: colorHex,
      name: colorName,
      rgb: color.rgb(),
      hsl: color.hsl()
    }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${colorHex.replace('#', '')}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex justify-center flex-col items-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-bold text-gray-600">Loading color details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          {/* Main Color Display - Color of the Week Style */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Large Color Preview with Gradient */}
              <div className="relative group">
                <div
                  className="h-[500px] flex flex-col items-center justify-center overflow-hidden"
                  style={{ 
                    background: `${colorHex}`,
                  }}
                >
                  
                </div>
              </div>

              {/* Color Information Panel */}
              <div className="p-12 space-y-8">
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-2">{colorName || 'Unknown Color'}</h2>
                  <p className="text-md font-mono text-gray-700 mb-2">{colorHex.toUpperCase()}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Color Values</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">HEX</span>
                      <span className="font-mono font-bold text-gray-900 group-hover:text-blue-600">{colorHex.toUpperCase()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">RGB</span>
                      <span className="font-mono font-bold text-gray-900 group-hover:text-blue-600">
                        {color.rgb().join(', ')}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">HSL</span>
                      <span className="font-mono font-bold text-gray-900 group-hover:text-blue-600">
                        {Math.round(color.hsl()[0])}°, {Math.round(color.hsl()[1])}%, {Math.round(color.hsl()[2])}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Actions</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      className="flex items-center h-[50px] justify-center gap-2 text-sm cursor-pointer bg-black text-white rounded-xl font-medium"
                    >
                      <Copy size={15} />
                      Copy HEX
                    </button>
                    
                    <button
                      className={`flex items-center justify-center gap-2 text-sm h-[50px] rounded-xl transition-colors font-medium ${
                        isFavorite()
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : isAuthenticated
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer'
                          : 'bg-gray-400 text-white cursor-not-allowed'
                      }`}
                    >
                      <Heart size={15} fill={isFavorite() ? 'currentColor' : 'none'} />
                      {isFavorite() ? 'Saved' : (isAuthenticated ? 'Save' : 'Login to Save')}
                    </button>
                    
                    <button
                      className="flex items-center justify-center gap-2 h-[50px] cursor-pointer bg-black text-sm text-white rounded-xl font-medium"
                    >
                      <Palette size={15} />
                      Generate Palette
                    </button>
                    
                    <button
                      className="flex items-center justify-center gap-2 h-[50px] cursor-pointer text-sm bg-black text-white rounded-xl font-medium"
                    >
                      <Download size={15} />
                      Download Info
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Color Variations - Premium Style */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Color Variations</h3>
                <p className="text-base font-bold text-gray-400">Explore different shades and tones.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[0.1, 0.2, 0.3, 0.4].map((lightness, i) => (
                <div key={`light-${i}`} className="space-y-2">
                  <div
                    className="h-20 rounded-lg"
                    style={{ backgroundColor: color.set('hsl.l', lightness).hex() }}
                  >
                  </div>
                  <p className="text-xs font-mono text-center text-gray-500">
                    {color.set('hsl.l', lightness).hex().toUpperCase()}
                  </p>
                </div>
              ))}
              
        
              
              {[0.6, 0.7, 0.8, 0.9].map((lightness, i) => (
                <div key={`dark-${i}`} className="space-y-2">
                  <div
                    className="h-20 rounded-lg"
                    style={{ backgroundColor: color.set('hsl.l', lightness).hex() }}
                  >
                  </div>
                  <p className="text-xs font-mono text-center text-gray-500">
                    {color.set('hsl.l', lightness).hex().toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Complementary Colors Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Complementary Palette</h3>
                <p className="text-base font-bold text-gray-400">Colors that work perfectly together.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                color.set('hsl.h', (color.hsl()[0] + 180) % 360).hex(),
                color.set('hsl.h', (color.hsl()[0] + 120) % 360).hex(),
                color.set('hsl.h', (color.hsl()[0] + 240) % 360).hex(),
                color.set('hsl.l', 0.9).hex()
              ].map((compColor, i) => (
                <div key={i} className="space-y-2">
                  <div
                    className="h-16 rounded-lg"
                    style={{ backgroundColor: compColor }}
                  >
                  </div>
                  <p className="text-xs font-mono text-center text-gray-500 uppercase tracking-wider">
                    {compColor.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default ColorDetails;
