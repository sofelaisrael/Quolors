import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, LayoutGrid, Palette, Image, Ruler, Monitor, Layers, LogOut, User, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { openAuthModal, logout } from '../store/slices/uiSlice'
import { supabase } from '../services/supabase'

function Navbar() {
  const dispatch = useDispatch()
  const [isToolsOpen, setIsToolsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const location = useLocation()
  const isAuthenticated = useSelector((state) => state.ui.isAuthenticated)
  const user = useSelector((state) => state.ui.user)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsUserMenuOpen(false)
  }

  const tools = [
    { name: 'Palette Generator', icon: <Palette size={18} />, path: '/Generate' },
    { name: 'Explore Palettes', icon: <LayoutGrid size={18} />, path: '/Explore' },
    { name: 'Color Extractor', icon: <Image size={18} />, path: '/Picker' },
    { name: 'Contrast Checker', icon: <Ruler size={18} />, path: '/Contrast' },
    { name: 'Visualizer', icon: <Monitor size={18} />, path: '/Visualizer' },
    { name: 'Gradient Maker', icon: <Layers size={18} />, path: '/Gradient' },
  ]

  return (
    <nav className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white relative z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center gap-1 group">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                <div className="w-4 h-4 bg-white rounded-full" />
             </div>
             <span className="text-2xl font-black tracking-tighter text-gray-900 ml-1">coolors</span>
          </div>
        </Link>

        {/* Desktop Tools Dropdown */}
        <div className="hidden md:flex items-center gap-8">
            <div className="relative">
                <button
                    onMouseEnter={() => setIsToolsOpen(true)}
                    className="flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors py-4"
                >
                    Tools <ChevronDown size={14} strokeWidth={3} className={`transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {isToolsOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            onMouseLeave={() => setIsToolsOpen(false)}
                            className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 mt-[-8px]"
                        >
                            {tools.map((tool) => (
                                <Link
                                    key={tool.path}
                                    to={tool.path}
                                    onClick={() => setIsToolsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                                        {tool.icon}
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">
                                        {tool.name}
                                    </span>
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <button className="text-sm font-bold text-pink-500 hover:text-pink-600 transition-colors">
                Go Pro
            </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              )}
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user.name}
              </span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 mt-2 z-50"
                >
                  <Link
                    to="/Favourite"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Heart size={16} />
                    Saved Palettes
                  </Link>
                  <hr className="my-2 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button
              onClick={() => dispatch(openAuthModal())}
              className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-50 active:scale-95"
          >
              Get Started
          </button>
        )}
        <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl md:hidden max-h-[80vh] overflow-y-auto"
          >
            <div className="p-4 flex flex-col gap-2">
              <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 mt-4">Tools</p>
              {tools.map((tool) => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-lg font-bold text-gray-900 px-4 py-3 hover:bg-gray-50 rounded-xl"
                >
                  <span className="text-blue-600">{tool.icon}</span>
                  {tool.name}
                </Link>
              ))}
              <hr className="my-4 border-gray-100" />
              {isAuthenticated ? (
                <>
                  <Link
                    to="/Favourite"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 text-lg font-bold text-gray-900 px-4 py-3 hover:bg-gray-50 rounded-xl"
                  >
                    <Heart size={20} className="text-red-500" />
                    Saved Palettes
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-4 text-lg font-bold text-red-600 px-4 py-3 hover:bg-gray-50 rounded-xl"
                  >
                    <LogOut size={20} />
                    Sign out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { dispatch(openAuthModal()); setIsMobileMenuOpen(false); }}
                  className="w-full px-4 py-3 text-lg font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-50 active:scale-95"
                >
                  Get Started
                </button>
              )}
              <button className="text-lg font-bold text-pink-500 px-4 py-3 text-left">
                Go Pro
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
