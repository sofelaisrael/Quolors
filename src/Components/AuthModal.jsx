import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Chrome, Mail, Apple } from 'lucide-react';
import { closeAuthModal } from '../store/slices/uiSlice';

const AuthModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isAuthModalOpen);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dispatch(closeAuthModal())}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px]"
        >
          {/* Left Side: Visual/Branding */}
          <div className="hidden md:flex md:w-5/12 bg-blue-600 p-12 text-white flex-col justify-between relative overflow-hidden">
            <div className="z-10">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full" />
                </div>
                <span className="text-xl font-black tracking-tighter">Quolors</span>
              </div>
              <h1 className="text-4xl font-bold leading-tight mb-4">
                The super fast color palettes generator!
              </h1>
              <p className="text-blue-100 text-lg">
                Create the perfect palette or get inspired by thousands of beautiful color schemes.
              </p>
            </div>

            {/* Background pattern/elements */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-50" />
            <div className="absolute top-1/2 -left-10 w-40 h-40 bg-blue-400 rounded-full blur-2xl opacity-30" />
          </div>

          {/* Right Side: Form */}
          <div className="flex-1 p-12 flex flex-col justify-center relative">
            <button
              onClick={() => dispatch(closeAuthModal())}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="max-w-md mx-auto w-full">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
              <p className="text-gray-500 mb-8">Sign in to your Quolors account</p>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold">
                  <Chrome size={20} className="text-gray-900" />
                  Google
                </button>
                <button className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold">
                  <Apple size={20} fill="currentColor" />
                  Apple
                </button>
              </div>

              <div className="relative mb-8 text-center">
                <hr className="border-gray-100" />
                <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-4 text-sm text-gray-400 font-medium">
                  OR
                </span>
              </div>

              {/* Email Login Form */}
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-gray-700">Password</label>
                    <a href="#" className="text-sm font-bold text-blue-600 hover:underline">Forgot?</a>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
                >
                  Sign in
                </button>
              </form>

              <p className="text-center mt-8 text-gray-500 font-medium">
                Don't have an account? <button className="text-blue-600 font-bold hover:underline">Sign up</button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
