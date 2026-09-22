import React, { useState } from 'react';
import { X, Zap, Check, Scan } from 'lucide-react';

interface FoodScannerProps {
  onClose: () => void;
  onScanComplete: (calories: number, foodName: string) => void;
}

const FoodScanner: React.FC<FoodScannerProps> = ({ onClose, onScanComplete }) => {
  const [step, setStep] = useState<'camera' | 'analyzing' | 'result'>('camera');
  const [scannedData, setScannedData] = useState({ name: '', calories: 0, macros: { p: 0, c: 0, f: 0 } });

  // Simulate AI Analysis
  const captureAndAnalyze = () => {
    setStep('analyzing');
    setTimeout(() => {
      setScannedData({
        name: 'Salmon Poke Bowl Especial',
        calories: 540,
        macros: { p: 38, c: 62, f: 16 }
      });
      setStep('result');
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black flex flex-col animate-in fade-in duration-300">
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
         <div className="bg-black/70 backdrop-blur px-3 py-1 rounded-full border border-white/10">
            <span className="text-[10px] font-mono text-brand-500 uppercase tracking-widest flex items-center gap-2">
               <Zap size={10} className="fill-brand-500" /> AI Calorie Vision
            </span>
         </div>
         <button onClick={onClose} className="p-2 bg-black/70 backdrop-blur rounded-full text-white cursor-pointer hover:bg-white/10">
            <X size={24} />
         </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center">
         
         {/* CAMERA VIEW */}
         {step === 'camera' && (
            <>
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
                  
                  <span className="text-brand-500 font-mono text-xs animate-pulse bg-black/70 px-2.5 py-1 rounded">ALVO TRAVADO</span>
               </div>

               <button 
                  onClick={captureAndAnalyze}
                  className="absolute bottom-12 w-20 h-20 rounded-full border-4 border-white flex items-center justify-center z-20 hover:scale-105 transition-transform cursor-pointer"
               >
                  <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center shadow-[0_0_20px_#FF5200]">
                    <Scan size={24} className="text-black" />
                  </div>
               </button>
            </>
         )}

         {/* ANALYZING STATE */}
         {step === 'analyzing' && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-30">
               <div className="w-24 h-24 relative mb-6">
                  <div className="absolute inset-0 border-t-4 border-brand-500 rounded-full animate-spin" />
                  <Scan size={36} className="absolute inset-0 m-auto text-brand-500 animate-pulse" />
               </div>
               <h3 className="font-heading text-2xl text-white uppercase tracking-widest animate-pulse">Analisando...</h3>
               <p className="font-mono text-zinc-500 text-xs mt-2">Identificando alimentos e macronutrientes</p>
               
               <div className="mt-8 space-y-2 w-64">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                     <span>Segmentação</span>
                     <span className="text-green-500">Concluído</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-800 rounded-full"><div className="w-full h-full bg-green-500 rounded-full" /></div>
                  
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                     <span>Estimativa de Volume</span>
                     <span className="text-brand-500 animate-pulse">Processando...</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-800 rounded-full"><div className="w-2/3 h-full bg-brand-500 rounded-full" /></div>
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
                      <span className="text-[10px] text-zinc-500 uppercase">Proteínas</span>
                   </div>
                   <div className="bg-onyx-950 p-4 rounded-xl border border-white/5 text-center">
                      <span className="block text-2xl font-mono font-bold text-white">{scannedData.macros.c}g</span>
                      <span className="text-[10px] text-zinc-500 uppercase">Carboidratos</span>
                   </div>
                   <div className="bg-onyx-950 p-4 rounded-xl border border-white/5 text-center">
                      <span className="block text-2xl font-mono font-bold text-white">{scannedData.macros.f}g</span>
                      <span className="text-[10px] text-zinc-500 uppercase">Gorduras</span>
                   </div>
                </div>

                <div className="flex gap-4">
                   <button onClick={() => setStep('camera')} className="flex-1 py-4 bg-onyx-800 rounded-xl text-zinc-400 font-heading uppercase text-sm border border-white/5 hover:bg-onyx-700 cursor-pointer">
                      Repetir
                   </button>
                   <button 
                     onClick={() => onScanComplete(scannedData.calories, scannedData.name)} 
                     className="flex-[2] py-4 bg-brand-500 rounded-xl text-black font-heading font-bold uppercase text-sm hover:bg-brand-400 shadow-[0_0_20px_rgba(255,82,0,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                   >
                      <Check size={18} /> Registrar Refeição
                   </button>
                </div>
             </div>
         )}
      </div>
    </div>
  );
};

export default FoodScanner;
