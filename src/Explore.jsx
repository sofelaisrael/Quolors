import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, ExternalLink, Filter, TrendingUp, Clock, Star } from 'lucide-react';
import { setPalette } from './store/slices/paletteSlice';
import { toggleFavorite } from './store/slices/favoritesSlice';
import { openAuthModal } from './store/slices/uiSlice';
import { addNotification } from './store/slices/notificationSlice';
import Navbar from './Components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import chroma from 'chroma-js';

const EXPLORE_PALETTES = [
  ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'],
  ['#f72585', '#b5179e', '#7209b7', '#560bad', '#480ca8', '#3f37c9', '#4361ee', '#4cc9f0'],
  ['#03071e', '#370617', '#6a040f', '#9d0208', '#d00000', '#dc2f02', '#e85d04', '#f48c06', '#faa307', '#ffba08'],
  ['#ffffff', '#8ecae6', '#219ebc', '#023047', '#ffb703', '#fb8500'],
  ['#dad7cd', '#a3b18a', '#588157', '#3a5a40', '#344e41'],
  ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#073b4c'],
  ['#ff99c8', '#fcf6bd', '#d0f4de', '#a9def9', '#e4c1f9'],
  ['#001219', '#005f73', '#0ae88c', '#94d2bd', '#e9d8a6', '#ee9b00', '#ca6702', '#bb3e03', '#ae2012', '#9b2226'],
  ['#353535', '#3c6e71', '#ffffff', '#d9d9d9', '#284b63'],
  ['#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f', '#90be6d', '#43aa8b', '#4d908e', '#577590', '#277da1'],
  ['#22223b', '#4a4e69', '#9a8c98', '#c9ada7', '#f2e9e4'],
  ['#606c38', '#283618', '#fefae0', '#dda15e', '#bc6c25'],
  ['#ffcdb2', '#ffb4a2', '#e5989b', '#b5838d', '#6d597a'],
  ['#118ab2', '#073b4c', '#ffd166', '#06d6a0', '#ef476f'],
  ['#2b2d42', '#8d99ae', '#edf2f4', '#ef233c', '#d90429'],
  ['#003049', '#d62828', '#f77f00', '#fcbf49', '#eae2b7'],
];

const ExploreCard = ({ colors }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.ui.isAuthenticated);

  const paletteObj = colors.map(hex => ({
    hex,
    locked: false,
    id: Math.random().toString(36).substr(2, 9),
  }));

  const openInGenerator = () => {
    dispatch(setPalette(paletteObj));
    navigate('/Generate');
  };

  const handleFavorite = () => {
    if (!isAuthenticated) {
      dispatch(addNotification({
        message: 'Please sign in to save palettes!',
        type: 'error'
      }));
      dispatch(openAuthModal());
      return;
    }
    
    dispatch(toggleFavorite(paletteObj));
    dispatch(addNotification({
      message: 'Palette added to favorites!',
      type: 'favorite'
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 hover:shadow-2xl transition-all group flex flex-col"
    >
      <div
        onClick={openInGenerator}
        className="h-40 w-full flex rounded-2xl overflow-hidden mb-6 cursor-pointer hover:scale-[1.02] transition-transform shadow-lg shadow-gray-100"
      >
        {colors.map((hex, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: hex }}
            title={hex}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
            <span className="text-xs font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-md uppercase tracking-tighter">
                {colors.length} Colors
            </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleFavorite}
            className="p-2.5 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-xl transition-all border border-gray-50 hover:border-red-100 active:scale-90"
            title="Save to Favourites"
          >
            <Heart size={20} />
          </button>
          <button
            onClick={openInGenerator}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-100 active:scale-90"
            title="Open in Generator"
          >
            <ExternalLink size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

function Explore() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Trending');

  const filteredPalettes = useMemo(() => {
    return EXPLORE_PALETTES.filter(palette => {
      if (!search) return true;
      const s = search.toLowerCase();
      // Simple search by color names or hex (chroma can help here)
      return palette.some(hex => hex.toLowerCase().includes(s));
    });
  }, [search]);

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />

      <header className="max-w-7xl mx-auto px-8 pt-20 pb-16 text-center">
        <h1 className="text-6xl font-black text-gray-900 tracking-tight mb-6">Trending Palettes</h1>
        <p className="text-xl font-bold text-gray-400 mb-12">Get inspired by millions of beautiful color schemes</p>

        <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by color or style (e.g. #264653, blue, pastel...)"
                    className="w-full h-16 pl-16 pr-8 bg-white rounded-3xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none text-lg font-bold shadow-sm transition-all"
                />
            </div>
            <div className="flex bg-white rounded-3xl border-2 border-gray-100 p-1.5 shadow-sm">
                {['Trending', 'Latest', 'Popular'].map(item => (
                    <button
                        key={item}
                        onClick={() => setFilter(item)}
                        className={`px-8 py-3 rounded-[1.25rem] text-sm font-black transition-all ${
                            filter === item ? 'bg-gray-900 text-white shadow-xl' : 'text-gray-400 hover:text-gray-900'
                        }`}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          <AnimatePresence>
            {filteredPalettes.map((palette, i) => (
              <ExploreCard key={i} colors={palette} />
            ))}
          </AnimatePresence>
        </div>

        {filteredPalettes.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
                <Filter size={32} />
             </div>
             <p className="text-xl font-bold text-gray-400">No palettes found for "{search}"</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Explore;
