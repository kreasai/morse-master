import { motion } from 'motion/react';
import { Flashlight as FlashlightIcon } from 'lucide-react';

interface FlashlightProps {
  active: boolean;
}

export default function Flashlight({ active }: FlashlightProps) {
  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-sm mx-auto my-4 sm:my-8 scale-90 sm:scale-100 origin-top">
      {/* Outer Glow Beam */}
      <motion.div
        initial={false}
        animate={{
          opacity: active ? 1 : 0,
          scaleY: active ? 1 : 0.8,
          scaleX: active ? 1 : 0.5,
        }}
        transition={{ duration: 0.1 }}
        className="absolute bottom-full mb-2 w-72 h-96 origin-bottom pointer-events-none z-0"
        style={{
          background: 'linear-gradient(to top, rgba(253, 224, 71, 0.6) 0%, rgba(250, 204, 21, 0) 100%)',
          clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
          filter: 'blur(16px)',
        }}
      />

      {/* Inner Core Beam */}
      <motion.div
        initial={false}
        animate={{
          opacity: active ? 1 : 0,
          scaleY: active ? 1 : 0.8,
          scaleX: active ? 1 : 0.5,
        }}
        transition={{ duration: 0.1 }}
        className="absolute bottom-full mb-2 w-40 h-80 origin-bottom pointer-events-none z-0"
        style={{
          background: 'linear-gradient(to top, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 100%)',
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
          filter: 'blur(8px)',
        }}
      />

      {/* Flashlight Body */}
      <div className="relative z-10 flex flex-col items-center drop-shadow-2xl">
        {/* Head */}
        <div className="w-28 h-10 bg-gradient-to-b from-slate-600 to-slate-800 rounded-t-2xl border-t-4 border-x-4 border-slate-900 flex items-center justify-center relative shadow-[inset_0_4px_4px_rgba(255,255,255,0.2)]">
          <div
            className={`absolute top-0 w-24 h-3 rounded-full transition-all duration-75 ${
              active ? 'bg-white shadow-[0_0_30px_15px_rgba(253,224,71,1)]' : 'bg-slate-900 shadow-inner'
            }`}
          />
          {/* Head ridges */}
          <div className="absolute w-full h-full flex justify-evenly items-center opacity-30">
            <div className="w-1 h-full bg-black"></div>
            <div className="w-1 h-full bg-black"></div>
            <div className="w-1 h-full bg-black"></div>
          </div>
        </div>
        
        {/* Neck */}
        <div className="w-20 h-6 bg-gradient-to-b from-slate-800 to-slate-900 border-x-4 border-slate-950 shadow-inner" />
        
        {/* Handle */}
        <div className="w-16 h-36 bg-gradient-to-r from-green-800 via-green-700 to-green-900 rounded-b-xl border-4 border-slate-950 flex flex-col items-center justify-start pt-4 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Grip texture */}
          <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(0deg,transparent,transparent_4px,#000_4px,#000_8px)]" />
          
          {/* Button */}
          <div className="relative z-10 bg-slate-900 p-1 rounded-full border-2 border-slate-700 mt-2">
            <div
              className={`w-6 h-8 rounded-full border-2 border-red-900 transition-all duration-75 ${
                active ? 'bg-red-500 translate-y-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]' : 'bg-red-500 shadow-[0_4px_0_0_#7f1d1d]'
              }`}
            />
          </div>
          
          <FlashlightIcon className="text-green-950 mt-auto mb-4 z-10 opacity-60 drop-shadow-sm" size={28} />
        </div>
      </div>
    </div>
  );
}
