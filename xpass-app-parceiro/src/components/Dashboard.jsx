import React, { useState } from 'react';
import { LayoutGrid, Calendar, Users, Wallet, Settings, LogOut } from 'lucide-react';
import ClassManager from './ClassManager';

export default function Dashboard({ user, onLogout }) {
    const [currentTab, setCurrentTab] = useState('overview');

    const renderContent = () => {
        switch (currentTab) {
            case 'classes': return <ClassManager />;
            case 'overview':
            default:
                return (
                    // Default Overview Content
                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl h-96 flex items-center justify-center text-zinc-600 font-mono text-sm uppercase">
                        Visão Geral em desenvolvimento...
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* SIDEBAR */}
            <aside className="w-64 border-r border-white/10 flex flex-col fixed h-full bg-black z-50">
                <div className="p-8">
                    <span className="text-2xl font-bold font-heading tracking-tighter text-brand-500">XPASS</span>
                    <span className="ml-2 text-[10px] font-mono uppercase bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">Partner</span>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <NavItem
                        icon={LayoutGrid}
                        label="Visão Geral"
                        active={currentTab === 'overview'}
                        onClick={() => setCurrentTab('overview')}
                    />
                    <NavItem
                        icon={Calendar}
                        label="Aulas"
                        active={currentTab === 'classes'}
                        onClick={() => setCurrentTab('classes')}
                    />
                    <NavItem icon={Users} label="Alunos" />
                    <NavItem icon={Wallet} label="Financeiro" />
                    <NavItem icon={Settings} label="Configurações" />
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors group">
                        <LogOut size={18} />
                        <span className="font-heading uppercase text-xs tracking-wider">Sair</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="ml-64 flex-1 p-8">
                <header className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-heading uppercase font-medium">Bem-vindo, {user.displayName || 'Parceiro'}</h1>
                        <p className="text-xs font-mono text-zinc-500 uppercase mt-1">Status: <span className="text-green-500">Ativo</span> • ID: {user.uid}</p>
                    </div>
                </header>

                {/* METRICS ROW (Only on Overview) */}
                {currentTab === 'overview' && (
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <MetricCard label="Check-ins Hoje" value="12" change="+20%" />
                        <MetricCard label="Receita Mensal" value="R$ 4.250" change="+15%" accent />
                        <MetricCard label="Alunos Ativos" value="84" change="+5%" />
                    </div>
                )}

                {/* CONTENT AREA */}
                {renderContent()}
            </main>
        </div>
    );
}

const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-brand-500 text-black shadow-[0_0_15px_rgba(255,82,0,0.4)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
        <Icon size={18} strokeWidth={active ? 2.5 : 2} />
        <span className={`font-heading uppercase text-xs tracking-wider ${active ? 'font-bold' : ''}`}>{label}</span>
    </button>
);

const MetricCard = ({ label, value, change, accent }) => (
    <div className={`p-6 rounded-2xl border ${accent ? 'bg-brand-500 text-black border-brand-400' : 'bg-zinc-900 border-white/5'}`}>
        <h3 className={`text-xs font-mono uppercase mb-2 ${accent ? 'text-black/60' : 'text-zinc-500'}`}>{label}</h3>
        <div className="flex items-end justify-between">
            <span className="text-3xl font-heading font-medium">{value}</span>
            <span className={`text-[10px] lowercase px-1.5 py-0.5 rounded font-mono font-bold ${accent ? 'bg-black/10 text-black' : 'bg-green-500/10 text-green-500'}`}>{change}</span>
        </div>
    </div>
);
