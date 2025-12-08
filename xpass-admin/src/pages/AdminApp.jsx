import React, { useState, useEffect } from 'react';
import { LayoutGrid, Wallet, LifeBuoy, LogOut, ArrowUpRight, ArrowDownRight, Search, ChevronRight, TrendingUp, Filter, Sparkles, Bot, Users, Activity, CreditCard, Globe, Calendar, Command } from 'lucide-react';
import CommandPalette from '../components/CommandPalette';
import ToastContainer from '../components/Toast';

// MOCK DATA
const MOCK_SALES = [
    { id: 1, date: '10/11/23', user: 'Ana Silva', type: 'Credit Pack (20)', method: 'PIX', value: 'R$ 89,90' },
    { id: 2, date: '10/11/23', user: 'Carlos M.', type: 'Subscription', method: 'Credit Card', value: 'R$ 149,90' },
    { id: 3, date: '09/11/23', user: 'Julia K.', type: 'Credit Pack (50)', method: 'Credit Card', value: 'R$ 199,90' },
    { id: 4, date: '09/11/23', user: 'Roberto F.', type: 'Subscription', method: 'PIX', value: 'R$ 149,90' },
    { id: 5, date: '08/11/23', user: 'Marina L.', type: 'Credit Pack (10)', method: 'PIX', value: 'R$ 49,90' },
];

const MOCK_TRANSACTIONS = [
    { id: 'TRX-9921', date: '10/11/23', user: 'User #8821', type: 'Refund Request', value: 'R$ 49,90', status: 'Pending' },
    { id: 'TRX-9920', date: '09/11/23', user: 'User #1204', type: 'Payout (Partner)', value: 'R$ 1.250,00', status: 'Completed' },
    { id: 'TRX-9919', date: '08/11/23', user: 'User #4432', type: 'Chargeback', value: 'R$ 149,90', status: 'Dispute' },
    { id: 'TRX-9918', date: '08/11/23', user: 'User #8811', type: 'Refund Request', value: 'R$ 89,90', status: 'Resolved' },
];

const AreaChart = () => (
    <div className="relative h-64 w-full overflow-hidden">
        <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full">
            <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#FF5200" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#FF5200" stopOpacity="0" />
                </linearGradient>
            </defs>
            {[0, 75, 150, 225].map(y => (
                <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="#333" strokeWidth="1" strokeDasharray="5,5" />
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
        <div className="absolute top-[10%] right-[10%] bg-onyx-800 border border-brand-500/50 px-3 py-1 rounded-lg shadow-lg">
            <span className="text-brand-500 font-bold font-mono text-xs">R$ 142k</span>
        </div>
    </div>
);

const DonutChart = () => (
    <div className="relative w-32 h-32 flex items-center justify-center">
        <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
            <path className="text-zinc-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
            <path className="text-brand-500" strokeDasharray="60, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
            <path className="text-purple-600" strokeDasharray="25, 100" strokeDashoffset="-60" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
        </svg>
        <div className="absolute flex flex-col items-center">
            <span className="text-white font-bold text-xs">Total</span>
            <span className="text-zinc-500 text-[9px]">100%</span>
        </div>
    </div>
);

const AdminApp = ({ onReturnToPortal }) => {
    const [currentTab, setCurrentTab] = useState('overview');
    const [isCmdOpen, setIsCmdOpen] = useState(false);
    const [toasts, setToasts] = useState([]);

    // Toast Helper
    const addToast = (type, title, message) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, type, title, message }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    // Keyboard shortcut for Cmd+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCmdOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // --- SIDEBAR ---
    const Sidebar = () => (
        <aside className="w-64 bg-black border-r border-white/10 flex flex-col h-full fixed left-0 top-0 z-50">
            <div className="p-8 mb-4">
                <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-2xl tracking-tighter text-white">XPASS</span>
                    <span className="px-1.5 py-0.5 bg-zinc-800 rounded text-[9px] font-mono text-zinc-400 uppercase">Admin</span>
                </div>
                <button
                    onClick={() => setIsCmdOpen(true)}
                    className="mt-4 w-full flex items-center justify-between px-3 py-2 bg-onyx-900 border border-white/10 rounded-lg text-xs text-zinc-500 hover:text-white hover:border-brand-500/50 transition-colors"
                >
                    <span className="flex items-center gap-2"><Search size={12} /> Quick Action</span>
                    <span className="font-mono text-[10px] bg-black/50 px-1 rounded border border-white/5">⌘K</span>
                </button>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                {[
                    { id: 'overview', icon: LayoutGrid, label: 'Visão Geral' },
                    { id: 'financial', icon: Wallet, label: 'Financeiro' },
                    { id: 'support', icon: LifeBuoy, label: 'Suporte' }
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${currentTab === item.id ? 'bg-brand-500 text-white shadow-[0_0_15px_rgba(255,82,0,0.3)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <item.icon size={18} strokeWidth={currentTab === item.id ? 2.5 : 2} />
                        <span className="font-heading uppercase tracking-wider text-sm">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-white/5">
                <button onClick={onReturnToPortal} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors group">
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-heading uppercase tracking-wider text-sm">Sair</span>
                </button>
            </div>
        </aside>
    );

    const renderOverview = () => (
        <div className="animate-in fade-in duration-500 space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-heading font-medium text-white uppercase tracking-wide mb-1">Visão Geral</h1>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Monitoramento em Tempo Real</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-onyx-900 rounded border border-white/10">
                    <Calendar size={14} className="text-zinc-400" />
                    <span className="text-xs font-mono text-white">Last 30 Days</span>
                </div>
            </div>

            {/* AI INSIGHT WIDGET */}
            <div className="p-1 bg-gradient-to-r from-brand-500 via-purple-600 to-brand-500 rounded-xl animate-[pulse_4s_infinite]">
                <div className="bg-onyx-950 rounded-lg p-4 flex items-start gap-4">
                    <div className="p-2 bg-brand-500/10 rounded-lg text-brand-500">
                        <Sparkles size={20} className="fill-brand-500" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-heading font-bold text-white uppercase mb-1 flex items-center gap-2">
                            Gemini Insight
                        </h3>
                        <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                            O churn reduziu 2.4% após a implementação do novo feed de Wellness. O horário de pico mudou para 19h nas segundas-feiras. Receita projetada para o próximo mês: <span className="text-green-500 font-bold">R$ 145.200</span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* MAIN CHART & METRICS GRID */}
            <div className="grid grid-cols-12 gap-6">
                {/* Large Revenue Chart */}
                <div className="col-span-8 bg-onyx-900 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xs font-mono text-zinc-500 uppercase">Receita Total (ARR)</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-heading font-bold text-white">R$ 1.2M</span>
                                <span className="flex items-center text-green-500 text-xs font-mono bg-green-500/10 px-1.5 py-0.5 rounded"><TrendingUp size={12} className="mr-1" /> +12%</span>
                            </div>
                        </div>
                        <button className="text-zinc-600 hover:text-white"><Filter size={16} /></button>
                    </div>
                    <AreaChart />
                </div>

                {/* Distribution & Side Stats */}
                <div className="col-span-4 flex flex-col gap-6">

                    {/* User Demographics */}
                    <div className="flex-1 bg-onyx-900 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center relative">
                        <h3 className="absolute top-6 left-6 text-xs font-mono text-zinc-500 uppercase">Plan Distribution</h3>
                        <div className="flex items-center gap-6 mt-4">
                            <DonutChart />
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-brand-500" />
                                    <span className="text-xs text-zinc-300">Gold (60%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-600" />
                                    <span className="text-xs text-zinc-300">Corp (25%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-zinc-700" />
                                    <span className="text-xs text-zinc-300">Basic (15%)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stat */}
                    <div className="h-32 bg-onyx-900 border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:bg-onyx-800 transition-colors">
                        <div className="flex justify-between">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase">Parceiros Ativos</span>
                            <Users size={16} className="text-brand-500" />
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-heading text-white">142</span>
                            <span className="text-xs text-zinc-500 font-mono">3 pendentes</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-brand-500 w-[70%] h-full rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* REGIONAL PERFORMANCE (Bar visual) */}
            <div className="bg-onyx-900 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Globe size={16} className="text-zinc-500" />
                    <h3 className="font-heading text-sm text-white uppercase">Performance por Região</h3>
                </div>
                <div className="grid grid-cols-4 gap-8">
                    {[
                        { region: 'São Paulo', val: 85, grow: '+8%' },
                        { region: 'Rio de Janeiro', val: 60, grow: '+4%' },
                        { region: 'Curitiba', val: 45, grow: '-2%', warn: true },
                        { region: 'Belo Horizonte', val: 30, grow: '+12%' },
                    ].map((item) => (
                        <div key={item.region} className="flex flex-col gap-2">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-white">{item.region}</span>
                                <span className={item.warn ? 'text-red-500' : 'text-green-500'}>{item.grow}</span>
                            </div>
                            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${item.warn ? 'bg-red-500' : 'bg-white'}`}
                                    style={{ width: `${item.val}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderFinancial = () => (
        <div className="animate-in fade-in duration-500 space-y-6">
            <div className="mb-4">
                <h1 className="text-3xl font-heading font-medium text-white uppercase tracking-wide">Financeiro</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Entradas (7d)', val: 'R$ 42.500', icon: ArrowUpRight, color: 'text-green-500' },
                    { label: 'Saídas (7d)', val: 'R$ 12.100', icon: ArrowDownRight, color: 'text-red-500' },
                    { label: 'Lucro Líquido', val: 'R$ 30.400', icon: Wallet, color: 'text-brand-500' },
                ].map((stat, i) => (
                    <div key={i} className="bg-onyx-900 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-mono text-zinc-400 uppercase">{stat.label}</span>
                            <stat.icon size={18} className={stat.color} />
                        </div>
                        <h2 className="text-3xl font-heading text-white">{stat.val}</h2>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Cashflow Bars */}
                <div className="col-span-8 bg-onyx-900 border border-white/5 rounded-2xl p-6">
                    <h3 className="font-heading text-sm text-white uppercase mb-6">Fluxo de Caixa (Mensal)</h3>
                    <div className="h-48 flex items-end justify-between gap-4">
                        {[60, 80, 45, 90, 70, 85].map((h, i) => (
                            <div key={i} className="flex-1 flex gap-1 h-full items-end">
                                {/* Income Bar */}
                                <div className="w-full bg-zinc-800 rounded-t-sm relative group">
                                    <div
                                        className="absolute bottom-0 w-full bg-green-500/80 group-hover:bg-green-500 transition-all rounded-t-sm"
                                        style={{ height: `${h}%` }}
                                    />
                                </div>
                                {/* Expense Bar */}
                                <div className="w-full bg-zinc-800 rounded-t-sm relative group">
                                    <div
                                        className="absolute bottom-0 w-full bg-red-500/80 group-hover:bg-red-500 transition-all rounded-t-sm"
                                        style={{ height: `${h * 0.4}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 px-2">
                        {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'].map(m => (
                            <span key={m} className="text-[10px] font-mono text-zinc-600">{m}</span>
                        ))}
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="col-span-4 bg-onyx-900 border border-white/5 rounded-2xl p-6">
                    <h3 className="font-heading text-sm text-white uppercase mb-6">Métodos de Pagamento</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-xs font-mono mb-2">
                                <span className="flex items-center gap-2 text-white"><CreditCard size={12} /> Cartão de Crédito</span>
                                <span className="text-zinc-400">65%</span>
                            </div>
                            <div className="w-full h-2 bg-zinc-800 rounded-full">
                                <div className="w-[65%] h-full bg-brand-500 rounded-full shadow-[0_0_10px_rgba(255,82,0,0.5)]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-mono mb-2">
                                <span className="flex items-center gap-2 text-white"><Activity size={12} /> PIX</span>
                                <span className="text-zinc-400">30%</span>
                            </div>
                            <div className="w-full h-2 bg-zinc-800 rounded-full">
                                <div className="w-[30%] h-full bg-green-500 rounded-full" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-mono mb-2">
                                <span className="flex items-center gap-2 text-white"><Wallet size={12} /> Boleto</span>
                                <span className="text-zinc-400">5%</span>
                            </div>
                            <div className="w-full h-2 bg-zinc-800 rounded-full">
                                <div className="w-[5%] h-full bg-zinc-600 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-onyx-900 border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-heading uppercase text-sm tracking-wider text-white">Transações Recentes</h3>
                    <button className="text-[10px] font-mono text-brand-500 hover:text-brand-400 uppercase transition-colors">Exportar CSV</button>
                </div>
                <div className="divide-y divide-white/5">
                    {MOCK_SALES.map((sale) => (
                        <div key={sale.id} className="grid grid-cols-5 px-6 py-4 text-xs font-mono hover:bg-white/5 transition-colors items-center">
                            <div className="text-zinc-400">{sale.date}</div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-white font-bold">{sale.user.charAt(0)}</div>
                                <span className="text-white font-bold">{sale.user}</span>
                            </div>
                            <div className="text-zinc-300">{sale.type}</div>
                            <div className="text-zinc-500">{sale.method}</div>
                            <div className="text-right text-brand-500 font-bold bg-brand-500/5 py-1 px-2 rounded w-fit ml-auto">{sale.value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderSupport = () => (
        <div className="animate-in fade-in duration-500 space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-heading font-medium text-white uppercase tracking-wide mb-1">Suporte Financeiro</h1>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Gestão de estornos e disputas</p>
                </div>
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                        type="text"
                        placeholder="Buscar ID ou User..."
                        className="bg-onyx-900 border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs font-mono text-white placeholder:text-zinc-700 focus:outline-none focus:border-brand-500 transition-colors w-64"
                    />
                </div>
            </div>

            <div className="bg-onyx-900 border border-white/5 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-6 px-6 py-3 bg-black/20 border-b border-white/5 text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                    <div>Data</div>
                    <div className="col-span-2">Usuário / ID</div>
                    <div>Tipo</div>
                    <div>Valor</div>
                    <div>Status</div>
                </div>
                <div className="divide-y divide-white/5">
                    {MOCK_TRANSACTIONS.map((trx) => (
                        <div key={trx.id} className="grid grid-cols-6 px-6 py-4 text-xs font-mono hover:bg-white/5 transition-colors items-center">
                            <div className="text-zinc-400">{trx.date}</div>
                            <div className="col-span-2">
                                <div className="text-white font-bold">{trx.user}</div>
                                <div className="text-[10px] text-zinc-600">{trx.id}</div>
                            </div>
                            <div className="text-zinc-300">{trx.type}</div>
                            <div className="text-white">{trx.value}</div>
                            <div>
                                <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider border ${trx.status === 'Completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                        trx.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                            trx.status === 'Dispute' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                'bg-blue-500/10 text-blue-500 border-blue-500/20'
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
        <div className="min-h-screen bg-black text-white font-sans flex selection:bg-brand-500 selection:text-white relative">
            <Sidebar />
            <main className="flex-1 ml-64 p-10 bg-black min-h-screen overflow-y-auto">
                {currentTab === 'overview' && renderOverview()}
                {currentTab === 'financial' && renderFinancial()}
                {currentTab === 'support' && renderSupport()}
            </main>

            {/* GLOBAL UTILS */}
            <CommandPalette
                isOpen={isCmdOpen}
                onClose={() => setIsCmdOpen(false)}
                onNavigate={(tab) => setCurrentTab(tab)}
                onLogout={onReturnToPortal}
            />
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
};

export default AdminApp;
