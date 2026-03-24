import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Menu, X, Github, Heart, User, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { logout } from '../store/slices/authSlice'
import { signOut } from '../utils/supabase'
import ToolsDropdown from './ToolsDropdown'
import AuthModal from './AuthModal'

function Navbar() {
  const [open, setOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const location = useLocation()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector(state => state.auth)

  const handleLogout = async () => {
    try {
      await signOut();
      dispatch(logout());
      setOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Still dispatch logout to clear local state
      dispatch(logout());
      setOpen(false);
    }
  }

  const navLinks = [
    { name: 'Explore', path: '/Explore' },
  ]

  return (
    <nav className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white relative z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full" />
          </div>
          <span className="text-xl font-black tracking-tighter text-gray-900">Quolors</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <ToolsDropdown />
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname === link.path ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/Favourite" aria-label="Favorites" className="p-2 text-gray-400 hover:text-red-500 transition-colors">
          <Heart size={20} />
        </Link>
        
        {isAuthenticated ? (
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
              <User size={16} className="text-gray-600" />
              <span className="text-sm font-bold text-gray-900">{user?.name || user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-bold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 text-sm font-bold text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Sign in
            </button>
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 text-sm font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Sign up
            </button>
          </div>
        )}
        
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl md:hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className="text-lg font-bold text-gray-900 px-4 py-2 hover:bg-gray-50 rounded-xl"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-gray-100" />
              <Link to="/Favourite" onClick={() => setOpen(false)} className="text-lg font-bold text-gray-900 px-4 py-2 hover:bg-gray-50 rounded-xl">
                Favorites
              </Link>
              
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
                    <User size={16} className="text-gray-600" />
                    <span className="text-sm font-bold text-gray-900">{user?.name || user?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-lg font-bold text-red-600 px-4 py-2 hover:bg-red-50 rounded-xl text-left flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-lg font-bold text-gray-900 px-4 py-2 hover:bg-gray-50 rounded-xl"
                  >
                    Sign in
                  </button>
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-lg font-bold bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  )
}

export default Navbar
