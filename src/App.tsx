/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Type, Target, Hand, ChevronLeft } from 'lucide-react';
import ModeKetik from './components/ModeKetik';
import ModeTebak from './components/ModeTebak';
import ModeTap from './components/ModeTap';
import MorseChartModal from './components/MorseChartModal';

type GameMode = 'menu' | 'ketik' | 'tebak' | 'tap';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('menu');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const renderMode = () => {
    switch (currentMode) {
      case 'ketik': return <ModeKetik key="ketik" />;
      case 'tebak': return <ModeTebak key="tebak" />;
      case 'tap': return <ModeTap key="tap" />;
      default: return (
        <motion.div
          key="menu"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex flex-col items-center w-full max-w-lg mx-auto p-4 space-y-4 mt-4 sm:mt-8"
        >
          <button
            onClick={() => setCurrentMode('ketik')}
            className="w-full bg-blue-600 border-2 border-blue-400 shadow-[0_8px_0_0_#1e3a8a] active:shadow-[0_0px_0_0_#1e3a8a] active:translate-y-2 rounded-2xl p-4 sm:p-6 flex items-center gap-4 sm:gap-6 transition-all group"
          >
            <div className="p-3 sm:p-4 bg-white/20 text-white rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
              <Type className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div className="text-left">
              <h3 className="text-xl sm:text-2xl font-black text-white mb-1 drop-shadow-md tracking-wide">MODE KETIK</h3>
              <p className="text-xs sm:text-sm text-blue-100 font-medium">Ketik teks dan lihat sandinya</p>
            </div>
          </button>

          <button
            onClick={() => setCurrentMode('tebak')}
            className="w-full bg-green-600 border-2 border-green-400 shadow-[0_8px_0_0_#14532d] active:shadow-[0_0px_0_0_#14532d] active:translate-y-2 rounded-2xl p-4 sm:p-6 flex items-center gap-4 sm:gap-6 transition-all group"
          >
            <div className="p-3 sm:p-4 bg-white/20 text-white rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
              <Target className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div className="text-left">
              <h3 className="text-xl sm:text-2xl font-black text-white mb-1 drop-shadow-md tracking-wide">MODE TEBAK</h3>
              <p className="text-xs sm:text-sm text-green-100 font-medium">Tebak sandi yang dimainkan</p>
            </div>
          </button>

          <button
            onClick={() => setCurrentMode('tap')}
            className="w-full bg-purple-600 border-2 border-purple-400 shadow-[0_8px_0_0_#4c1d95] active:shadow-[0_0px_0_0_#4c1d95] active:translate-y-2 rounded-2xl p-4 sm:p-6 flex items-center gap-4 sm:gap-6 transition-all group"
          >
            <div className="p-3 sm:p-4 bg-white/20 text-white rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
              <Hand className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div className="text-left">
              <h3 className="text-xl sm:text-2xl font-black text-white mb-1 drop-shadow-md tracking-wide">MODE TAP</h3>
              <p className="text-xs sm:text-sm text-purple-100 font-medium">Latihan ketuk sandi manual</p>
            </div>
          </button>
        </motion.div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-indigo-950 text-slate-100 font-sans flex flex-col relative overflow-hidden">
      {/* Animated Game Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-purple-600/30 blur-[120px] animate-pulse" />
        <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-600/30 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_2px,transparent_2px),linear-gradient(90deg,rgba(255,255,255,0.05)_2px,transparent_2px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 border-b-4 border-indigo-900 bg-indigo-900/80 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            {currentMode !== 'menu' && (
              <button
                onClick={() => setCurrentMode('menu')}
                className="p-2 -ml-2 bg-indigo-700 border-2 border-indigo-500 shadow-[0_4px_0_0_#312e81] active:shadow-[0_0px_0_0_#312e81] active:translate-y-1 text-white transition-all rounded-full hover:bg-indigo-600"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-500 tracking-tight drop-shadow-sm" style={{ WebkitTextStroke: '1px #713f12' }}>
              MORSE MASTER
            </h1>
          </div>
          <button
            onClick={() => setIsHelpOpen(true)}
            className="p-2 bg-blue-500 border-2 border-blue-300 shadow-[0_4px_0_0_#1e3a8a] active:shadow-[0_0px_0_0_#1e3a8a] active:translate-y-1 text-white transition-all rounded-full hover:bg-blue-400"
            title="Bantuan Sandi Morse"
          >
            <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {renderMode()}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center border-t border-slate-800/50 bg-slate-900/30 backdrop-blur-sm">
        <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
          GAME BY KREASAI.COM
        </p>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {isHelpOpen && (
          <MorseChartModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
