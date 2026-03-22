import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trash2, ExternalLink, ArrowLeft, Heart } from 'lucide-react';
import { removeFavorite } from './store/slices/favoritesSlice';
import { setPalette } from './store/slices/paletteSlice';
import Navbar from './Components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const PaletteCard = ({ palette }) => {
  const dispatch = useDispatch();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
    >
      <div className="h-32 w-full flex rounded-xl overflow-hidden mb-4 cursor-pointer">
        {palette.colors.map((c, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: c.hex }}
            title={c.hex}
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {new Date(palette.date).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            to="/Generate"
            onClick={() => dispatch(setPalette(palette.colors))}
            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
            title="Open in Generator"
          >
            <ExternalLink size={18} />
          </Link>
          <button
            onClick={() => dispatch(removeFavorite(palette.id))}
            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
            title="Remove"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

function Favorites() {
  const favorites = useSelector(state => state.favorites.palettes);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <Link to="/Generate" className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-gray-900 transition-all border border-transparent hover:border-gray-100">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Your Palettes</h1>
          <div className="ml-auto bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold">
            {favorites.length} Saved
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-6 text-gray-300">
              <Heart size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No palettes saved yet</h2>
            <p className="text-gray-500 font-medium mb-8">Start creating and save your favorite color schemes!</p>
            <Link to="/Generate" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
              Go to Generator
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {favorites.map(palette => (
                <PaletteCard key={palette.id} palette={palette} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}

export default Favorites;
