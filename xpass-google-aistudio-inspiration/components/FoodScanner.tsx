import React, { useState, useEffect } from 'react';
import { X, Camera, Zap, Check, Scan } from 'lucide-react';

interface FoodScannerProps {
  onClose: () => void;
  onScanComplete: (calories: number, foodName: string) => void;
}

/**
 * A camera interface for scanning food and estimating calories.
 *
 * Simulates an AI vision analysis process (like Gemini Vision) to identify food
 * and provide nutritional information (calories, macros).
 *
 * @component
 * @param {FoodScannerProps} props - The component props.
 * @param {Function} props.onClose - Callback to close the scanner.
 * @param {Function} props.onScanComplete - Callback executed when scanning is finished, passing calories and food name.
 * @returns {JSX.Element} The rendered FoodScanner component.
 */
const FoodScanner: React.FC<FoodScannerProps> = ({ onClose, onScanComplete }) => {
  const [step, setStep] = useState<'camera' | 'analyzing' | 'result'>('camera');
  const [scannedData, setScannedData] = useState({ name: '', calories: 0, macros: { p: 0, c: 0, f: 0 } });

  // Simulate AI Analysis
  const captureAndAnalyze = () => {
    setStep('analyzing');
    setTimeout(() => {
      // Mock result (simulating Gemini Vision)
      setScannedData({
        name: 'Salmon Poke Bowl',
        calories: 540,
        macros: { p: 35, c: 65, f: 18 }
      });
      setStep('result');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black flex flex-col animate-in fade-in duration-300">
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
         <div className="bg-black/50 backdrop-blur px-3 py-1 rounded-full border border-white/10">
            <span className="text-[10px] font-mono text-brand-500 uppercase tracking-widest flex items-center gap-2">
               <Zap size={10} className="fill-brand-500" /> AI Calorie Vision
            </span>
         </div>
         <button onClick={onClose} className="p-2 bg-black/50 backdrop-blur rounded-full text-white">
            <X size={24} />
         </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center">
         
         {/* CAMERA VIEW */}
         {step === 'camera' && (
            <>
               {/* Mock Camera Feed */}
               <div className="absolute inset-0 bg-zinc-900">
                  <img 
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80" 
                    className="w-full h-full object-cover opacity-60" 
                    alt="Food View"
                  />
                  {/* Grid Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,82,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,82,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
               </div>

               {/* Viewfinder */}
               <div className="relative z-10 w-64 h-64 border-2 border-brand-500/50 rounded-3xl flex items-center justify-center">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-brand-500 -translate-x-1 -translate-y-1" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-brand-500 translate-x-1 -translate-y-1" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-brand-500 -translate-x-1 translate-y-1" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-brand-500 translate-x-1 translate-y-1" />
                  
                  <span className="text-brand-500 font-mono text-xs animate-pulse bg-black/50 px-2 rounded">TARGET LOCKED</span>
               </div>

               <button 
                  onClick={captureAndAnalyze}
                  className="absolute bottom-12 w-20 h-20 rounded-full border-4 border-white flex items-center justify-center z-20 hover:scale-105 transition-transform"
               >
                  <div className="w-16 h-16 bg-white rounded-full" />
               </button>
            </>
         )}

         {/* ANALYZING STATE */}
         {step === 'analyzing' && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-30">
               <div className="w-24 h-24 relative mb-6">
                  <div className="absolute inset-0 border-t-4 border-brand-500 rounded-full animate-spin" />
                  <div className="absolute inset-2 border-r-4 border-white/20 rounded-full animate-spin-reverse" />
                  <Scan size={40} className="absolute inset-0 m-auto text-brand-500 animate-pulse" />
               </div>
               <h3 className="font-heading text-2xl text-white uppercase tracking-widest animate-pulse">Analyzing...</h3>
               <p className="font-mono text-zinc-500 text-xs mt-2">Identifying Composition & Macros</p>
               
               <div className="mt-8 space-y-2 w-64">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                     <span>Segmentation</span>
                     <span className="text-green-500">Done</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-800 rounded-full"><div className="w-full h-full bg-green-500 rounded-full" /></div>
                  
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                     <span>Volume Estimation</span>
                     <span className="text-brand-500 animate-pulse">Processing...</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-800 rounded-full"><div className="w-2/3 h-full bg-brand-500 rounded-full animate-[width_1s_infinite]" /></div>
               </div>
            </div>
         )}

         {/* RESULT STATE */}
         {step === 'result' && (
             <div className="absolute bottom-0 left-0 right-0 bg-onyx-900 rounded-t-3xl p-8 animate-in slide-in-from-bottom duration-500 z-30 border-t border-brand-500/30">
                <div className="flex items-start justify-between mb-6">
                   <div>
                      <h2 className="font-heading text-3xl text-white uppercase">{scannedData.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-[10px] font-bold uppercase rounded border border-green-500/20">High Protein</span>
                         <span className="px-2 py-0.5 bg-brand-500/20 text-brand-500 text-[10px] font-bold uppercase rounded border border-brand-500/20">Mod Carbs</span>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className="block text-4xl font-mono font-bold text-white tracking-tighter">{scannedData.calories}</span>
                      <span className="text-xs font-mono text-zinc-500 uppercase">Kcal</span>
                   </div>
                </div>

                {/* Macros Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                   <div className="bg-onyx-950 p-4 rounded-xl border border-white/5 text-center">
                      <span className="block text-2xl font-mono font-bold text-white">{scannedData.macros.p}g</span>
                      <span className="text-[10px] text-zinc-500 uppercase">Protein</span>
                   </div>
                   <div className="bg-onyx-950 p-4 rounded-xl border border-white/5 text-center">
                      <span className="block text-2xl font-mono font-bold text-white">{scannedData.macros.c}g</span>
                      <span className="text-[10px] text-zinc-500 uppercase">Carbs</span>
                   </div>
                   <div className="bg-onyx-950 p-4 rounded-xl border border-white/5 text-center">
                      <span className="block text-2xl font-mono font-bold text-white">{scannedData.macros.f}g</span>
                      <span className="text-[10px] text-zinc-500 uppercase">Fats</span>
                   </div>
                </div>

                <div className="flex gap-4">
                   <button onClick={() => setStep('camera')} className="flex-1 py-4 bg-onyx-800 rounded-xl text-zinc-400 font-heading uppercase text-sm border border-white/5 hover:bg-onyx-700">
                      Retake
                   </button>
                   <button 
                     onClick={() => onScanComplete(scannedData.calories, scannedData.name)} 
                     className="flex-[2] py-4 bg-brand-500 rounded-xl text-black font-heading font-bold uppercase text-sm hover:bg-brand-400 shadow-[0_0_20px_rgba(255,82,0,0.3)] flex items-center justify-center gap-2"
                   >
                      <Check size={18} /> Log Meal
                   </button>
                </div>
             </div>
         )}
      </div>
    </div>
  );
};

export default FoodScanner;