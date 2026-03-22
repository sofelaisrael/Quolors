import React, { useState, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Upload, Image as ImageIcon, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { setPalette } from './store/slices/paletteSlice';
import Navbar from './Components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import chroma from 'chroma-js';

function ImagePicker() {
  const [image, setImage] = useState(null);
  const [colors, setColors] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const canvasRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const extractColors = useCallback((imgElement) => {
    setIsExtracting(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Scale down image for processing
    const width = 200;
    const height = (imgElement.height / imgElement.width) * width;
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(imgElement, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height).data;

    const colorCounts = {};
    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const hex = chroma(r, g, b).hex();

      // Quantize slightly for grouping similar colors
      const key = chroma(hex).darken(0.1).hex();
      colorCounts[key] = (colorCounts[key] || 0) + 1;
    }

    // Sort by frequency and take top 5
    const extracted = Object.entries(colorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([hex]) => hex);

    setColors(extracted);
    setIsExtracting(false);
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => extractColors(img);
        img.src = event.target.result;
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openInGenerator = () => {
    const paletteObj = colors.map(hex => ({
      hex,
      locked: false,
      id: Math.random().toString(36).substr(2, 9),
    }));
    dispatch(setPalette(paletteObj));
    navigate('/Generate');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-20">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-black text-gray-900 tracking-tight mb-4">Image Picker</h1>
          <p className="text-xl font-bold text-gray-400">Extract beautiful colors from any image with ease</p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-gray-100 shadow-sm hover:border-blue-300 transition-all text-center relative overflow-hidden group">
            {image ? (
              <div className="flex flex-col gap-10">
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
                    <img src={image} alt="Uploaded" className="w-full max-h-[500px] object-cover" />
                    <button
                        onClick={() => setImage(null)}
                        className="absolute top-6 right-6 p-4 bg-white/90 backdrop-blur text-gray-900 rounded-2xl hover:bg-white transition-all shadow-xl"
                    >
                        <RefreshCw size={24} />
                    </button>
                </div>

                <div className="flex flex-col gap-8">
                    <div className="flex gap-4 h-24 rounded-3xl overflow-hidden shadow-xl">
                        {isExtracting ? (
                             <div className="w-full h-full bg-gray-50 flex items-center justify-center animate-pulse">
                                <span className="text-lg font-black text-gray-300">Extracting colors...</span>
                             </div>
                        ) : (
                            colors.map((hex, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex-1 flex items-center justify-center group/swatch cursor-pointer"
                                    style={{ backgroundColor: hex }}
                                >
                                    <span className="text-white text-xs font-black opacity-0 group-hover/swatch:opacity-100 transition-opacity bg-black/20 px-2 py-1 rounded">
                                        {hex.toUpperCase()}
                                    </span>
                                </motion.div>
                            ))
                        )}
                    </div>

                    <button
                        onClick={openInGenerator}
                        className="h-20 bg-blue-600 text-white text-xl font-black rounded-3xl shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-4 active:scale-95"
                    >
                        <ExternalLink size={28} />
                        Open in Generator
                    </button>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer py-20 flex flex-col items-center gap-8">
                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-100/50">
                    <Upload size={40} />
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-black text-gray-900">Drop an image here</h2>
                    <p className="text-xl font-bold text-gray-400">or click to browse your files</p>
                </div>
                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleUpload}
                />
                <div className="mt-8 flex items-center gap-3 px-6 py-3 bg-gray-50 text-gray-400 rounded-2xl font-bold text-sm">
                    <ImageIcon size={20} />
                    Supports PNG, JPG, WEBP
                </div>
              </label>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default ImagePicker;
