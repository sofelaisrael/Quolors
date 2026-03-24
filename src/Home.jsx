import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Search, Image as ImageIcon, CheckCircle } from 'lucide-react';

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
      <main className="max-w-7xl mx-auto px-10 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-7xl md:text-8xl font-black text-gray-900 tracking-tight leading-[0.9] mb-8">
            The super fast <br /> color palettes <br /> generator!
          </h1>
          <p className="text-2xl font-semibold text-gray-400 max-w-2xl mx-auto mb-12">
            Create the perfect palette or get inspired by thousands of beautiful color schemes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/Generate">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-blue-600 text-white text-xl font-black rounded-2xl shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-3"
              >
                Start the generator!
              </motion.button>
            </Link>
            <Link to="/Explore">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-white border-2 border-gray-100 text-xl font-black rounded-2xl hover:border-gray-200 transition-all"
              >
                Explore palettes
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Hero Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-24 rounded-[40px] overflow-hidden shadow-2xl border-4 border-gray-100/50 p-2 bg-white/50 backdrop-blur"
        >
          <div className="aspect-video w-full bg-gray-50 flex overflow-hidden rounded-[32px]">
             {['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'].map(color => (
                <div key={color} className="flex-1" style={{ backgroundColor: color }} />
             ))}
          </div>
        </motion.div>

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
            color="bg-rose-500"
          />
        </section>
      </main>

      <footer className="py-20 text-center text-gray-400 font-bold border-t border-gray-100">
        <p>© Quolors by Jules. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
