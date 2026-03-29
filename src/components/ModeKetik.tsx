import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Square, Type } from 'lucide-react';
import Flashlight from './Flashlight';
import { playMorseSequence } from '../lib/morse';

export default function ModeKetik() {
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [lightActive, setLightActive] = useState(false);
  const cancelRef = useRef(false);

  const handlePlay = async () => {
    if (!text.trim()) return;
    
    setIsPlaying(true);
    cancelRef.current = false;
    
    try {
      await playMorseSequence(text, setLightActive, () => cancelRef.current);
    } finally {
      setIsPlaying(false);
      setLightActive(false);
    }
  };

  const handleStop = () => {
    cancelRef.current = true;
    setIsPlaying(false);
    setLightActive(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center w-full max-w-lg mx-auto p-4"
    >
      <div className="w-full bg-slate-800 border-4 border-slate-900 rounded-3xl p-4 sm:p-6 shadow-[0_12px_0_0_#0f172a] relative">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 bg-slate-900/50 p-3 sm:p-4 rounded-2xl border-2 border-slate-700">
          <div className="p-2 sm:p-3 bg-blue-500 text-white rounded-xl shadow-inner border-2 border-blue-400">
            <Type className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">MODE KETIK</h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">Ketik teks untuk diubah ke sandi</p>
          </div>
        </div>

        <Flashlight active={lightActive} />

        <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
          <div className="p-2 bg-slate-900 rounded-2xl shadow-inner border-4 border-slate-950">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, ''))}
              placeholder="KETIK PESAN..."
              disabled={isPlaying}
              className="w-full bg-slate-800 text-green-400 rounded-xl px-3 py-3 sm:px-4 sm:py-4 focus:outline-none focus:ring-4 focus:ring-slate-700 disabled:opacity-50 transition-all font-mono text-lg sm:text-xl font-bold tracking-wider uppercase placeholder:text-slate-600"
            />
          </div>
          
          <div className="flex gap-3 sm:gap-4 pb-2">
            {!isPlaying ? (
              <button
                onClick={handlePlay}
                disabled={!text.trim()}
                className="flex-1 bg-yellow-400 border-2 border-yellow-300 shadow-[0_8px_0_0_#b45309] active:shadow-[0_0px_0_0_#b45309] active:translate-y-2 hover:bg-yellow-300 text-yellow-950 font-black text-lg sm:text-xl py-3 px-4 sm:py-4 sm:px-6 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:shadow-[0_8px_0_0_#b45309]"
              >
                <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
                MAINKAN
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="flex-1 bg-red-500 border-2 border-red-400 shadow-[0_8px_0_0_#7f1d1d] active:shadow-[0_0px_0_0_#7f1d1d] active:translate-y-2 hover:bg-red-400 text-white font-black text-lg sm:text-xl py-3 px-4 sm:py-4 sm:px-6 rounded-2xl flex items-center justify-center gap-2 transition-all"
              >
                <Square className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
                BERHENTI
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
