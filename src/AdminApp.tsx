import React, { useState, useEffect } from 'react';
import { LayoutGrid, Wallet, LifeBuoy, LogOut, ArrowUpRight, ArrowDownRight, Search, ChevronRight, TrendingUp, Filter, Sparkles, Bot, Users, Activity, CreditCard, Globe, Calendar, Command, ShieldCheck, CheckCircle2 } from 'lucide-react';
import CommandPalette from './components/CommandPalette';
import ToastContainer, { ToastMessage } from './components/Toast';

interface AdminAppProps {
  onReturnToPortal: () => void;
}

type AdminTab = 'overview' | 'financial' | 'support';

const MOCK_SALES = [
  { id: 1, date: '10/11/2025', user: 'Ana Silva', type: 'Pacote de Créditos (20)', method: 'PIX', value: 'R$ 89,90' },
  { id: 2, date: '10/11/2025', user: 'Carlos M.', type: 'Assinatura Mensal', method: 'Cartão de Crédito', value: 'R$ 149,90' },
  { id: 3, date: '09/11/2025', user: 'Julia K.', type: 'Pacote de Créditos (50)', method: 'Cartão de Crédito', value: 'R$ 199,90' },
  { id: 4, date: '09/11/2025', user: 'Roberto F.', type: 'Assinatura Mensal', method: 'PIX', value: 'R$ 149,90' },
  { id: 5, date: '08/11/2025', user: 'Marina L.', type: 'Pacote de Créditos (10)', method: 'PIX', value: 'R$ 49,90' },
];

const MOCK_TRANSACTIONS = [
  { id: 'TRX-9921', date: '10/11/2025', user: 'Aluno #8821', type: 'Solicitação de Estorno', value: 'R$ 49,90', status: 'Pendente' },
  { id: 'TRX-9920', date: '09/11/2025', user: 'Iron Forge Gym', type: 'Repasse Quinquenal', value: 'R$ 2.450,00', status: 'Concluído' },
  { id: 'TRX-9919', date: '08/11/2025', user: 'Aluno #4432', type: 'Chargeback Cartão', value: 'R$ 149,90', status: 'Disputa' },
  { id: 'TRX-9918', date: '08/11/2025', user: 'Aluno #8811', type: 'Crédito Expirado (Rollover)', value: 'R$ 89,90', status: 'Resolvido' },
];

const AreaChart = () => (
  <div className="relative h-56 w-full overflow-hidden">
    <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full">
      <defs>
        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FF5200" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF5200" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 75, 150, 225].map(y => (
        <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="#222" strokeWidth="1" strokeDasharray="5,5" />
      ))}
      <path 
        d="M0,250 C100,240 200,180 300,200 C400,220 500,100 600,120 C700,140 800,50 900,80 L1000,40 L1000,300 L0,300 Z" 
        fill="url(#chartGradient)" 
      />
      <path 
        d="M0,250 C100,240 200,180 300,200 C400,220 500,100 600,120 C700,140 800,50 900,80 L1000,40" 
        fill="none" 
        stroke="#FF5200" 
        strokeWidth="3" 
        strokeLinecap="round"
      />
    </svg>
    <div className="absolute top-[10%] right-[8%] bg-onyx-800 border border-brand-500/50 px-3 py-1 rounded-lg shadow-lg">
       <span className="text-brand-500 font-bold font-mono text-xs">R$ 142k</span>
    </div>
  </div>
);

const AdminApp: React.FC<AdminAppProps> = ({ onReturnToPortal }) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Receita Bruta (GMV)', val: 'R$ 142.500', change: '+18.2%', isPositive: true },
          { label: 'Alunos Ativos', val: '12.450', change: '+8.4%', isPositive: true },
          { label: 'Estúdios Conectados', val: '428', change: '+12 unidades', isPositive: true },
          { label: 'Margem da Plataforma', val: '22,4%', change: 'Normal', isPositive: true },
        ].map((item, i) => (
          <div key={i} className="bg-onyx-900 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
             <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">{item.label}</span>
             <h3 className="text-3xl font-heading font-bold text-white mt-1 uppercase">{item.val}</h3>
             <span className="inline-block text-xs font-mono text-green-400 mt-2 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                {item.change}
             </span>
          </div>
        ))}
      </div>

      {/* Main Chart Section */}
      <div className="bg-onyx-900 border border-white/10 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
           <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Volume Transacionado</span>
              <h3 className="font-heading font-bold text-xl uppercase text-white">Evolução Mensal de Reservas e Receita</h3>
           </div>
           <div className="flex gap-2">
              <span className="px-3 py-1 bg-brand-500/10 border border-brand-500/30 text-brand-500 text-xs font-mono rounded-lg">2025</span>
           </div>
        </div>
        <AreaChart />
      </div>

      {/* Grid with Live Activity & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         {/* Live Activity Feed */}
         <div className="bg-onyx-900 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="font-heading font-bold uppercase text-white text-base">Atividades Recentes do Sistema</h3>
            <div className="space-y-3">
               {[
                 { title: 'Check-in Realizado', sub: 'Iron Forge Gym • Aluno #8821', time: 'Há 2 min' },
                 { title: 'Nova Academia Aprovada', sub: 'Quantum Pilates (Jardins)', time: 'Há 14 min' },
                 { title: 'Recarga de 50 Créditos', sub: 'Beatriz L. via PIX', time: 'Há 28 min' },
                 { title: 'Rollover Processado', sub: '1.420 créditos acumulados para próximo ciclo', time: 'Há 1 hora' },
               ].map((act, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                     <div>
                        <h5 className="font-heading font-bold text-sm text-white uppercase">{act.title}</h5>
                        <p className="text-xs font-mono text-zinc-400">{act.sub}</p>
                     </div>
                     <span className="text-[10px] font-mono text-zinc-500">{act.time}</span>
                  </div>
               ))}
            </div>
         </div>

         {/* System Infrastructure Health */}
         <div className="bg-onyx-900 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="font-heading font-bold uppercase text-white text-base">Status da Infraestrutura (Vercel)</h3>
            <div className="space-y-3">
               {[
                 { name: 'Vercel Edge Network', status: 'Operacional (100%)', ping: '18ms' },
                 { name: 'Serverless Functions (/api)', status: 'Ativo & Saudável', ping: '42ms' },
                 { name: 'Google Gemini AI Integration', status: 'Conectado', ping: '310ms' },
                 { name: 'Motor de Yield & Dynamic Pricing', status: 'Ativo', ping: '5ms' },
               ].map((serv, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-onyx-950 rounded-xl border border-white/5">
                     <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <div>
                           <span className="text-xs font-mono text-white font-bold block">{serv.name}</span>
                           <span className="text-[10px] font-mono text-green-400">{serv.status}</span>
                        </div>
                     </div>
                     <span className="text-[10px] font-mono text-zinc-500">{serv.ping}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );

  const renderFinancial = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
         <h2 className="font-heading font-bold text-3xl uppercase text-white">Relatório Financeiro</h2>
         <p className="text-xs font-mono text-zinc-500">Fluxo de caixa da plataforma, repasses aos estúdios e split de pagamentos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
         <div className="bg-onyx-900 border border-white/10 rounded-2xl p-5">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Total Recebido (Mês)</span>
            <h3 className="text-2xl font-mono font-bold text-green-400 mt-1">R$ 142.500,00</h3>
         </div>
         <div className="bg-onyx-900 border border-white/10 rounded-2xl p-5">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Repasses Parceiros</span>
            <h3 className="text-2xl font-mono font-bold text-white mt-1">R$ 110.580,00</h3>
         </div>
         <div className="bg-onyx-900 border border-white/10 rounded-2xl p-5">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Receita Líquida XPASS</span>
            <h3 className="text-2xl font-mono font-bold text-brand-500 mt-1">R$ 31.920,00</h3>
         </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-onyx-900 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
           <h3 className="font-heading uppercase text-sm font-bold text-white">Vendas & Assinaturas Recentes</h3>
           <button 
             onClick={() => addToast('success', 'Download CSV', 'Relatório financeiro exportado.')}
             className="text-xs font-mono text-brand-500 hover:underline uppercase cursor-pointer"
           >
              Exportar CSV
           </button>
        </div>
        <div className="divide-y divide-white/5">
           {MOCK_SALES.map((sale) => (
             <div key={sale.id} className="grid grid-cols-1 sm:grid-cols-5 px-6 py-3.5 text-xs font-mono items-center gap-2 hover:bg-white/5 transition-colors">
                <div className="text-zinc-500">{sale.date}</div>
                <div className="text-white font-bold">{sale.user}</div>
                <div className="text-zinc-300">{sale.type}</div>
                <div className="text-zinc-400">{sale.method}</div>
                <div className="sm:text-right text-brand-500 font-bold">{sale.value}</div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
         <h2 className="font-heading font-bold text-3xl uppercase text-white">Suporte & Moderação</h2>
         <p className="text-xs font-mono text-zinc-500">Gestão de contestações, dúvidas de alunos e aprovações de estúdios</p>
      </div>

      <div className="bg-onyx-900 border border-white/10 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-6 px-6 py-3 bg-black/40 border-b border-white/10 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
           <div>Data</div>
           <div className="col-span-2">Usuário / ID</div>
           <div>Tipo</div>
           <div>Valor</div>
           <div>Status</div>
        </div>
        <div className="divide-y divide-white/5">
           {MOCK_TRANSACTIONS.map((trx) => (
             <div key={trx.id} className="grid grid-cols-1 sm:grid-cols-6 px-6 py-4 text-xs font-mono items-center gap-2 hover:bg-white/5 transition-colors">
                <div className="text-zinc-500">{trx.date}</div>
                <div className="col-span-2">
                   <div className="text-white font-bold">{trx.user}</div>
                   <div className="text-[10px] text-zinc-500">{trx.id}</div>
                </div>
                <div className="text-zinc-300">{trx.type}</div>
                <div className="text-white">{trx.value}</div>
                <div>
                   <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                      trx.status === 'Concluído' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                      trx.status === 'Pendente' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                      trx.status === 'Disputa' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                      'bg-blue-500/10 text-blue-400 border-blue-500/30'
                   }`}>
                      {trx.status}
                   </span>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col md:flex-row selection:bg-brand-500 selection:text-white">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside className="w-full md:w-64 bg-onyx-950 border-r border-white/10 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                 <ShieldCheck size={22} />
              </div>
              <div>
                 <h2 className="font-heading font-bold text-xl uppercase tracking-wider text-white">XPASS OS</h2>
                 <span className="text-[10px] font-mono text-zinc-500">ADMIN CONSOLE</span>
              </div>
           </div>

           {/* Command Palette Trigger */}
           <button 
             onClick={() => setIsCmdOpen(true)}
             className="w-full py-2.5 px-3 rounded-xl bg-onyx-900 border border-white/10 hover:border-brand-500/50 flex items-center justify-between text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
           >
              <span className="flex items-center gap-2">
                 <Search size={14} /> Buscar comando...
              </span>
              <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-zinc-300">Ctrl K</span>
           </button>

           {/* Nav items */}
           <nav className="space-y-1">
              {[
                { id: 'overview', label: 'Visão Geral', icon: LayoutGrid },
                { id: 'financial', label: 'Financeiro', icon: Wallet },
                { id: 'support', label: 'Suporte & Disputas', icon: LifeBuoy },
              ].map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id as AdminTab)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-heading uppercase tracking-wide transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-brand-500 text-black font-bold shadow-[0_0_20px_rgba(255,82,0,0.3)]' 
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                     <Icon size={16} />
                     <span>{item.label}</span>
                  </button>
                );
              })}
           </nav>
        </div>

        <div className="pt-6 border-t border-white/10">
           <button 
             onClick={onReturnToPortal}
             className="w-full py-2.5 px-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-heading font-bold uppercase text-zinc-300 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
           >
              <LogOut size={16} /> Voltar ao Portal
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT VIEW */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
         {currentTab === 'overview' && renderOverview()}
         {currentTab === 'financial' && renderFinancial()}
         {currentTab === 'support' && renderSupport()}
      </main>

      {/* COMMAND PALETTE MODAL */}
      <CommandPalette 
        isOpen={isCmdOpen} 
        onClose={() => setIsCmdOpen(false)} 
        onNavigate={(tab) => setCurrentTab(tab as AdminTab)}
        onLogout={onReturnToPortal}
      />
    </div>
  );
};

export default AdminApp;
