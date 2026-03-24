import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ExternalLink,
  ArrowLeft,
  Heart,
  Plus,
  Folder,
  MoreVertical,
  Move,
  ChevronDown,
  LayoutGrid,
  FolderOpen,
  X,
  PlusCircle
} from 'lucide-react';
import { removeFavorite, createCollection, deleteCollection, movePaletteToCollection } from './store/slices/favoritesSlice';
import { setPalette } from './store/slices/paletteSlice';
import Navbar from './Components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from './utils/notifications';

const CollectionCard = ({ collection, count, isActive, onClick, onDelete }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
      isActive ? 'bg-blue-50 text-blue-600 shadow-sm' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
    }`}
  >
    <div className="flex items-center gap-3 overflow-hidden">
      {isActive ? <FolderOpen size={20} /> : <Folder size={20} />}
      <span className="font-bold text-sm truncate uppercase tracking-widest">{collection.name}</span>
    </div>
    <div className="flex items-center gap-2">
        <span className="text-xs font-black bg-white/50 px-2 py-0.5 rounded-md">{count}</span>
        {isActive && (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                className="p-1 hover:bg-rose-100 text-rose-500 rounded-md transition-all opacity-0 group-hover:opacity-100"
            >
                <Trash2 size={14} />
            </button>
        )}
    </div>
  </button>
);

const PaletteCard = ({ palette, collections }) => {
  const dispatch = useDispatch();
  const [showMove, setShowMove] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 hover:shadow-2xl transition-all group relative"
    >
      <div className="h-32 w-full flex rounded-2xl overflow-hidden mb-6 cursor-pointer shadow-lg shadow-gray-100">
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
        <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                {new Date(palette.date).toLocaleDateString()}
            </span>
            {palette.collectionId && (
                <div className="flex items-center gap-1 text-[10px] font-black text-blue-500 uppercase tracking-tighter">
                    <Folder size={10} />
                    {collections.find(c => c.id === palette.collectionId)?.name}
                </div>
            )}
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="relative">
              <button
                onClick={() => setShowMove(!showMove)}
                className="p-2.5 hover:bg-gray-50 text-gray-400 rounded-xl transition-colors border border-gray-50 hover:border-gray-200"
                title="Move to Collection"
              >
                <Move size={18} />
              </button>
              <AnimatePresence>
                {showMove && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full right-0 mb-4 w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 z-50 overflow-hidden"
                    >
                        <div className="p-3 border-b border-gray-50 flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Move to...</span>
                            <X size={12} className="cursor-pointer" onClick={() => setShowMove(false)} />
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                            <button
                                onClick={() => {
                                    if (!isAuthenticated) {
                                      addNotification('Please login to manage collections', 'warning');
                                      navigate('/Login');
                                      return;
                                    }
                                    dispatch(movePaletteToCollection({ paletteId: palette.id, collectionId: null }));
                                    setShowMove(false);
                                  }}
                                className="w-full text-left p-3 hover:bg-gray-50 rounded-xl text-xs font-bold transition-all"
                            >
                                (Unsorted)
                            </button>
                            {collections.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => {
                                        dispatch(movePaletteToCollection({ paletteId: palette.id, collectionId: c.id }));
                                        setShowMove(false);
                                    }}
                                    className="w-full text-left p-3 hover:bg-gray-50 rounded-xl text-xs font-bold transition-all"
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
              </AnimatePresence>
          </div>
          <Link
            to="/Generate"
            onClick={() => dispatch(setPalette(palette.colors))}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-100"
            title="Open in Generator"
          >
            <ExternalLink size={18} />
          </Link>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                addNotification('Please login to manage favorites', 'warning');
                navigate('/Login');
              } else {
                dispatch(removeFavorite(palette.id));
              }
            }}
            className="p-2.5 hover:bg-rose-50 text-rose-500 rounded-xl transition-colors"
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
  const dispatch = useDispatch();
  const { palettes, collections } = useSelector(state => state.favorites);
  const { isAuthenticated } = useSelector(state => state.auth);
  const [activeCollectionId, setActiveCollectionId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const filteredPalettes = palettes.filter(p => p.collectionId === activeCollectionId);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addNotification('Please login to create collections', 'warning');
      navigate('/Login');
      return;
    }
    if (newName.trim()) {
        dispatch(createCollection(newName.trim()));
        setNewName('');
        setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <Navbar />

      <main className="flex-1 flex max-w-[1600px] mx-auto w-full px-8 py-12 gap-12">
        {/* Collections Sidebar */}
        <aside className="w-80 flex flex-col gap-8 flex-shrink-0">
          <div className="flex flex-col gap-6">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest ml-1">Collections</h2>
            <div className="flex flex-col gap-2">
                <CollectionCard
                    collection={{ name: 'All Palettes', id: null }}
                    count={palettes.length}
                    isActive={activeCollectionId === null}
                    onClick={() => setActiveCollectionId(null)}
                />
                {collections.map(c => (
                    <CollectionCard
                        key={c.id}
                        collection={c}
                        count={palettes.filter(p => p.collectionId === c.id).length}
                        isActive={activeCollectionId === c.id}
                        onClick={() => setActiveCollectionId(c.id)}
                        onDelete={() => {
                            if (!isAuthenticated) {
                              addNotification('Please login to manage collections', 'warning');
                              navigate('/Login');
                              return;
                            }
                            dispatch(deleteCollection(c.id));
                            if (activeCollectionId === c.id) setActiveCollectionId(null);
                          }}
                    />
                ))}
            </div>

            {!isCreating ? (
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all font-bold text-sm"
                >
                    <Plus size={20} />
                    New Collection
                </button>
            ) : (
                <form onSubmit={handleCreate} className="flex flex-col gap-3">
                    <input
                        autoFocus
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Collection name..."
                        className="h-12 px-4 rounded-xl border-2 border-blue-500 focus:outline-none text-sm font-bold bg-white shadow-lg shadow-blue-50"
                    />
                    <div className="flex gap-2">
                        <button type="submit" className="flex-1 h-10 bg-gray-900 text-white rounded-xl text-xs font-bold shadow-lg active:scale-95 transition-all">Create</button>
                        <button type="button" onClick={() => setIsCreating(false)} className="px-4 h-10 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold active:scale-95 transition-all">Cancel</button>
                    </div>
                </form>
            )}
          </div>
        </aside>

        {/* Palettes Grid */}
        <section className="flex-1 flex flex-col">
            <header className="flex items-center justify-between mb-12">
                <div className="flex flex-col gap-2">
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight">
                        {activeCollectionId ? collections.find(c => c.id === activeCollectionId)?.name : 'All Palettes'}
                    </h1>
                    <p className="text-lg font-bold text-gray-400">{filteredPalettes.length} palettes saved in this view</p>
                </div>
                <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                        <LayoutGrid size={24} />
                     </div>
                </div>
            </header>

            {filteredPalettes.length === 0 ? (
                <div className="h-[500px] flex flex-col items-center justify-center text-center bg-white rounded-[3rem] border border-gray-100 border-dashed">
                    <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 text-gray-300">
                        <Heart size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Empty view</h2>
                    <p className="text-xl font-bold text-gray-400 mb-8 max-w-sm">There are no palettes here yet. Start creating and organize your work!</p>
                    <Link to="/Generate" className="px-10 py-4 bg-blue-600 text-white text-lg font-black rounded-2xl shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
                        Start the generator
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    <AnimatePresence mode="popLayout">
                        {filteredPalettes.map(palette => (
                            <PaletteCard
                                key={palette.id}
                                palette={palette}
                                collections={collections}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </section>
      </main>
    </div>
  );
}

export default Favorites;
