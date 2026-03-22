import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download, FileCode, FileImage, Clipboard, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExportModal = ({ isOpen, onClose }) => {
  const colors = useSelector(state => state.palette.colors);
  const [copied, setCopied] = React.useState(null);

  const copyAsCSS = () => {
    const css = colors.map((c, i) => `--color-${i+1}: ${c.hex};`).join('\n');
    navigator.clipboard.writeText(css);
    setCopied('CSS');
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAsTailwind = () => {
    const colorsObj = colors.reduce((acc, c, i) => {
        acc[`color-${i+1}`] = c.hex;
        return acc;
    }, {});
    navigator.clipboard.writeText(JSON.stringify(colorsObj, null, 2));
    setCopied('Tailwind');
    setTimeout(() => setCopied(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-10"
      >
        <button
            onClick={onClose}
            className="absolute top-8 right-8 p-3 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-gray-900"
        >
            <X size={24} />
        </button>

        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Export Palette</h2>
        <p className="text-lg font-bold text-gray-400 mb-10">Export your color scheme in various formats</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
                onClick={copyAsCSS}
                className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-[2rem] border-2 border-transparent hover:border-blue-500 hover:bg-white transition-all group"
            >
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {copied === 'CSS' ? <Check size={32} /> : <FileCode size={32} />}
                </div>
                <span className="text-lg font-black text-gray-900">Copy CSS</span>
                <span className="text-sm font-bold text-gray-400">Custom Variables</span>
            </button>

            <button
                onClick={copyAsTailwind}
                className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-[2rem] border-2 border-transparent hover:border-blue-500 hover:bg-white transition-all group"
            >
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {copied === 'Tailwind' ? <Check size={32} /> : <Clipboard size={32} />}
                </div>
                <span className="text-lg font-black text-gray-900">Copy JSON</span>
                <span className="text-sm font-bold text-gray-400">Tailwind Theme</span>
            </button>
        </div>

        <div className="mt-10 pt-10 border-t border-gray-100 flex gap-4 h-16">
            {colors.map((c, i) => (
                <div key={i} className="flex-1 rounded-xl shadow-inner" style={{ backgroundColor: c.hex }} />
            ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ExportModal;
