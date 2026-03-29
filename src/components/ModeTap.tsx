import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Hand, Trash2 } from 'lucide-react';
import Flashlight from './Flashlight';
import { REVERSE_MORSE_DICT, initAudio, playTone } from '../lib/morse';

export default function ModeTap() {
  const [lightActive, setLightActive] = useState(false);
  const [currentSequence, setCurrentSequence] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  
  const isPressing = useRef(false);
  const pressStartTime = useRef<number>(0);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const gapTimer = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Initialize audio context for continuous tone
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtxRef.current = new AudioContextClass();
    }
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const startTone = () => {
    if (!audioCtxRef.current) return;
    
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    oscillatorRef.current = audioCtxRef.current.createOscillator();
    gainNodeRef.current = audioCtxRef.current.createGain();

    oscillatorRef.current.type = 'sine';
    oscillatorRef.current.frequency.setValueAtTime(600, audioCtxRef.current.currentTime);

    gainNodeRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
    gainNodeRef.current.gain.linearRampToValueAtTime(1, audioCtxRef.current.currentTime + 0.01);

    oscillatorRef.current.connect(gainNodeRef.current);
    gainNodeRef.current.connect(audioCtxRef.current.destination);

    oscillatorRef.current.start();
  };

  const stopTone = () => {
    if (!audioCtxRef.current || !gainNodeRef.current || !oscillatorRef.current) return;
    
    gainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.01);
    oscillatorRef.current.stop(audioCtxRef.current.currentTime + 0.01);
    
    oscillatorRef.current = null;
    gainNodeRef.current = null;
  };

  const handlePressStart = (e: React.PointerEvent) => {
    if (isPressing.current) return;
    isPressing.current = true;
    
    initAudio();
    setLightActive(true);
    startTone();
    pressStartTime.current = Date.now();
    
    if (gapTimer.current) {
      clearTimeout(gapTimer.current);
      gapTimer.current = null;
    }
  };

  const handlePressEnd = (e: React.PointerEvent) => {
    if (!isPressing.current) return;
    isPressing.current = false;
    
    setLightActive(false);
    stopTone();
    
    const duration = Date.now() - pressStartTime.current;
    const symbol = duration > 250 ? '-' : '.';
    
    setCurrentSequence(prev => {
      const newSeq = prev + symbol;
      
      // Start gap timer to process the sequence
      if (gapTimer.current) {
        clearTimeout(gapTimer.current);
      }
      gapTimer.current = setTimeout(() => {
        processSequence(newSeq);
      }, 800); // 800ms gap means end of letter
      
      return newSeq;
    });
  };

  const processSequence = (seq: string) => {
    const char = REVERSE_MORSE_DICT[seq];
    if (char) {
      setTranslatedText(prev => prev + char);
    } else {
      setTranslatedText(prev => prev + '?');
    }
    setCurrentSequence('');
  };

  const handleClear = () => {
    setTranslatedText('');
    setCurrentSequence('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center w-full max-w-lg mx-auto p-4"
    >
      <div className="w-full bg-slate-800 border-4 border-slate-900 rounded-3xl p-4 sm:p-6 shadow-[0_12px_0_0_#0f172a] relative">
        <div className="flex items-center justify-between mb-4 sm:mb-6 bg-slate-900/50 p-3 sm:p-4 rounded-2xl border-2 border-slate-700">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-purple-500 text-white rounded-xl shadow-inner border-2 border-purple-400">
              <Hand className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">MODE TAP</h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Latihan ketuk manual</p>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="p-2 sm:p-3 bg-red-500 border-2 border-red-400 shadow-[0_4px_0_0_#7f1d1d] active:shadow-[0_0px_0_0_#7f1d1d] active:translate-y-1 text-white transition-all rounded-xl hover:bg-red-400"
            title="Hapus Teks"
          >
            <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <Flashlight active={lightActive} />

        <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
          <div className="bg-slate-900 border-4 border-slate-950 shadow-inner rounded-2xl p-4 sm:p-6 min-h-[100px] sm:min-h-[120px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            <div className="text-2xl sm:text-3xl font-mono text-green-400 font-bold tracking-widest break-words relative z-10 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
              {translatedText || <span className="text-slate-700">_</span>}
            </div>
            <div className="text-yellow-400 font-mono text-xl sm:text-2xl font-bold tracking-[0.5em] h-8 mt-4 flex items-end relative z-10">
              {currentSequence}
            </div>
          </div>

          <div className="w-full h-32 sm:h-40 pb-4">
            <button
              onPointerDown={handlePressStart}
              onPointerUp={handlePressEnd}
              onPointerLeave={handlePressEnd}
              onPointerCancel={handlePressEnd}
              onContextMenu={(e) => e.preventDefault()}
              className={`w-full h-full rounded-[2rem] border-4 flex items-center justify-center text-4xl sm:text-5xl font-black transition-all duration-75 select-none touch-none ${
                lightActive 
                  ? 'bg-yellow-400 border-yellow-200 text-yellow-900 shadow-[0_0px_0_0_#b45309] translate-y-4' 
                  : 'bg-red-500 border-red-400 text-white shadow-[0_16px_0_0_#7f1d1d] hover:bg-red-400'
              }`}
            >
              TAP
            </button>
          </div>
          <p className="text-center text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest">
            Tahan untuk garis (-)
          </p>
        </div>
      </div>
    </motion.div>
  );
}
