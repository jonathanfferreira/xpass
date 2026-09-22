import React, { useState, useEffect } from 'react';
import { ScanLine, Calendar, PieChart, Settings, Plus, Wallet, Camera, ChevronRight, LogOut, Activity, BarChart3, X, Check, Clock, Users, MapPin, Sparkles, Wand2, Shield, Lock, UserCog, User } from 'lucide-react';
import { getStoredPartnerMetrics, savePartnerMetrics } from './services/storage';

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
  const [userRole, setUserRole] = useState<UserRole>('owner');

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  
  // Scanner Logic State
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [scannedUser, setScannedUser] = useState<string | null>(null);
  
  // Dashboard Data State from storage
  const metrics = getStoredPartnerMetrics();
  const [dailyRevenue, setDailyRevenue] = useState(metrics.revenue);
  const [checkInCount, setCheckInCount] = useState(metrics.checkIns);

  // Classes
  const [classes, setClasses] = useState<ClassItem[]>([
    { id: '1', title: 'CrossFit WOD', description: 'Treino de alta intensidade focado em força e condicionamento metabólico.', time: '07:00', duration: '60min', instructor: 'Coach Mike', spots: 20, booked: 14 },
    { id: '2', title: 'HIIT Circuit', description: 'Circuito funcional para queima calórica acelerada e agilidade.', time: '18:30', duration: '45min', instructor: 'Sarah J.', spots: 15, booked: 15 },
    { id: '3', title: 'Musculação Livre', description: 'Acesso completo à sala de musculação e pesos livres.', time: '06:00 - 22:00', duration: 'Livre', instructor: 'Plantonistas', spots: 50, booked: 28 },
  ]);

  // New Class Form State
  const [newClass, setNewClass] = useState({ title: '', description: '', time: '', instructor: '' });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Settings State
  const [directCheckIn, setDirectCheckIn] = useState(true);
  const [studioName, setStudioName] = useState('Iron Forge Gym');

  useEffect(() => {
    savePartnerMetrics(dailyRevenue, checkInCount);
  }, [dailyRevenue, checkInCount]);

  useEffect(() => {
    if (userRole === 'staff' && currentTab === 'financial') {
      setCurrentTab('validate');
    }
  }, [userRole, currentTab]);

  // Simulate Scanning Process
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isCameraOpen && scanStatus === 'idle') {
      setScanStatus('scanning');
      timer = setTimeout(() => {
        setScanStatus('processing');
        setTimeout(() => {
           const isSuccess = Math.random() > 0.15; // 85% success rate
           if (isSuccess) {
              setScanStatus('success');
              const names = ['Jonathan F.', 'Beatriz L.', 'Lucas M.', 'Camila S.'];
              setScannedUser(names[Math.floor(Math.random() * names.length)]);
              setDailyRevenue(prev => prev + 15);
              setCheckInCount(prev => prev + 1);
           } else {
              setScanStatus('error');
           }
        }, 1200);
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [isCameraOpen, scanStatus]);

  const resetScanner = () => {
    setScanStatus('idle');
    setIsCameraOpen(false);
    setScannedUser(null);
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.title || !newClass.time) return;

    const created: ClassItem = {
      id: Date.now().toString(),
      title: newClass.title,
      description: newClass.description || 'Aula guiada por profissionais credenciados.',
      time: newClass.time,
      duration: '60min',
      instructor: newClass.instructor || 'Coach XPASS',
      spots: 15,
      booked: 0
    };

    setClasses([...classes, created]);
    setIsClassModalOpen(false);
    setNewClass({ title: '', description: '', time: '', instructor: '' });
  };

  const generateAIContent = () => {
     if (!newClass.title) return;
     setIsGeneratingAI(true);
     
     setTimeout(() => {
        const keywords = newClass.title.toLowerCase();
        let aiTitle = newClass.title;
        let aiDesc = "Venha treinar conosco e elevar sua performance!";

        if (keywords.includes('yoga')) {
           aiTitle = "Sunrise Yoga Flow";
           aiDesc = "Comece o dia com energia e equilíbrio. Uma prática fluida focada em respiração, flexibilidade e conexão mente-corpo.";
        } else if (keywords.includes('boxe') || keywords.includes('luta') || keywords.includes('mma')) {
           aiTitle = "Striking Conditioning Pro";
           aiDesc = "Aumente sua resistência e potência com combinações técnicas combinadas com rounds funcionais de alta intensidade.";
        } else if (keywords.includes('pilates')) {
           aiTitle = "Core & Precision Pilates";
           aiDesc = "Fortaleça seu core profundo, alinhe a postura e melhore a mobilidade com movimentos controlados.";
        } else {
           aiTitle = `Power ${newClass.title}`;
           aiDesc = "Uma experiência de treino dinâmica projetada para desafiar seus limites e acelerar seus resultados.";
        }

        setNewClass(prev => ({ ...prev, title: aiTitle, description: aiDesc }));
        setIsGeneratingAI(false);
     }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-brand-500 selection:text-white font-sans flex flex-col justify-between max-w-lg mx-auto border-x border-white/5">
      
      {/* HEADER */}
      <header className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-onyx-900/50 backdrop-blur sticky top-0 z-30">
        <div>
           <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Portal Parceiro</span>
           <h1 className="font-heading font-bold text-xl uppercase text-white tracking-wide">{studioName}</h1>
        </div>

        <div className="flex items-center gap-2">
           {/* Role Switcher */}
           <button 
             onClick={() => setUserRole(userRole === 'owner' ? 'staff' : 'owner')}
             className="px-2.5 py-1 rounded-lg bg-onyx-800 border border-white/10 text-xs font-mono flex items-center gap-1.5 hover:border-brand-500 transition-colors cursor-pointer"
             title="Alternar entre modo Dono e Funcionário"
           >
              {userRole === 'owner' ? (
                <>
                  <Shield size={12} className="text-brand-500" />
                  <span className="text-white">Dono</span>
                </>
              ) : (
                <>
                  <User size={12} className="text-blue-400" />
                  <span className="text-zinc-300">Staff</span>
                </>
              )}
           </button>

           <button 
             onClick={onReturnToPortal}
             className="p-2 bg-onyx-800 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
             title="Voltar ao Portal"
           >
              <LogOut size={16} />
           </button>
        </div>
      </header>

      {/* BODY CONTENT ACCORDING TO TAB */}
      <main className="flex-1 pb-28">
        
        {/* TAB 1: VALIDATE (Scanner) */}
        {currentTab === 'validate' && (
          <div className="flex flex-col h-full animate-in fade-in duration-300 p-6 space-y-6">
            
            {/* Revenue / Check-in Card */}
            {userRole === 'owner' ? (
              <div className="p-6 rounded-2xl bg-onyx-900 border border-white/10 flex justify-between items-start relative overflow-hidden group">
                <div className="relative z-10">
                   <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Receita Gerada Hoje</p>
                   <h2 className="text-4xl font-heading font-bold text-white tracking-tight">R$ {dailyRevenue},00</h2>
                   <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-mono text-green-400 uppercase">{checkInCount} Check-ins Validados</span>
                   </div>
                </div>
                <div className="relative z-10 p-3 bg-white/5 rounded-xl text-brand-500">
                   <Wallet size={24} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-transparent pointer-events-none" />
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-onyx-900 border border-white/10 flex items-center justify-between">
                 <div>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Turno Ativo</p>
                    <h2 className="text-2xl font-heading font-bold text-white uppercase">Recepção Geral</h2>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-mono text-green-400">{checkInCount} Check-ins</span>
                 </div>
              </div>
            )}

            {/* SCANNER VIEWPORT */}
            <div className="flex flex-col items-center justify-center text-center py-6">
              {isCameraOpen ? (
                <div className="relative w-full aspect-[4/3] bg-zinc-900 rounded-3xl overflow-hidden border border-brand-500 shadow-[0_0_40px_rgba(255,82,0,0.2)] flex flex-col items-center justify-center">
                   {scanStatus !== 'success' && scanStatus !== 'error' && (
                     <>
                       <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                          <Camera size={48} className="text-zinc-700 animate-pulse" />
                       </div>
                       
                       {/* Scanner laser overlay */}
                       <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                          <div className="flex justify-between">
                             <div className="w-8 h-8 border-t-2 border-l-2 border-brand-500 rounded-tl-lg" />
                             <div className="w-8 h-8 border-t-2 border-r-2 border-brand-500 rounded-tr-lg" />
                          </div>
                          
                          {scanStatus === 'processing' ? (
                            <div className="flex flex-col items-center">
                               <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mb-3" />
                               <span className="bg-black/80 text-white text-[10px] font-mono px-3 py-1 rounded">Processando passe...</span>
                            </div>
                          ) : (
                            <div className="w-full h-0.5 bg-brand-500 shadow-[0_0_15px_#FF5200] animate-pulse" />
                          )}

                          <div className="flex justify-between">
                             <div className="w-8 h-8 border-b-2 border-l-2 border-brand-500 rounded-bl-lg" />
                             <div className="w-8 h-8 border-b-2 border-r-2 border-brand-500 rounded-br-lg" />
                          </div>
                       </div>
                     </>
                   )}

                   {/* SUCCESS */}
                   {scanStatus === 'success' && (
                     <div className="absolute inset-0 bg-green-500 flex flex-col items-center justify-center p-6 animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
                           <Check size={36} className="text-green-600" strokeWidth={3} />
                        </div>
                        <h2 className="font-heading text-2xl font-bold text-white uppercase">Check-in Aprovado!</h2>
                        <p className="font-mono text-white text-sm mb-4">{scannedUser}</p>
                        <span className="text-xs font-mono bg-black/20 text-white px-3 py-1 rounded-full mb-4">+R$ 15,00 creditados</span>
                        <button 
                           onClick={resetScanner}
                           className="bg-white text-green-600 font-heading font-bold uppercase px-6 py-2.5 rounded-xl shadow-lg cursor-pointer"
                        >
                           Próximo Aluno
                        </button>
                     </div>
                   )}

                   {/* ERROR */}
                   {scanStatus === 'error' && (
                     <div className="absolute inset-0 bg-red-600 flex flex-col items-center justify-center p-6 animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
                           <X size={36} className="text-red-600" strokeWidth={3} />
                        </div>
                        <h2 className="font-heading text-2xl font-bold text-white uppercase">Código Inválido</h2>
                        <p className="font-mono text-white/80 text-xs mb-4">Crédito expirado ou cancelado.</p>
                        <button 
                           onClick={resetScanner}
                           className="bg-white text-red-600 font-heading font-bold uppercase px-6 py-2.5 rounded-xl shadow-lg cursor-pointer"
                        >
                           Tentar Novamente
                        </button>
                     </div>
                   )}
                </div>
              ) : (
                <div 
                  onClick={() => { setIsCameraOpen(true); setScanStatus('idle'); }}
                  className="w-full p-8 rounded-3xl bg-onyx-900 border border-white/10 hover:border-brand-500/50 flex flex-col items-center justify-center transition-all cursor-pointer group shadow-xl"
                >
                  <div className="w-20 h-20 bg-onyx-800 group-hover:bg-brand-500 text-zinc-400 group-hover:text-black rounded-2xl flex items-center justify-center transition-colors mb-4 shadow-lg">
                     <ScanLine size={36} />
                  </div>
                  <h3 className="font-heading font-bold text-xl uppercase text-white group-hover:text-brand-500 transition-colors">
                     Escanear QR Code do Aluno
                  </h3>
                  <p className="text-xs font-mono text-zinc-500 mt-1 max-w-xs text-center">
                     Toque para abrir a câmera do tablet ou smartphone da recepção e validar o check-in.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CLASSES */}
        {currentTab === 'classes' && (
          <div className="p-6 space-y-6 animate-in fade-in duration-300">
             <div className="flex justify-between items-center">
                <div>
                   <h2 className="font-heading font-bold text-2xl uppercase text-white">Grade de Aulas</h2>
                   <p className="text-xs font-mono text-zinc-500">Gerencie horários e capacidade de vagas</p>
                </div>
                <button 
                   onClick={() => setIsClassModalOpen(true)}
                   className="flex items-center gap-1.5 px-3 py-2 bg-brand-500 text-black font-heading font-bold text-xs uppercase rounded-xl hover:bg-brand-400 transition-all cursor-pointer shadow-md shadow-brand-500/20"
                >
                   <Plus size={16} /> Nova Aula
                </button>
             </div>

             <div className="space-y-3">
                {classes.map(c => (
                   <div key={c.id} className="p-4 bg-onyx-900 border border-white/10 rounded-2xl space-y-2">
                      <div className="flex justify-between items-start">
                         <div>
                            <h4 className="font-heading font-bold text-lg text-white uppercase">{c.title}</h4>
                            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 mt-0.5">
                               <Clock size={12} className="text-brand-500" /> {c.time} ({c.duration}) • {c.instructor}
                            </span>
                         </div>
                         <div className="text-right">
                            <span className="font-mono text-sm font-bold text-brand-500">{c.booked} / {c.spots}</span>
                            <span className="block text-[9px] font-mono text-zinc-500 uppercase">Ocupação</span>
                         </div>
                      </div>
                      {c.description && <p className="text-xs text-zinc-400 leading-relaxed pt-1">{c.description}</p>}
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* TAB 3: FINANCIAL */}
        {currentTab === 'financial' && userRole === 'owner' && (
          <div className="p-6 space-y-6 animate-in fade-in duration-300">
             <div>
                <h2 className="font-heading font-bold text-2xl uppercase text-white">Extrato & Repasses</h2>
                <p className="text-xs font-mono text-zinc-500">Transparência financeira e previsão de PIX</p>
             </div>

             <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-onyx-900 border border-white/10 rounded-xl">
                   <span className="text-[10px] font-mono text-zinc-500 uppercase block">Saldo Disponível</span>
                   <span className="text-2xl font-mono font-bold text-green-400 mt-1 block">R$ 1.845,00</span>
                   <span className="text-[10px] font-mono text-zinc-500">Próximo repasse: Sexta-feira</span>
                </div>
                <div className="p-4 bg-onyx-900 border border-white/10 rounded-xl">
                   <span className="text-[10px] font-mono text-zinc-500 uppercase block">Média por Check-in</span>
                   <span className="text-2xl font-mono font-bold text-white mt-1 block">R$ 15,20</span>
                   <span className="text-[10px] font-mono text-brand-500">Yield dinâmico ativo</span>
                </div>
             </div>

             <div className="p-4 bg-onyx-900 border border-white/10 rounded-xl space-y-3">
                <h3 className="font-heading font-bold text-sm uppercase text-white">Últimos Repasses Realizados</h3>
                {[
                  { date: '15/11/2025', value: 'R$ 2.450,00', status: 'Liquidado via PIX' },
                  { date: '01/11/2025', value: 'R$ 2.120,00', status: 'Liquidado via PIX' },
                  { date: '15/10/2025', value: 'R$ 1.980,00', status: 'Liquidado via PIX' },
                ].map((rep, idx) => (
                   <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <div>
                         <span className="text-xs font-mono text-white block">{rep.date}</span>
                         <span className="text-[10px] font-mono text-green-400">{rep.status}</span>
                      </div>
                      <span className="font-mono text-sm font-bold text-white">{rep.value}</span>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {currentTab === 'settings' && (
          <div className="p-6 space-y-6 animate-in fade-in duration-300">
             <div>
                <h2 className="font-heading font-bold text-2xl uppercase text-white">Configurações do Estúdio</h2>
                <p className="text-xs font-mono text-zinc-500">Regras de agendamento e perfil público</p>
             </div>

             <div className="space-y-4">
                <div className="p-4 bg-onyx-900 border border-white/10 rounded-xl space-y-2">
                   <label className="text-xs font-mono text-zinc-400 uppercase block">Nome Fantasia do Estúdio</label>
                   <input 
                     type="text" 
                     value={studioName}
                     onChange={(e) => setStudioName(e.target.value)}
                     className="w-full bg-onyx-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-brand-500 focus:outline-none"
                   />
                </div>

                <div className="p-4 bg-onyx-900 border border-white/10 rounded-xl flex items-center justify-between">
                   <div>
                      <h4 className="font-heading font-bold text-sm uppercase text-white">Check-in Direto ("Só Vai")</h4>
                      <p className="text-[11px] font-mono text-zinc-500 max-w-xs">Permite que alunos cheguem sem agendamento prévio caso haja vagas livres.</p>
                   </div>
                   <button 
                     onClick={() => setDirectCheckIn(!directCheckIn)}
                     className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${directCheckIn ? 'bg-brand-500' : 'bg-zinc-700'}`}
                   >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${directCheckIn ? 'right-1' : 'left-1'}`} />
                   </button>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* FOOTER NAVIGATION */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-onyx-900/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 z-30">
        <div className="flex justify-around items-center">
           <button 
             onClick={() => setCurrentTab('validate')}
             className={`flex flex-col items-center gap-1 cursor-pointer ${currentTab === 'validate' ? 'text-brand-500' : 'text-zinc-500 hover:text-zinc-300'}`}
           >
              <ScanLine size={20} />
              <span className="text-[9px] font-mono uppercase tracking-wider">Validar</span>
           </button>

           <button 
             onClick={() => setCurrentTab('classes')}
             className={`flex flex-col items-center gap-1 cursor-pointer ${currentTab === 'classes' ? 'text-brand-500' : 'text-zinc-500 hover:text-zinc-300'}`}
           >
              <Calendar size={20} />
              <span className="text-[9px] font-mono uppercase tracking-wider">Aulas</span>
           </button>

           {userRole === 'owner' && (
             <button 
               onClick={() => setCurrentTab('financial')}
               className={`flex flex-col items-center gap-1 cursor-pointer ${currentTab === 'financial' ? 'text-brand-500' : 'text-zinc-500 hover:text-zinc-300'}`}
             >
                <PieChart size={20} />
                <span className="text-[9px] font-mono uppercase tracking-wider">Financeiro</span>
             </button>
           )}

           <button 
             onClick={() => setCurrentTab('settings')}
             className={`flex flex-col items-center gap-1 cursor-pointer ${currentTab === 'settings' ? 'text-brand-500' : 'text-zinc-500 hover:text-zinc-300'}`}
           >
              <Settings size={20} />
              <span className="text-[9px] font-mono uppercase tracking-wider">Ajustes</span>
           </button>
        </div>
      </footer>

      {/* MODAL: NOVA AULA */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="w-full max-w-md bg-onyx-900 border border-white/10 rounded-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                 <h3 className="font-heading font-bold text-lg text-white uppercase">Cadastrar Nova Aula</h3>
                 <button onClick={() => setIsClassModalOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                    <X size={18} />
                 </button>
              </div>

              <form onSubmit={handleCreateClass} className="space-y-4">
                 <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Título da Aula</label>
                    <div className="flex gap-2">
                       <input 
                         type="text" 
                         value={newClass.title}
                         onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
                         placeholder="Ex: Boxe Funcional"
                         required
                         className="flex-1 bg-onyx-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-brand-500 focus:outline-none"
                       />
                       <button 
                         type="button"
                         onClick={generateAIContent}
                         disabled={!newClass.title || isGeneratingAI}
                         className="px-3 py-2 bg-white/10 hover:bg-brand-500 hover:text-black rounded-xl text-xs font-mono flex items-center gap-1 transition-colors disabled:opacity-30 cursor-pointer"
                         title="Gerar descrição e título com IA"
                       >
                          <Sparkles size={14} /> {isGeneratingAI ? '...' : 'IA'}
                       </button>
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Horário & Frequência</label>
                    <input 
                      type="text" 
                      value={newClass.time}
                      onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                      placeholder="Ex: Ter e Qui às 19:00"
                      required
                      className="w-full bg-onyx-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-brand-500 focus:outline-none"
                    />
                 </div>

                 <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Professor / Instrutor</label>
                    <input 
                      type="text" 
                      value={newClass.instructor}
                      onChange={(e) => setNewClass({ ...newClass, instructor: e.target.value })}
                      placeholder="Ex: Coach Rafael"
                      className="w-full bg-onyx-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-brand-500 focus:outline-none"
                    />
                 </div>

                 <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Descrição</label>
                    <textarea 
                      value={newClass.description}
                      onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                      rows={3}
                      placeholder="Detalhes sobre intensidade, público ou materiais necessários..."
                      className="w-full bg-onyx-950 border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:border-brand-500 focus:outline-none resize-none"
                    />
                 </div>

                 <div className="pt-2 flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => setIsClassModalOpen(false)}
                      className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 font-heading uppercase text-xs cursor-pointer"
                    >
                       Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3 bg-brand-500 hover:bg-brand-400 text-black font-heading font-bold uppercase text-xs rounded-xl shadow-lg cursor-pointer"
                    >
                       Publicar Aula
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default PartnerApp;
