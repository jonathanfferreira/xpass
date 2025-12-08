import React, { useState, useEffect } from 'react';
import { db, functions } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { Search, RotateCcw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function SupportView() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            // MVP: Busca as últimas 20 transações gerais
            // Idealmente buscaria por usuário específico
            const q = query(
                collection(db, "transactions"),
                orderBy("timestamp", "desc"),
                limit(20)
            );

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().timestamp?.toDate() || new Date()
            }));

            setTransactions(data);
        } catch (error) {
            console.error("Erro ao buscar transações:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleRefund = async (tx) => {
        if (!window.confirm(`Tem certeza que deseja estornar R$ ${tx.value} do usuário ${tx.userId}?`)) return;

        const reason = window.prompt("Motivo do estorno:");
        if (!reason) return;

        setProcessingId(tx.id);
        try {
            const refundPayment = httpsCallable(functions, 'refundPayment');
            const result = await refundPayment({
                paymentId: tx.paymentId,
                reason
            });

            alert(result.data.message);
            fetchTransactions(); // Recarrega lista

        } catch (error) {
            console.error("Erro no estorno:", error);
            alert("Erro: " + error.message);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-condensed text-white uppercase">Suporte Financeiro</h2>
                    <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">Gestão de Estornos e Disputas</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar ID ou User..."
                        className="bg-[#111] border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white w-64 focus:border-[#FF5200] outline-none transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-black text-gray-500 font-mono text-[10px] uppercase tracking-widest">
                        <tr>
                            <th className="p-4">Data</th>
                            <th className="p-4">Usuário / ID</th>
                            <th className="p-4">Tipo</th>
                            <th className="p-4 text-right">Valor</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan="6" className="p-8 text-center text-[#FF5200] animate-pulse">CARREGANDO...</td></tr>
                        ) : transactions.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500">Nenhuma transação encontrada.</td></tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-gray-400 font-mono text-xs">
                                        {tx.date.toLocaleDateString()} <br /> {tx.date.toLocaleTimeString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="text-white font-bold text-xs">{tx.userId}</div>
                                        <div className="text-gray-600 text-[10px] font-mono">{tx.paymentId || '-'}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] uppercase px-2 py-1 rounded border ${tx.type === 'REFUND' ? 'border-red-500/30 text-red-500 bg-red-500/10' :
                                                tx.type === 'SUBSCRIPTION_RENEWAL' ? 'border-green-500/30 text-green-500 bg-green-500/10' :
                                                    'border-gray-500/30 text-gray-400'
                                            }`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-condensed text-lg text-white">
                                        R$ {Math.abs(tx.value || 0).toFixed(2)}
                                    </td>
                                    <td className="p-4 text-center">
                                        {tx.status === 'REFUNDED' ? (
                                            <span className="text-red-500 flex justify-center"><RotateCcw size={16} /></span>
                                        ) : tx.type === 'REFUND' ? (
                                            <span className="text-gray-500 flex justify-center"><CheckCircle size={16} /></span>
                                        ) : (
                                            <span className="text-green-500 flex justify-center"><CheckCircle size={16} /></span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        {tx.paymentId && tx.type !== 'REFUND' && tx.status !== 'REFUNDED' && (
                                            <button
                                                onClick={() => handleRefund(tx)}
                                                disabled={processingId === tx.id}
                                                className="text-red-500 hover:text-white hover:bg-red-500 border border-red-500/30 px-3 py-1 rounded text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
                                            >
                                                {processingId === tx.id ? '...' : 'Estornar'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
