import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { MORSE_DICT } from '../lib/morse';

interface MorseChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MorseChartModal({ isOpen, onClose }: MorseChartModalProps) {
  if (!isOpen) return null;

  const letters = Object.keys(MORSE_DICT).filter(k => isNaN(Number(k)));
  const numbers = Object.keys(MORSE_DICT).filter(k => !isNaN(Number(k)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-800 border-4 border-slate-900 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-[0_12px_0_0_#0f172a] mx-4"
      >
        <div className="sticky top-0 bg-slate-900 border-b-4 border-slate-950 p-4 sm:p-6 flex justify-between items-center z-10 shadow-md">
          <h2 className="text-xl sm:text-2xl font-black text-yellow-400 tracking-wide drop-shadow-md">BANTUAN SANDI MORSE</h2>
          <button
            onClick={onClose}
            className="p-2 sm:p-3 bg-slate-700 border-2 border-slate-600 shadow-[0_4px_0_0_#0f172a] active:shadow-[0_0px_0_0_#0f172a] active:translate-y-1 text-white transition-all rounded-xl hover:bg-slate-600"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-black text-white mb-3 sm:mb-4 tracking-wide">HURUF</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {letters.map(char => (
              <div key={char} className="flex items-center justify-between bg-slate-900 p-3 sm:p-4 rounded-2xl border-b-4 border-slate-950 shadow-inner">
                <span className="text-xl sm:text-2xl font-black text-white">{char}</span>
                <span className="text-yellow-400 font-mono font-bold tracking-widest text-lg sm:text-xl">{MORSE_DICT[char]}</span>
              </div>
            ))}
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white mb-3 sm:mb-4 tracking-wide">ANGKA</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {numbers.map(char => (
              <div key={char} className="flex items-center justify-between bg-slate-900 p-3 sm:p-4 rounded-2xl border-b-4 border-slate-950 shadow-inner">
                <span className="text-xl sm:text-2xl font-black text-white">{char}</span>
                <span className="text-yellow-400 font-mono font-bold tracking-widest text-lg sm:text-xl">{MORSE_DICT[char]}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
