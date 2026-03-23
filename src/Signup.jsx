import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Palette } from 'lucide-react';
import { signupStart, signupSuccess, signupFailure } from './store/slices/authSlice';
import { signUp } from './utils/supabase';
import Navbar from './Components/Navbar';

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signupStart());

    try {
      // Validation
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        dispatch(signupFailure('Please fill in all fields'));
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        dispatch(signupFailure('Passwords do not match'));
        return;
      }

      if (formData.password.length < 6) {
        dispatch(signupFailure('Password must be at least 6 characters'));
        return;
      }

      console.log('Attempting signup with:', formData.email);
      const { user, session } = await signUp(formData.email, formData.password, formData.name);
      console.log('Signup response:', { user, session });
      
      dispatch(signupSuccess({ user, session }));
      
      // Always redirect to generator after successful signup
      console.log('Redirecting to /Generate');
      navigate('/Generate');
    } catch (err) {
      console.error('Signup error:', err);
      let errorMessage = 'Signup failed. Please try again.';
      
      if (err.message?.includes('User already registered')) {
        errorMessage = 'An account with this email already exists.';
      } else if (err.message?.includes('Password should be at least')) {
        errorMessage = 'Password must be at least 6 characters.';
      } else if (err.message?.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      dispatch(signupFailure(errorMessage));
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[600px]">
          {/* Left Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back Button */}
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>

            {/* Header */}
            <div className="mb-12">
              <h1 className="text-5xl font-black text-gray-900 mb-4">Create Account</h1>
              <p className="text-xl font-bold text-gray-400">Join Quolors and start creating amazing color palettes</p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-3">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-16 pl-12 pr-4 text-lg font-bold bg-white border-2 border-gray-100 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-16 pl-12 pr-4 text-lg font-bold bg-white border-2 border-gray-100 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-3">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full h-16 pl-12 pr-16 text-lg font-bold bg-white border-2 border-gray-100 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-3">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full h-16 pl-12 pr-16 text-lg font-bold bg-white border-2 border-gray-100 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-2xl"
                >
                  <p className="text-sm font-bold text-red-600">{error}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-8">
              <p className="text-gray-400 font-bold">
                Already have an account?{' '}
                <Link to="/Login" className="text-purple-600 hover:text-purple-700 transition-colors font-black">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Right Side - Visual Elements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative hidden lg:block"
          >
            {/* Logo/Brand */}
            <div className="flex justify-center mb-12">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Palette size={64} className="text-white" />
                </div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4 border-2 border-purple-200 rounded-3xl"
                />
              </div>
            </div>

            {/* Color Palette Display */}
            <div className="flex gap-2 h-20 rounded-2xl overflow-hidden shadow-xl mb-12">
              <div className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
              <div className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600"></div>
              <div className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
              <div className="flex-1 bg-gradient-to-r from-green-500 to-green-600"></div>
              <div className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            </div>

            {/* Feature Cards */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Palette size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">Create Amazing Palettes</h3>
                    <p className="text-sm font-bold text-gray-400">Generate beautiful color combinations</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                    <User size={24} className="text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">Personalized Experience</h3>
                    <p className="text-sm font-bold text-gray-400">Save and access your favorite palettes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Mail size={24} className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">Stay Connected</h3>
                    <p className="text-sm font-bold text-gray-400">Get updates on new features</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-purple-100 rounded-full opacity-50 blur-xl" />
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-pink-100 rounded-full opacity-50 blur-xl" />
            <div className="absolute top-1/2 right-20 w-20 h-20 bg-yellow-100 rounded-full opacity-50 blur-xl" />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default Signup;
