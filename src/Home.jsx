import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Search, Image as ImageIcon, CheckCircle, Heart } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all text-left"
  >
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6`}>
      <Icon className="text-white" size={28} />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 leading-relaxed font-medium">{description}</p>
  </motion.div>
);

function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navbar */}
      <nav className="h-20 flex items-center justify-between px-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <div className="w-5 h-5 bg-white rounded-full" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-gray-900">Quolors</span>
        </div>
        <div className="hidden md:flex items-center gap-10">
          <Link to="/Explore" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Explore</Link>
          <Link to="/Contrast" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Contrast</Link>
          <Link to="/Visualizer" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Visualizer</Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-bold text-gray-900 px-6 py-2.5 hover:bg-gray-100 rounded-xl transition-colors">Sign in</button>
          <Link to="/Generate" className="text-sm font-bold bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">Sign up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-10 pt-16 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-7xl md:text-8xl font-black text-gray-900 tracking-tight leading-[0.9] mb-8">
            The super fast <br /> color palettes <br /> generator!
          </h1>
          <p className="text-xl font-semibold text-gray-400 max-w-2xl mx-auto mb-12">
            Create the perfect palette or get inspired by thousands of beautiful color schemes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/Generate">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-blue-600 text-white text-xl font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3"
              >
                Start the generator!
              </motion.button>
            </Link>
            <Link to="/Explore">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-white border border-gray-100 text-xl font-black rounded-2xl hover:border-gray-200 transition-all shadow-sm"
              >
                Explore palettes
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Hero Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-24 rounded-[40px] overflow-hidden shadow-2xl border border-gray-50 p-3 bg-white"
        >
          <div className="aspect-[21/9] w-full bg-gray-50 flex overflow-hidden rounded-[32px]">
            {['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51', '#e9c46a'].map((color, i) => (
              <div key={`${color}-${i}`} className="flex-1 hover:flex-[1.5] transition-all duration-500 ease-in-out cursor-pointer group relative" style={{ backgroundColor: color }}>
                <span className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-white font-bold tracking-widest text-sm transition-opacity drop-shadow-md">
                  {color.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Color of the Week */}
        <section className="mt-40 text-left">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-gray-900 mb-2">Color of the Week</h2>
              <p className="text-gray-400 font-bold">A special shade picked by our community designers.</p>
            </div>
            <div className="hidden sm:block">
              <span className="px-4 py-2 bg-blue-50 text-blue-600 font-black rounded-full text-xs uppercase tracking-widest">March 2024</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            <div
              className="h-[500px] rounded-[40px] shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer"
              style={{ backgroundColor: '#FF5E5B' }}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              <h3 className="text-7xl font-black text-white drop-shadow-xl uppercase mb-4">Coral Bliss</h3>
              <p className="text-white/80 text-xl font-bold tracking-widest">#FF5E5B</p>
              <button className="mt-10 px-8 py-3 bg-white text-black font-black rounded-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                View palette
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {['#D8E2DC', '#FFE5D9', '#FFCAD4', '#F4ACB7'].map((c, i) => (
                <div key={i} className="rounded-[32px] overflow-hidden shadow-lg border border-gray-50 p-2 bg-white flex flex-col">
                  <div className="h-full rounded-[24px]" style={{ backgroundColor: c }} />
                  <div className="p-4 flex justify-between items-center">
                    <span className="font-black text-xs text-gray-400 uppercase tracking-widest">{c}</span>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Palettes Section */}
        <section className="mt-40 text-left">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-4xl font-black tracking-tight text-gray-900">Trending Palettes</h2>
            <Link to="/Explore" className="text-blue-600 font-black hover:underline underline-offset-8">Browse all</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              ['#1a535c', '#4ecdc4', '#f7fff7', '#ff6b6b', '#ffe66d'],
              ['#2b2d42', '#8d99ae', '#edf2f4', '#ef233c', '#d90429'],
              ['#003049', '#d62828', '#f77f00', '#fcbf49', '#eae2b7'],
              ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d'],
              ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'],
              ['#ff9f1c', '#ffbf69', '#ffffff', '#cbf3f0', '#2ec4b6']
            ].map((palette, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-50 bg-white p-3 cursor-pointer group"
              >
                <div className="h-40 w-full flex rounded-[24px] overflow-hidden mb-4">
                  {palette.map((c, j) => (
                    <div key={j} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="px-4 pb-2 flex items-center justify-between">
                  <span className="font-black text-[10px] text-gray-300 uppercase tracking-widest">Trending #{100 + i}</span>
                  <Heart className="text-gray-200 group-hover:text-red-400 transition-colors" size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="mt-40 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={Play}
            title="Generator"
            description="Create unique color palettes quickly and effortlessly."
            color="bg-blue-600"
          />
          <FeatureCard
            icon={Search}
            title="Explore"
            description="Discover millions of color palettes by topic, style and color."
            color="bg-emerald-500"
          />
          <FeatureCard
            icon={ImageIcon}
            title="Image Picker"
            description="Extract beautiful colors from any image with ease."
            color="bg-amber-400"
          />
          <FeatureCard
            icon={CheckCircle}
            title="Contrast Checker"
            description="Ensure your designs meet accessibility standards."
            color="bg-red-500"
          />
        </section>
      </main>

      <footer className="py-24 text-center text-gray-400 font-bold border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full" />
          </div>
          <span className="text-xl font-black tracking-tighter text-gray-900">Quolors</span>
        </div>
        <p>© 2024 Quolors by Jules. Made with love for premium designers.</p>
        <div className="flex items-center justify-center gap-6 mt-10">
          <a href="#" className="hover:text-gray-900 transition-colors">Twitter</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Instagram</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Pinterest</a>
        </div>
      </footer>
    </div>
  );
}

export default Home;
