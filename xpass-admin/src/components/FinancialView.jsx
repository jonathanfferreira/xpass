import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { DollarSign, ArrowUpRight, ArrowDownLeft, TrendingUp, Wallet } from 'lucide-react';

/**
 * A dashboard component displaying financial metrics.
 *
 * Fetches and displays GMV (Gross Merchandise Value), payouts, and net revenue.
 * Also lists recent transactions.
 *
 * @component
 * @returns {JSX.Element} The rendered FinancialView component.
 */
export default function FinancialView() {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        gmv: 0, // Gross Merchandise Value (Vendas Totais)
        payouts: 0, // Valor a repassar aos parceiros
        netRevenue: 0, // Receita Líquida (GMV - Payouts)
        transactions: []
    });

    const REPASSE_POR_AULA = 15.00;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Buscar Vendas (Créditos + Assinaturas)
                // Em produção, usar aggregation queries ou cloud functions
                const salesQuery = query(collection(db, "transactions"), where("type", "in", ["CREDIT_PURCHASE", "SUBSCRIPTION_RENEWAL"]), orderBy("timestamp", "desc"), limit(100));
                const salesSnap = await getDocs(salesQuery);

                let totalSales = 0;
                const salesData = [];

                salesSnap.forEach(doc => {
                    const data = doc.data();
                    totalSales += data.value || 0;
                    salesData.push({ ...data, id: doc.id });
                });

                // 2. Buscar Check-ins para calcular Repasse
                const bookingsQuery = query(collection(db, "bookings"), where("status", "==", "CONFIRMED"), limit(100)); // Limitado para MVP
                const bookingsSnap = await getDocs(bookingsQuery);

                let totalPayouts = 0;
                bookingsSnap.forEach(doc => {
                    totalPayouts += REPASSE_POR_AULA;
                });

                setMetrics({
                    gmv: totalSales,
                    payouts: totalPayouts,
                    netRevenue: totalSales - totalPayouts,
                    transactions: salesData
                });

            } catch (error) {
                console.error("Erro financeiro:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center text-[#FF5200] animate-pulse py-20">CALCULANDO METRICAS FINANCEIRAS...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="font-condensed text-4xl text-white mb-4">DASHBOARD FINANCEIRO</h2>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-xl border-l-4 border-green-500">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-gray-400 text-xs font-bold uppercase">GMV (Vendas Brutas)</h3>
                        <ArrowUpRight className="text-green-500" size={20} />
                    </div>
                    <p className="font-condensed text-5xl text-white">R$ {metrics.gmv.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-xs text-gray-500 mt-2">Total transacionado na plataforma</p>
                </div>

                <div className="glass-panel p-6 rounded-xl border-l-4 border-red-500">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-gray-400 text-xs font-bold uppercase">Repasses (A Pagar)</h3>
                        <ArrowDownLeft className="text-red-500" size={20} />
                    </div>
                    <p className="font-condensed text-5xl text-white">R$ {metrics.payouts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-xs text-gray-500 mt-2">Custo com parceiros (R$ 15,00/aula)</p>
                </div>

                <div className="glass-panel p-6 rounded-xl border-l-4 border-[#FF5200]">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-gray-400 text-xs font-bold uppercase">Receita Líquida</h3>
                        <Wallet className="text-[#FF5200]" size={20} />
                    </div>
                    <p className="font-condensed text-5xl text-white">R$ {metrics.netRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-xs text-gray-500 mt-2">Margem de Contribuição</p>
                </div>
            </div>

            {/* TRANSAÇÕES RECENTES */}
            <div className="glass-panel rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-white flex items-center gap-2"><DollarSign size={16} /> ÚLTIMAS VENDAS</h3>
                    <button className="text-[10px] text-[#FF5200] uppercase hover:underline">Ver Todas</button>
                </div>
                <table className="w-full text-left text-[10px] md:text-xs">
                    <thead className="bg-white/5 text-gray-400 font-mono uppercase">
                        <tr>
                            <th className="p-4">DATA</th>
                            <th className="p-4">TIPO</th>
                            <th className="p-4">USUÁRIO</th>
                            <th className="p-4">MÉTODO</th>
                            <th className="p-4 text-right">VALOR</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                        {metrics.transactions.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-500">Nenhuma venda registrada.</td></tr>
                        ) : (
                            metrics.transactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-gray-500">{tx.timestamp?.toDate().toLocaleDateString()} {tx.timestamp?.toDate().toLocaleTimeString()}</td>
                                    <td className="p-4 font-bold text-white uppercase">{tx.type.replace('_', ' ')}</td>
                                    <td className="p-4 text-gray-400">{tx.userId.substr(0, 8)}...</td>
                                    <td className="p-4 text-gray-400">{tx.provider}</td>
                                    <td className="p-4 text-right text-green-500 font-bold">+ R$ {tx.value?.toFixed(2)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
