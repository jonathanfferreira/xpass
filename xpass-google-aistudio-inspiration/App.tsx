import React, { useState } from 'react';
import StudentApp from './StudentApp';
import PartnerApp from './PartnerApp';
import AdminApp from './AdminApp';
import { User, Building2, ShieldCheck, ArrowRight } from 'lucide-react';

type AppMode = 'portal' | 'student' | 'partner' | 'admin';

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>('portal');

  // Handle routing based on state
  if (appMode === 'student') return <StudentApp onReturnToPortal={() => setAppMode('portal')} />;
  if (appMode === 'partner') return <PartnerApp onReturnToPortal={() => setAppMode('portal')} />;
  if (appMode === 'admin') return <AdminApp onReturnToPortal={() => setAppMode('portal')} />;

  // Render the "Portal" (Landing Hub)
  return (
    <div className="min-h-screen bg-onyx-950 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-onyx-800 via-onyx-950 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-8 animate-in fade-in duration-1000 slide-in-from-bottom-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
           <div className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-4">
              XPASS Operating System v2.0
           </div>
           <h1 className="text-5xl font-heading font-bold text-white uppercase tracking-tighter">
              Select <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-red-600">Interface</span>
           </h1>
           <p className="text-zinc-500 text-sm font-mono max-w-xs mx-auto">
              Choose your access level to initialize the appropriate neural connection.
           </p>
        </div>

        {/* Cards */}
        <div className="space-y-4 mt-8">
           
           {/* Student Card */}
           <button 
             onClick={() => setAppMode('student')}
             className="w-full group relative overflow-hidden rounded-2xl bg-onyx-900 border border-white/10 p-6 text-left transition-all hover:border-brand-500/50 hover:shadow-[0_0_30px_rgba(255,82,0,0.15)]"
           >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-onyx-800 border border-white/5 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-black transition-colors duration-300">
                       <User size={24} />
                    </div>
                    <div>
                       <h3 className="font-heading font-bold text-white text-lg uppercase tracking-wide">Student</h3>
                       <p className="text-xs font-mono text-zinc-500">Access Gyms & Classes</p>
                    </div>
                 </div>
                 <ArrowRight size={20} className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
           </button>

           {/* Partner Card */}
           <button 
             onClick={() => setAppMode('partner')}
             className="w-full group relative overflow-hidden rounded-2xl bg-onyx-900 border border-white/10 p-6 text-left transition-all hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
           >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-onyx-800 border border-white/5 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-black transition-colors duration-300">
                       <Building2 size={24} />
                    </div>
                    <div>
                       <h3 className="font-heading font-bold text-white text-lg uppercase tracking-wide">Partner</h3>
                       <p className="text-xs font-mono text-zinc-500">Manage Studio & Check-ins</p>
                    </div>
                 </div>
                 <ArrowRight size={20} className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
           </button>

           {/* Admin Card */}
           <button 
             onClick={() => setAppMode('admin')}
             className="w-full group relative overflow-hidden rounded-2xl bg-onyx-900 border border-white/10 p-6 text-left transition-all hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]"
           >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-onyx-800 border border-white/5 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-black transition-colors duration-300">
                       <ShieldCheck size={24} />
                    </div>
                    <div>
                       <h3 className="font-heading font-bold text-white text-lg uppercase tracking-wide">Admin</h3>
                       <p className="text-xs font-mono text-zinc-500">System Control & Stats</p>
                    </div>
                 </div>
                 <ArrowRight size={20} className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
           </button>

        </div>
      </div>
      
      <div className="absolute bottom-6 text-center">
         <p className="text-[9px] font-mono text-zinc-700 uppercase">Secure Connection • Encrypted v4.2</p>
      </div>
    </div>
  );
};

export default App;