import React, { useState } from 'react';
import StudentApp from './StudentApp';
import PartnerApp from './PartnerApp';
import AdminApp from './AdminApp';
import { User, Building2, ShieldCheck, ArrowRight, Zap, Sparkles } from 'lucide-react';

type AppMode = 'portal' | 'student' | 'partner' | 'admin';

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>('portal');

  // Route based on state
  if (appMode === 'student') return <StudentApp onReturnToPortal={() => setAppMode('portal')} />;
  if (appMode === 'partner') return <PartnerApp onReturnToPortal={() => setAppMode('portal')} />;
  if (appMode === 'admin') return <AdminApp onReturnToPortal={() => setAppMode('portal')} />;

  // Render Portal (Landing Hub)
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden selection:bg-brand-500 selection:text-white">
      
      {/* Background Ambience & Cyberpunk Lighting */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-onyx-800 via-onyx-950 to-black pointer-events-none" />
      <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-8 animate-in fade-in duration-700">
        
        {/* Header */}
        <div className="text-center space-y-3">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              XPASS Operating System v2.0 • Vercel Ready
           </div>
           
           <h1 className="text-5xl font-heading font-bold text-white uppercase tracking-tighter">
              Selecione a <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-orange-400">Interface</span>
           </h1>
           
           <p className="text-zinc-400 text-xs font-mono max-w-xs mx-auto leading-relaxed">
              Ecossistema fitness inteligente. Escolha o seu perfil de acesso para inicializar a conexão.
           </p>
        </div>

        {/* Access Cards */}
        <div className="space-y-4 mt-8">
           
           {/* 1. Student Card */}
           <button 
             onClick={() => setAppMode('student')}
             className="w-full group relative overflow-hidden rounded-2xl bg-onyx-900 border border-white/10 p-5 text-left transition-all hover:border-brand-500 hover:shadow-[0_0_30px_rgba(255,82,0,0.2)] cursor-pointer"
           >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-onyx-800 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:bg-brand-500 group-hover:text-black transition-colors duration-300 shadow-md">
                       <User size={24} />
                    </div>
                    <div>
                       <div className="flex items-center gap-2">
                          <h3 className="font-heading font-bold text-white text-lg uppercase tracking-wide">Aluno (Student)</h3>
                          <span className="text-[9px] font-mono bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded border border-brand-500/30">APP</span>
                       </div>
                       <p className="text-xs font-mono text-zinc-400 mt-0.5">Explorar estúdios, agendar e AI Coach</p>
                    </div>
                 </div>
                 <ArrowRight size={20} className="text-zinc-600 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
              </div>
           </button>

           {/* 2. Partner Card */}
           <button 
             onClick={() => setAppMode('partner')}
             className="w-full group relative overflow-hidden rounded-2xl bg-onyx-900 border border-white/10 p-5 text-left transition-all hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] cursor-pointer"
           >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-onyx-800 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:bg-blue-500 group-hover:text-black transition-colors duration-300 shadow-md">
                       <Building2 size={24} />
                    </div>
                    <div>
                       <div className="flex items-center gap-2">
                          <h3 className="font-heading font-bold text-white text-lg uppercase tracking-wide">Parceiro (Studio)</h3>
                          <span className="text-[9px] font-mono bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">PORTAL</span>
                       </div>
                       <p className="text-xs font-mono text-zinc-400 mt-0.5">Scanner de check-in, aulas e receita</p>
                    </div>
                 </div>
                 <ArrowRight size={20} className="text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
           </button>

           {/* 3. Admin Card */}
           <button 
             onClick={() => setAppMode('admin')}
             className="w-full group relative overflow-hidden rounded-2xl bg-onyx-900 border border-white/10 p-5 text-left transition-all hover:border-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] cursor-pointer"
           >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-onyx-800 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:bg-purple-500 group-hover:text-black transition-colors duration-300 shadow-md">
                       <ShieldCheck size={24} />
                    </div>
                    <div>
                       <div className="flex items-center gap-2">
                          <h3 className="font-heading font-bold text-white text-lg uppercase tracking-wide">Administrador</h3>
                          <span className="text-[9px] font-mono bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30">COMMAND</span>
                       </div>
                       <p className="text-xs font-mono text-zinc-400 mt-0.5">Métricas de GMV, repasses e suporte</p>
                    </div>
                 </div>
                 <ArrowRight size={20} className="text-zinc-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
           </button>
        </div>

        <div className="text-center pt-6 space-y-2">
           <a 
             href="https://ecapx.tech/" 
             target="_blank" 
             rel="noopener noreferrer"
             className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-500/50 text-zinc-400 hover:text-white transition-all text-[11px] font-mono group shadow-lg"
           >
              <span>Engenharia por</span>
              <span className="text-brand-500 font-bold group-hover:underline">ECAPX</span>
              <span className="text-[10px] text-zinc-500">↗ ecapx.tech</span>
           </a>
           <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block">
              XPASS OS v2.0 • Arquitetura SaaS Multilateral
           </p>
        </div>
      </div>
    </div>
  );
};

export default App;
