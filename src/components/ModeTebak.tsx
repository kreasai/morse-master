import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Play, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import Flashlight from './Flashlight';
import { MORSE_DICT, playMorseSequence } from '../lib/morse';

const LETTERS = Object.keys(MORSE_DICT).filter(k => isNaN(Number(k)));

export default function ModeTebak() {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [targetChar, setTargetChar] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lightActive, setLightActive] = useState(false);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const cancelRef = useRef(false);

  const generateQuestion = () => {
    const target = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    const newOptions = [target];
    
    while (newOptions.length < 4) {
      const randomChar = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      if (!newOptions.includes(randomChar)) {
        newOptions.push(randomChar);
      }
    }
    
    setTargetChar(target);
    setOptions(newOptions.sort(() => Math.random() - 0.5));
    setFeedback('idle');
    setSelectedOption(null);
  };

  useEffect(() => {
    generateQuestion();
    return () => { cancelRef.current = true; };
  }, []);

  const handlePlay = async () => {
    if (!targetChar) return;
    setIsPlaying(true);
    cancelRef.current = false;
    
    try {
      await playMorseSequence(targetChar, setLightActive, () => cancelRef.current);
    } finally {
      setIsPlaying(false);
      setLightActive(false);
    }
  };

  const handleGuess = (option: string) => {
    if (isPlaying || feedback !== 'idle') return;
    
    setSelectedOption(option);
    
    if (option === targetChar) {
      setFeedback('correct');
      setScore(s => s + 10);
      setStreak(s => s + 1);
      setTimeout(() => {
        generateQuestion();
      }, 1500);
    } else {
      setFeedback('wrong');
      setStreak(0);
      setTimeout(() => {
        setFeedback('idle');
        setSelectedOption(null);
      }, 1500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center w-full max-w-lg mx-auto p-4"
    >
      <div className="w-full bg-slate-800 border-4 border-slate-900 rounded-3xl p-4 sm:p-6 shadow-[0_12px_0_0_#0f172a] relative">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 bg-slate-900/50 p-3 sm:p-4 rounded-2xl border-2 border-slate-700">
          <div className="p-2 sm:p-3 bg-green-500 text-white rounded-xl shadow-inner border-2 border-green-400">
            <Target className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">MODE TEBAK</h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">Tebak sandi yang dimainkan</p>
          </div>
        </div>

        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-slate-900 border-4 border-slate-950 px-6 sm:px-8 py-2 sm:py-3 rounded-full flex items-center gap-4 shadow-inner relative">
            <span className="text-slate-400 font-bold tracking-widest uppercase text-sm sm:text-base">SKOR</span>
            <span className="text-3xl sm:text-4xl font-black text-yellow-400 drop-shadow-md">{score}</span>
            {streak > 1 && (
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="absolute -right-4 -top-4 sm:-right-6 sm:-top-6 bg-orange-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full border-4 border-slate-800 font-black text-sm sm:text-base shadow-lg rotate-12"
              >
                🔥 {streak}x
              </motion.div>
            )}
          </div>
        </div>

        <Flashlight active={lightActive} />

        <div className="mt-6 sm:mt-8 flex justify-center pb-2">
          <button
            onClick={handlePlay}
            disabled={isPlaying || feedback !== 'idle'}
            className="bg-blue-500 border-2 border-blue-400 shadow-[0_8px_0_0_#1e3a8a] active:shadow-[0_0px_0_0_#1e3a8a] active:translate-y-2 hover:bg-blue-400 text-white rounded-full p-4 sm:p-6 transition-all disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[0_8px_0_0_#1e3a8a]"
          >
            {isPlaying ? <RefreshCw className="animate-spin w-8 h-8 sm:w-10 sm:h-10" /> : <Play className="ml-1 sm:ml-2 fill-current w-8 h-8 sm:w-10 sm:h-10" />}
          </button>
        </div>

        <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4 pb-2">
          {options.map((option) => {
            let btnClass = "bg-slate-700 border-slate-500 shadow-[0_8px_0_0_#0f172a] text-white hover:bg-slate-600 active:shadow-[0_0px_0_0_#0f172a] active:translate-y-2";
            
            if (feedback !== 'idle') {
              if (option === targetChar) {
                btnClass = "bg-green-500 border-green-400 shadow-[0_8px_0_0_#14532d] text-white translate-y-0";
              } else if (option === selectedOption) {
                btnClass = "bg-red-500 border-red-400 shadow-[0_8px_0_0_#7f1d1d] text-white translate-y-0";
              } else {
                btnClass = "bg-slate-800 border-slate-700 shadow-[0_8px_0_0_#020617] text-slate-500 opacity-50";
              }
            }

            return (
              <button
                key={option}
                onClick={() => handleGuess(option)}
                disabled={isPlaying || feedback !== 'idle'}
                className={`relative py-4 sm:py-6 px-4 sm:px-6 rounded-2xl border-2 font-black text-3xl sm:text-4xl transition-all ${btnClass} disabled:active:translate-y-0`}
              >
                {option}
                {feedback !== 'idle' && option === targetChar && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 bg-slate-900 rounded-full text-green-500 border-4 border-slate-900">
                    <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 fill-current text-slate-900" />
                  </motion.div>
                )}
                {feedback === 'wrong' && option === selectedOption && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 bg-slate-900 rounded-full text-red-500 border-4 border-slate-900">
                    <XCircle className="w-6 h-6 sm:w-8 sm:h-8 fill-current text-slate-900" />
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
