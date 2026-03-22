import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Github, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { name: 'Generator', path: '/Generate' },
    { name: 'Explore', path: '/Explore' },
    { name: 'Image Picker', path: '/Picker' },
    { name: 'Contrast Checker', path: '/Contrast' },
    { name: 'Visualizer', path: '/Visualizer' },
    { name: 'Gradients', path: '/Gradient' },
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
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold transition-colors ${
                location.pathname === link.path ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/Favourite" className="p-2 text-gray-400 hover:text-red-500 transition-colors">
          <Heart size={20} />
        </Link>
        <button className="hidden md:block px-4 py-2 text-sm font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
          Sign up
        </button>
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
              <Link to="/Favourite" className="text-lg font-bold text-gray-900 px-4 py-2 hover:bg-gray-50 rounded-xl">
                Favourites
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
