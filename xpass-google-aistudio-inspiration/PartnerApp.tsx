import React, { useState, useEffect } from 'react';
import { ScanLine, Calendar, PieChart, Settings, Plus, Wallet, Camera, ChevronRight, LogOut, Activity, BarChart3, X, Check, Clock, Users, MapPin, AlertCircle, Sparkles, Wand2, Shield, Lock, UserCog, User } from 'lucide-react';

interface PartnerAppProps {
  onReturnToPortal: () => void;
}

type PartnerTab = 'validate' | 'classes' | 'financial' | 'settings';
type ScanStatus = 'idle' | 'scanning' | 'processing' | 'success' | 'error';
type UserRole = 'owner' | 'staff';

interface ClassItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  duration: string;
  instructor: string;
  spots: number;
  booked: number;
}

const PartnerApp: React.FC<PartnerAppProps> = ({ onReturnToPortal }) => {
  const [currentTab, setCurrentTab] = useState<PartnerTab>('validate');
  const [userRole, setUserRole] = useState<UserRole>('owner'); // Default to Owner for demo

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  
  // Scanner Logic State
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [scannedUser, setScannedUser] = useState<string | null>(null);
  
  // Dashboard Data State
  const [dailyRevenue, setDailyRevenue] = useState(450);
  const [checkInCount, setCheckInCount] = useState(12);

  // State for Classes
  const [classes, setClasses] = useState<ClassItem[]>([
    { id: '1', title: 'CrossFit WOD', description: 'Treino de alta intensidade focado em força e condicionamento.', time: '07:00', duration: '60min', instructor: 'Coach Mike', spots: 20, booked: 12 },
    { id: '2', title: 'HIIT Circuit', description: 'Circuito funcional para queima calórica acelerada.', time: '18:30', duration: '45min', instructor: 'Sarah J.', spots: 15, booked: 15 },
  ]);

  // New Class Form State
  const [newClass, setNewClass] = useState({ title: '', description: '', time: '', instructor: '' });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Security Effect: If switching to Staff, force redirect if on restricted tab
  useEffect(() => {
    if (userRole === 'staff' && currentTab === 'financial') {
      setCurrentTab('validate');
    }
  }, [userRole, currentTab]);

  // Simulate Scanning Process
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isCameraOpen && scanStatus === 'idle') {
      // Auto-scan simulation after 2 seconds
      setScanStatus('scanning');
      timer = setTimeout(() => {
        setScanStatus('processing');
        // Process...
        setTimeout(() => {
           const isSuccess = Math.random() > 0.3; // 70% success rate for demo
           if (isSuccess) {
              setScanStatus('success');
              setScannedUser('Julia K.');
              // Only update revenue locally for display, in real app backend handles this safely
              setDailyRevenue(prev => prev + 15);
              setCheckInCount(prev => prev + 1);
           } else {
              setScanStatus('error');
           }
        }, 1500);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isCameraOpen, scanStatus]);

  const resetScanner = () => {
    setScanStatus('idle');
    setScannedUser(null);
  };

  const handleAddClass = () => {
    if (!newClass.title || !newClass.time) return;
    const item: ClassItem = {
      id: Math.random().toString(),
      title: newClass.title,
      description: newClass.description,
      time: newClass.time,
      duration: '60min',
      instructor: newClass.instructor || 'Staff',
      spots: 20,
      booked: 0
    };
    setClasses([...classes, item].sort((a, b) => a.time.localeCompare(b.time)));
    setIsClassModalOpen(false);
    setNewClass({ title: '', description: '', time: '', instructor: '' });
  };

  const generateAIContent = () => {
     if (!newClass.title) return;
     setIsGeneratingAI(true);
     
     // Simulate Gemini API Call
     setTimeout(() => {
        const keywords = newClass.title.toLowerCase();
        let aiTitle = newClass.title;
        let aiDesc = "Venha treinar conosco!";

        if (keywords.includes('yoga')) {
           aiTitle = "Sunrise Yoga Flow";
           aiDesc = "Comece o dia com energia e equilíbrio. Uma prática fluida focada em respiração, flexibilidade e conexão mente-corpo. Ideal para todos os níveis.";
        } else if (keywords.includes('boxe') || keywords.includes('luta')) {
           aiTitle = "Boxe Conditioning Pro";
           aiDesc = "Aumente sua resistência e libere o estresse. Aula técnica de boxe combinada com exercícios funcionais de alta intensidade.";
        } else if (keywords.includes('pilates')) {
           aiTitle = "Core Pilates Precision";
           aiDesc = "Fortaleça seu centro de força. Exercícios controlados para melhorar postura, tonificar músculos profundos e prevenir lesões.";
        } else {
           aiTitle = `Power ${newClass.title}`;
           aiDesc = "Uma experiência de treino única projetada para superar seus limites. Prepare-se para suar e conquistar seus objetivos.";
        }

        setNewClass(prev => ({ ...prev, title: aiTitle, description: aiDesc }));
        setIsGeneratingAI(false);
     }, 1500);
  };

  // --- TAB 1: VALIDATE (Scanner) ---
  const renderValidate = () => (
    <div className="flex flex-col h-full animate-in fade-in duration-500 relative">
      {/* Revenue Card - Only visible to Owner */}
      {userRole === 'owner' ? (
        <div className="mt-6 p-6 mx-6 rounded-2xl bg-onyx-900 border border-white/5 flex justify-between items-start relative overflow-hidden group">
          <div className="relative z-10">
             <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Receita Acumulada</p>
             <h2 className="text-4xl font-heading font-bold text-white tracking-tight">R$ {dailyRevenue}</h2>
             <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-mono text-green-500 uppercase">{checkInCount} Check-ins Hoje</span>
             </div>
          </div>
          <div className="relative z-10 p-3 bg-white/5 rounded-xl text-zinc-400 group-hover:text-brand-500 transition-colors">
             <Wallet size={24} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      ) : (
        <div className="mt-6 p-6 mx-6 rounded-2xl bg-onyx-900 border border-white/5 flex items-center justify-between">
           <div>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Turno Atual</p>
              <h2 className="text-2xl font-heading font-bold text-white tracking-tight">Recepção Tarde</h2>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-green-500 uppercase">{checkInCount} Check-ins</span>
           </div>
        </div>
      )}

      {/* Main Action - Scanner */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative">
         
         {isCameraOpen ? (
            <div className="relative w-full max-w-sm aspect-[3/4] bg-zinc-900 rounded-3xl overflow-hidden border border-brand-500/50 shadow-[0_0_50px_rgba(255,82,0,0.15)] flex flex-col items-center justify-center">
               {/* VIDEO FEED BACKGROUND */}
               {scanStatus !== 'success' && scanStatus !== 'error' && (
                 <>
                   <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity" alt="Camera Feed" />
                   
                   {/* Viewfinder UI */}
                   <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                      <div className="flex justify-between">
                         <div className="w-8 h-8 border-t-2 border-l-2 border-brand-500 rounded-tl-lg" />
                         <div className="w-8 h-8 border-t-2 border-r-2 border-brand-500 rounded-tr-lg" />
                      </div>
                      
                      {scanStatus === 'processing' ? (
                        <div className="flex flex-col items-center">
                           <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
                           <span className="bg-black/60 text-white text-[10px] font-mono px-3 py-1 rounded uppercase">Validating...</span>
                        </div>
                      ) : (
                        <div className="w-full h-0.5 bg-brand-500 shadow-[0_0_15px_#FF5200] animate-[scan_2s_ease-in-out_infinite]" />
                      )}

                      <div className="flex justify-between">
                         <div className="w-8 h-8 border-b-2 border-l-2 border-brand-500 rounded-bl-lg" />
                         <div className="w-8 h-8 border-b-2 border-r-2 border-brand-500 rounded-br-lg" />
                      </div>
                   </div>
                   
                   {scanStatus === 'scanning' && (
                     <div className="absolute bottom-6 left-0 right-0 text-center z-10">
                        <span className="bg-black/60 text-brand-500 text-[10px] font-mono px-3 py-1 rounded uppercase animate-pulse">Scanning QR...</span>
                     </div>
                   )}
                 </>
               )}

               {/* SUCCESS STATE */}
               {scanStatus === 'success' && (
                 <div className="absolute inset-0 bg-green-500 flex flex-col items-center justify-center p-6 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                       <Check size={40} className="text-green-600" strokeWidth={3} />
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-white uppercase mb-1">Aprovado</h2>
                    <p className="font-mono text-white/80 text-sm mb-6">{scannedUser}</p>
                    <div className="bg-black/20 rounded-lg p-4 w-full mb-6">
                       <div className="flex justify-between text-xs font-mono text-white mb-1">
                          <span>Plano:</span>
                          <span className="font-bold">Gold</span>
                       </div>
                       <div className="flex justify-between text-xs font-mono text-white">
                          <span>Status:</span>
                          <span className="font-bold">Ativo</span>
                       </div>
                    </div>
                    <button 
                       onClick={resetScanner}
                       className="bg-white text-green-600 font-heading font-bold uppercase px-8 py-3 rounded-lg shadow-lg"
                    >
                       Novo Scan
                    </button>
                 </div>
               )}

               {/* ERROR STATE */}
               {scanStatus === 'error' && (
                 <div className="absolute inset-0 bg-red-600 flex flex-col items-center justify-center p-6 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                       <X size={40} className="text-red-600" strokeWidth={3} />
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-white uppercase mb-1">Recusado</h2>
                    <p className="font-mono text-white/80 text-sm mb-6">Saldo Insuficiente</p>
                    <button 
                       onClick={resetScanner}
                       className="bg-white text-red-600 font-heading font-bold uppercase px-8 py-3 rounded-lg shadow-lg"
                    >
                       Tentar Novamente
                    </button>
                 </div>
               )}
            </div>
         ) : (
            <>
              <div className="w-24 h-24 bg-onyx-900 rounded-full border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,82,0,0.1)] relative group cursor-pointer hover:border-brand-500/50 transition-all" onClick={() => { setIsCameraOpen(true); setScanStatus('idle'); }}>
                  <div className="absolute inset-0 rounded-full border border-brand-500/30 animate-[ping_3s_infinite]" />
                  <ScanLine size={40} className="text-brand-500 group-hover:scale-110 transition-transform" />
              </div>
              
              <h3 className="font-heading text-2xl font-bold uppercase tracking-wide text-white mb-2">Validar Acesso</h3>
              <p className="text-zinc-500 font-mono text-xs max-w-xs mb-8">
                Aponte a câmera para o QR Code do aluno para liberar a catraca.
              </p>
            </>
         )}

         {(scanStatus !== 'success' && scanStatus !== 'error') && (
            <button 
              onClick={() => {
                setIsCameraOpen(!isCameraOpen);
                setScanStatus('idle');
              }}
              className={`w-full max-w-sm font-heading font-bold uppercase tracking-wide py-4 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 mt-4 ${isCameraOpen ? 'bg-zinc-800 text-white border border-white/10' : 'bg-brand-500 hover:bg-brand-400 text-black shadow-brand-500/20'}`}
            >
              {isCameraOpen ? (
                <>
                  <X size={20} /> Fechar Câmera
                </>
              ) : (
                <>
                  <Camera size={20} /> Abrir Câmera
                </>
              )}
            </button>
         )}
      </div>
    </div>
  );

  // --- TAB 2: CLASSES (Schedule) ---
  const renderClasses = () => (
    <div className="flex flex-col h-full animate-in fade-in duration-500 px-6 pt-6 pb-24 overflow-y-auto">
       <div className="flex justify-between items-center mb-8 sticky top-0 bg-black/90 backdrop-blur-md py-4 z-10 border-b border-white/5">
          <div>
            <h2 className="font-heading text-xl font-bold uppercase text-white tracking-wide">Grade de Aulas</h2>
            <p className="text-[10px] font-mono text-zinc-500">Hoje, {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
          {/* Only Owner can create new classes */}
          {userRole === 'owner' && (
            <button 
               onClick={() => setIsClassModalOpen(true)}
               className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-black hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,82,0,0.4)]"
            >
               <Plus size={24} />
            </button>
          )}
       </div>

       {classes.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-onyx-900/30 py-12">
            <p className="font-mono text-zinc-500 text-sm mb-4">Nenhuma aula cadastrada.</p>
            {userRole === 'owner' && (
               <button onClick={() => setIsClassModalOpen(true)} className="text-brand-500 font-mono text-sm uppercase underline decoration-brand-500/30 hover:decoration-brand-500 underline-offset-4 transition-all">
                  Criar primeira aula
               </button>
            )}
         </div>
       ) : (
         <div className="space-y-4">
            {classes.map((cls) => (
              <div key={cls.id} className="group relative bg-onyx-900 border border-white/5 rounded-xl p-4 overflow-hidden hover:border-brand-500/30 transition-all">
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500" />
                 
                 <div className="flex justify-between items-start mb-2">
                    <h3 className="font-heading font-bold text-white text-lg uppercase">{cls.title}</h3>
                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-white border border-white/5">{cls.duration}</span>
                 </div>
                 
                 {cls.description && (
                   <p className="text-xs text-zinc-500 leading-relaxed mb-4 line-clamp-2">{cls.description}</p>
                 )}
                 
                 <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 mb-4">
                    <div className="flex items-center gap-1.5"><Clock size={12} className="text-brand-500" /> {cls.time}</div>
                    <div className="flex items-center gap-1.5"><Users size={12} className="text-brand-500" /> {cls.instructor}</div>
                 </div>

                 {/* Progress Bar */}
                 <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono uppercase">
                       <span className="text-zinc-500">Capacidade</span>
                       <span className={cls.booked >= cls.spots ? 'text-red-500' : 'text-brand-500'}>{cls.booked}/{cls.spots}</span>
                    </div>
                    <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                       <div 
                          className={`h-full rounded-full ${cls.booked >= cls.spots ? 'bg-red-500' : 'bg-brand-500'}`} 
                          style={{ width: `${(cls.booked / cls.spots) * 100}%` }}
                       />
                    </div>
                 </div>
              </div>
            ))}
         </div>
       )}
    </div>
  );

  // --- TAB 3: FINANCIAL (RESTRICTED) ---
  const renderFinancial = () => {
    // Double check logic (though tab shouldn't be selectable)
    if (userRole !== 'owner') return null;

    return (
      <div className="flex flex-col h-full animate-in fade-in duration-500 px-6 pt-6 pb-24 overflow-y-auto">
         <div className="flex items-center gap-2 mb-6">
            <Activity size={20} className="text-brand-500" />
            <h2 className="font-heading text-xl font-bold uppercase text-white tracking-wide">Command Center</h2>
         </div>

         <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-onyx-900 border border-white/5 rounded-xl">
               <p className="text-[9px] font-mono text-zinc-500 uppercase mb-2">$ Revenue (Mês)</p>
               <p className="text-2xl font-mono text-white">R$ 4.250</p>
            </div>
            <div className="p-4 bg-onyx-900 border border-white/5 rounded-xl">
               <p className="text-[9px] font-mono text-zinc-500 uppercase mb-2"><Activity size={10} className="inline mr-1"/> Check-ins</p>
               <p className="text-2xl font-mono text-white">{142 + (checkInCount - 12)}</p>
            </div>
         </div>

         {/* FAKE CHART using Flexbox */}
         <div className="w-full bg-onyx-900 border border-white/5 rounded-xl mb-6 p-4">
            <div className="flex justify-between items-center mb-4">
               <p className="text-[9px] font-mono text-zinc-500 uppercase">Performance (7 Dias)</p>
               <BarChart3 size={14} className="text-zinc-700" />
            </div>
            <div className="h-40 flex items-end justify-between gap-2">
               {[30, 45, 25, 60, 80, 50, 90].map((h, i) => (
                 <div key={i} className="w-full bg-zinc-800 rounded-t-sm relative group">
                    <div 
                      className="absolute bottom-0 w-full bg-brand-500/20 group-hover:bg-brand-500 transition-colors rounded-t-sm" 
                      style={{ height: `${h}%` }} 
                    />
                 </div>
               ))}
            </div>
            <div className="flex justify-between mt-2">
               {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
                  <span key={i} className="text-[8px] font-mono text-zinc-600 w-full text-center">{d}</span>
               ))}
            </div>
         </div>
         
         {/* Activity List... */}
         <div className="w-full bg-onyx-900 border border-white/5 rounded-xl p-4">
            <p className="text-[9px] font-mono text-zinc-500 uppercase mb-4">Recent Activity</p>
            <div className="space-y-3">
               {scanStatus === 'success' && scannedUser && (
                  <div className="flex justify-between items-center text-xs font-mono border-b border-white/5 pb-2 animate-in slide-in-from-left">
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-white">{scannedUser}</span>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className="text-zinc-600">Agora</span>
                        <span className="text-brand-500 font-bold">+R$ 15</span>
                     </div>
                  </div>
               )}
               {[
                 { user: 'Ana Silva', time: '10:42', type: 'Check-in', val: '+R$ 15' },
                 { user: 'Marcos R.', time: '09:15', type: 'Check-in', val: '+R$ 15' },
                 { user: 'Julia K.', time: '08:30', type: 'No-Show', val: 'R$ 0', fail: true }
               ].map((log, i) => (
                  <div key={i} className="flex justify-between items-center text-xs font-mono border-b border-white/5 pb-2 last:border-0 last:pb-0">
                     <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${log.fail ? 'bg-red-500' : 'bg-green-500'}`} />
                        <span className="text-white">{log.user}</span>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className="text-zinc-600">{log.time}</span>
                        <span className={log.fail ? 'text-zinc-600 line-through' : 'text-brand-500'}>{log.val}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    );
  };

  // --- TAB 4: SETTINGS ---
  const renderSettings = () => (
    <div className="flex flex-col h-full animate-in fade-in duration-500 px-6 pt-6">
       <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
          <div className="w-20 h-20 bg-onyx-900 rounded-full flex items-center justify-center border border-white/10 mb-6 relative">
             <Settings size={32} className="text-zinc-600" />
             {userRole === 'staff' && (
                <div className="absolute -bottom-1 -right-1 bg-onyx-800 p-1.5 rounded-full border border-white/10">
                   <Lock size={12} className="text-zinc-500" />
                </div>
             )}
          </div>
          <h3 className="text-white font-heading text-lg uppercase mb-2">
             {userRole === 'owner' ? 'Configurações Avançadas' : 'Perfil do Colaborador'}
          </h3>
          
          {userRole === 'owner' ? (
             <p className="font-mono text-zinc-500 text-xs mb-8">Gerencie permissões, horários de funcionamento e dados bancários.</p>
          ) : (
             <p className="font-mono text-zinc-500 text-xs mb-8">Você não tem permissão para alterar dados sensíveis da academia.</p>
          )}
          
          {userRole === 'owner' && (
             <button className="px-6 py-2 rounded-full border border-white/10 text-xs font-mono text-zinc-400 hover:text-white hover:border-white transition-colors">
                Gerenciar Dados Bancários
             </button>
          )}
       </div>

       <div className="mb-24">
          <button 
             onClick={onReturnToPortal}
             className="w-full border border-red-500/20 text-red-500 hover:bg-red-500/10 font-mono text-xs uppercase py-4 rounded-lg transition-colors flex items-center justify-center gap-2 group"
          >
             <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
             Encerrar Sessão
          </button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col relative">
      
      {/* Top Bar with Role Switcher (DEMO FEATURE) */}
      <header className="px-6 pt-8 pb-2 flex justify-between items-center border-b border-transparent">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <p className="text-[10px] font-heading font-bold text-brand-500 uppercase tracking-widest">Painel Parceiro</p>
             
             {/* ROLE BADGE */}
             <div className={`px-1.5 py-0.5 rounded text-[8px] font-mono uppercase border ${
                userRole === 'owner' 
                   ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' 
                   : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
             }`}>
                {userRole === 'owner' ? 'Owner Access' : 'Staff Access'}
             </div>
           </div>
           
           <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setUserRole(prev => prev === 'owner' ? 'staff' : 'owner')}>
              <h1 className="text-xl font-heading font-bold text-white uppercase tracking-wide">
                 {userRole === 'owner' ? 'Jonathan Ferreira' : 'Recepção (Beatriz)'}
              </h1>
              <UserCog size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
           </div>
        </div>
        
        <div 
          onClick={() => setUserRole(prev => prev === 'owner' ? 'staff' : 'owner')}
          className={`w-8 h-8 rounded flex items-center justify-center text-black font-bold font-heading shadow-[0_0_10px_rgba(255,82,0,0.4)] cursor-pointer transition-all ${userRole === 'owner' ? 'bg-brand-500' : 'bg-blue-500'}`}
          title="Switch Role"
        >
           {userRole === 'owner' ? 'J' : 'B'}
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-hidden relative">
         {currentTab === 'validate' && renderValidate()}
         {currentTab === 'classes' && renderClasses()}
         {currentTab === 'financial' && userRole === 'owner' && renderFinancial()}
         {currentTab === 'settings' && renderSettings()}
      </main>

      {/* NEW CLASS MODAL (Only Owner can see trigger, but guarded here too) */}
      {isClassModalOpen && userRole === 'owner' && (
         <div className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-200">
            <div className="w-full h-[90%] sm:h-auto sm:max-w-md bg-onyx-950 border-t sm:border border-white/10 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 relative overflow-y-auto">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-heading text-xl text-white uppercase">Nova Aula</h3>
                  <button onClick={() => setIsClassModalOpen(false)} className="p-2 bg-onyx-900 rounded-full text-zinc-400 hover:text-white">
                     <X size={20} />
                  </button>
               </div>

               {/* AI Promo Box */}
               <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/20 to-brand-900/20 rounded-xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                     <Sparkles size={48} />
                  </div>
                  <div className="flex items-start gap-3 relative z-10">
                     <div className="bg-gradient-to-br from-brand-500 to-purple-600 p-2 rounded-lg text-white shadow-lg">
                        <Wand2 size={16} />
                     </div>
                     <div>
                        <h4 className="font-heading text-sm text-white uppercase mb-1">AI Magic Fill</h4>
                        <p className="text-[10px] text-zinc-400 leading-relaxed">
                           Digite apenas o nome básico da aula e deixe a IA criar um título atrativo e uma descrição completa para você.
                        </p>
                     </div>
                  </div>
               </div>

               <div className="space-y-4 mb-8">
                  <div>
                     <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Nome da Aula (Ou Ideia)</label>
                     <div className="flex gap-2">
                        <input 
                           type="text" 
                           value={newClass.title}
                           onChange={(e) => setNewClass({...newClass, title: e.target.value})}
                           placeholder="Ex: Yoga"
                           className="flex-1 bg-onyx-900 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-brand-500 focus:outline-none transition-colors"
                        />
                        <button 
                           onClick={generateAIContent}
                           disabled={!newClass.title || isGeneratingAI}
                           className="bg-onyx-800 border border-white/10 text-brand-500 hover:bg-brand-500 hover:text-black hover:border-brand-500 rounded-lg px-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                           {isGeneratingAI ? <Sparkles size={18} className="animate-spin" /> : <Wand2 size={18} />}
                        </button>
                     </div>
                  </div>
                  
                  <div>
                     <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Descrição (Opcional)</label>
                     <textarea 
                        value={newClass.description}
                        onChange={(e) => setNewClass({...newClass, description: e.target.value})}
                        placeholder="Gerado automaticamente pela IA..."
                        rows={3}
                        className="w-full bg-onyx-900 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-brand-500 focus:outline-none transition-colors resize-none"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Horário</label>
                        <input 
                           type="time" 
                           value={newClass.time}
                           onChange={(e) => setNewClass({...newClass, time: e.target.value})}
                           className="w-full bg-onyx-900 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-brand-500 focus:outline-none transition-colors"
                        />
                     </div>
                     <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Instrutor</label>
                        <input 
                           type="text" 
                           value={newClass.instructor}
                           onChange={(e) => setNewClass({...newClass, instructor: e.target.value})}
                           placeholder="Ex: Pedro"
                           className="w-full bg-onyx-900 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-brand-500 focus:outline-none transition-colors"
                        />
                     </div>
                  </div>
               </div>

               <button 
                  onClick={handleAddClass}
                  className="w-full bg-brand-500 text-black font-heading font-bold uppercase py-4 rounded-xl hover:bg-brand-400 transition-colors shadow-[0_0_20px_rgba(255,82,0,0.3)]"
               >
                  Confirmar Criação
               </button>
            </div>
         </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-onyx-950 border-t border-white/5 px-6 py-4 pb-8 z-50">
         <div className={`flex items-center max-w-md mx-auto ${userRole === 'owner' ? 'justify-between' : 'justify-around'}`}>
            <button 
               onClick={() => setCurrentTab('validate')}
               className={`flex flex-col items-center gap-1.5 transition-colors ${currentTab === 'validate' ? 'text-brand-500' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
               <ScanLine size={24} strokeWidth={currentTab === 'validate' ? 2.5 : 1.5} className={currentTab === 'validate' ? 'drop-shadow-[0_0_5px_rgba(255,82,0,0.8)]' : ''} />
               <span className="text-[9px] font-heading uppercase tracking-widest">Validar</span>
            </button>
            <button 
               onClick={() => setCurrentTab('classes')}
               className={`flex flex-col items-center gap-1.5 transition-colors ${currentTab === 'classes' ? 'text-brand-500' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
               <Calendar size={24} strokeWidth={currentTab === 'classes' ? 2.5 : 1.5} className={currentTab === 'classes' ? 'drop-shadow-[0_0_5px_rgba(255,82,0,0.8)]' : ''} />
               <span className="text-[9px] font-heading uppercase tracking-widest">Aulas</span>
            </button>
            
            {/* FINANCIAL TAB: ONLY VISIBLE TO OWNER */}
            {userRole === 'owner' && (
               <button 
                  onClick={() => setCurrentTab('financial')}
                  className={`flex flex-col items-center gap-1.5 transition-colors ${currentTab === 'financial' ? 'text-brand-500' : 'text-zinc-600 hover:text-zinc-400'}`}
               >
                  <PieChart size={24} strokeWidth={currentTab === 'financial' ? 2.5 : 1.5} className={currentTab === 'financial' ? 'drop-shadow-[0_0_5px_rgba(255,82,0,0.8)]' : ''} />
                  <span className="text-[9px] font-heading uppercase tracking-widest">Financeiro</span>
               </button>
            )}

            <button 
               onClick={() => setCurrentTab('settings')}
               className={`flex flex-col items-center gap-1.5 transition-colors ${currentTab === 'settings' ? 'text-brand-500' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
               <Settings size={24} strokeWidth={currentTab === 'settings' ? 2.5 : 1.5} className={currentTab === 'settings' ? 'drop-shadow-[0_0_5px_rgba(255,82,0,0.8)]' : ''} />
               <span className="text-[9px] font-heading uppercase tracking-widest">Ajustes</span>
            </button>
         </div>
      </div>

    </div>
  );
};

export default PartnerApp;