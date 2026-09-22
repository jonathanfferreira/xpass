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

      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              XPASS Operating System v2.0 • Vercel Ready
           </div>
           
           <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white uppercase tracking-tight">
              Selecione a <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-orange-400">Interface</span>
           </h1>
           
           <p className="text-zinc-400 text-xs sm:text-sm font-mono leading-relaxed">
              Ecossistema fitness multilateral inteligente. Escolha o perfil de acesso para experimentar a plataforma em qualquer dispositivo.
           </p>
        </div>

        {/* Access Cards (Responsive Grid: 1 col on mobile, 3 cols on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           
           {/* 1. Student Card */}
           <div 
             onClick={() => setAppMode('student')}
             className="group relative overflow-hidden rounded-2xl bg-onyx-900/90 border border-white/10 p-6 flex flex-col justify-between transition-all hover:border-brand-500 hover:shadow-[0_0_35px_rgba(255,82,0,0.25)] hover:-translate-y-1 cursor-pointer"
           >
              <div className="absolute inset-0 bg-gradient-to-b from-brand-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-onyx-800 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:bg-brand-500 group-hover:text-black transition-colors duration-300 shadow-md">
                       <User size={26} />
                    </div>
                    <span className="text-[10px] font-mono bg-brand-500/20 text-brand-400 px-2.5 py-1 rounded-full border border-brand-500/30 uppercase font-bold">
                       App Aluno
                    </span>
                 </div>

                 <div>
                    <h3 className="font-heading font-bold text-white text-xl uppercase tracking-wide">Aluno (Student)</h3>
                    <p className="text-xs font-mono text-zinc-400 mt-2 leading-relaxed">
                       Passe digital QR code, carteira holográfica com créditos dinâmicos, busca de estúdios e AI Coach.
                    </p>
                 </div>

                 <div className="pt-2 space-y-1.5 border-t border-white/5 text-[11px] font-mono text-zinc-500">
                    <div className="flex items-center gap-1.5">✓ Check-in com Passe Digital</div>
                    <div className="flex items-center gap-1.5">✓ Integração Supabase em tempo real</div>
                    <div className="flex items-center gap-1.5">✓ AI Coach Gemini integrado</div>
                 </div>
              </div>

              <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-brand-500 group-hover:text-brand-400 font-heading font-bold text-xs uppercase tracking-wider">
                 <span>Acessar Aplicativo</span>
                 <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
              </div>
           </div>

           {/* 2. Partner Card */}
           <div 
             onClick={() => setAppMode('partner')}
             className="group relative overflow-hidden rounded-2xl bg-onyx-900/90 border border-white/10 p-6 flex flex-col justify-between transition-all hover:border-blue-500 hover:shadow-[0_0_35px_rgba(59,130,246,0.25)] hover:-translate-y-1 cursor-pointer"
           >
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-onyx-800 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:bg-blue-500 group-hover:text-black transition-colors duration-300 shadow-md">
                       <Building2 size={26} />
                    </div>
                    <span className="text-[10px] font-mono bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/30 uppercase font-bold">
                       Portal Academia
                    </span>
                 </div>

                 <div>
                    <h3 className="font-heading font-bold text-white text-xl uppercase tracking-wide">Parceiro (Studio)</h3>
                    <p className="text-xs font-mono text-zinc-400 mt-2 leading-relaxed">
                       Terminal de recepção para validação de check-ins via câmera, gestão de grade e extratos financeiros.
                    </p>
                 </div>

                 <div className="pt-2 space-y-1.5 border-t border-white/5 text-[11px] font-mono text-zinc-500">
                    <div className="flex items-center gap-1.5">✓ Validador de QR Code ao vivo</div>
                    <div className="flex items-center gap-1.5">✓ Gerador de aulas com IA</div>
                    <div className="flex items-center gap-1.5">✓ Modo Dono vs Modo Staff</div>
                 </div>
              </div>

              <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-blue-400 group-hover:text-blue-300 font-heading font-bold text-xs uppercase tracking-wider">
                 <span>Acessar Portal</span>
                 <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
              </div>
           </div>

           {/* 3. Admin Card */}
           <div 
             onClick={() => setAppMode('admin')}
             className="group relative overflow-hidden rounded-2xl bg-onyx-900/90 border border-white/10 p-6 flex flex-col justify-between transition-all hover:border-purple-500 hover:shadow-[0_0_35px_rgba(168,85,247,0.25)] hover:-translate-y-1 cursor-pointer"
           >
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-onyx-800 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:bg-purple-500 group-hover:text-black transition-colors duration-300 shadow-md">
                       <ShieldCheck size={26} />
                    </div>
                    <span className="text-[10px] font-mono bg-purple-500/20 text-purple-400 px-2.5 py-1 rounded-full border border-purple-500/30 uppercase font-bold">
                       Console Central
                    </span>
                 </div>

                 <div>
                    <h3 className="font-heading font-bold text-white text-xl uppercase tracking-wide">Administrador</h3>
                    <p className="text-xs font-mono text-zinc-400 mt-2 leading-relaxed">
                       Console executivo para governança da plataforma, GMV, repasses por PIX, conciliação e suporte.
                    </p>
                 </div>

                 <div className="pt-2 space-y-1.5 border-t border-white/5 text-[11px] font-mono text-zinc-500">
                    <div className="flex items-center gap-1.5">✓ Painel analítico de GMV</div>
                    <div className="flex items-center gap-1.5">✓ Command Palette (Ctrl + K)</div>
                    <div className="flex items-center gap-1.5">✓ Auditoria de estornos e disputas</div>
                 </div>
              </div>

              <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-purple-400 group-hover:text-purple-300 font-heading font-bold text-xs uppercase tracking-wider">
                 <span>Acessar Console</span>
                 <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
              </div>
           </div>
        </div>

        <div className="text-center pt-8 space-y-2">
           <a 
             href="https://ecapx.tech/" 
             target="_blank" 
             rel="noopener noreferrer"
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-500/50 text-zinc-400 hover:text-white transition-all text-xs font-mono group shadow-lg"
           >
              <span>Engenharia por</span>
              <span className="text-brand-500 font-bold group-hover:underline">ECAPX</span>
              <span className="text-[10px] text-zinc-500">↗ ecapx.tech</span>
           </a>
           <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest block">
              XPASS OS v2.0 • Arquitetura SaaS Multilateral • 100% Responsivo
           </p>
        </div>
      </div>
    </div>
  );
};

export default App;
