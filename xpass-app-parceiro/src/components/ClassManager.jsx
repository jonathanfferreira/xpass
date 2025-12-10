import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Users, DollarSign, Trash2, Edit2, Search, Loader } from 'lucide-react';
import { functions } from '../lib/firebase';
import { httpsCallable } from 'firebase/functions';

export default function ClassManager() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newClass, setNewClass] = useState({ name: '', date: '', time: '', duration: '60min', capacity: 20, cost: 1 });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const getClassesFn = httpsCallable(functions, 'getPartnerClasses');
            const result = await getClassesFn();
            setClasses(result.data.classes || []);
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const createClassFn = httpsCallable(functions, 'createClass');
            await createClassFn(newClass);

            setIsModalOpen(false);
            setNewClass({ name: '', date: '', time: '', duration: '60min', capacity: 20, cost: 1 });
            fetchClasses(); // Refresh list
        } catch (error) {
            console.error("Error creating class:", error);
            alert("Erro ao criar aula: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-heading uppercase text-white">Grade de Aulas</h2>
                    <p className="text-zinc-500 font-mono text-xs uppercase">Gerencie seus horários e capacidades</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-500 hover:bg-brand-400 text-black font-bold uppercase px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,82,0,0.3)] hover:scale-105">
                    <Plus size={18} /> Nova Aula
                </button>
            </div>

            {/* CLASS LIST */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden min-h-[300px]">
                <div className="grid grid-cols-7 px-6 py-3 bg-black/20 border-b border-white/5 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    <div className="col-span-2">Aula</div>
                    <div>Data/Horário</div>
                    <div>Duração</div>
                    <div>Capacidade</div>
                    <div>Custo</div>
                    <div className="text-right">Ações</div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader size={32} className="text-brand-500 animate-spin mb-4" />
                        <p className="text-zinc-500 font-mono text-xs uppercase">Carregando aulas...</p>
                    </div>
                ) : classes.length === 0 ? (
                    <div className="text-center py-20 text-zinc-600 font-mono text-xs uppercase">
                        Nenhuma aula cadastrada.
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {classes.map(cls => (
                            <div key={cls.id} className="grid grid-cols-7 px-6 py-4 items-center hover:bg-white/5 transition-colors group">
                                <div className="col-span-2">
                                    <h3 className="text-white font-bold text-sm uppercase">{cls.name}</h3>
                                    <p className="text-zinc-500 text-[10px] font-mono uppercase truncate">{cls.id}</p>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-300 text-xs font-mono">
                                    <Clock size={14} className="text-brand-500" />
                                    {new Date(cls.startTime).toLocaleDateString('pt-BR')} <br />
                                    {new Date(cls.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="text-zinc-500 text-xs font-mono">{cls.duration || '60min'}</div>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${cls.bookedCount / cls.capacity > 0.8 ? 'bg-red-500' : 'bg-green-500'}`}
                                            style={{ width: `${(cls.bookedCount / cls.capacity) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-mono text-zinc-400">{cls.bookedCount}/{cls.capacity}</span>
                                </div>
                                <div className="text-white font-bold text-xs"><span className="text-brand-500">🪙</span> {cls.cost}</div>
                                <div className="text-right flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"><Edit2 size={14} /></button>
                                    <button className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CREATE MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-zinc-900 border border-white/10 p-8 rounded-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-heading text-white uppercase mb-6">Agendar Nova Aula</h2>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="text-xs font-mono text-zinc-500 uppercase mb-1 block">Nome da Aula</label>
                                <input
                                    required
                                    value={newClass.name}
                                    onChange={e => setNewClass({ ...newClass, name: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                                    placeholder="Ex: Funcional Hard" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-mono text-zinc-500 uppercase mb-1 block">Data</label>
                                    <input
                                        type="date"
                                        required
                                        value={newClass.date}
                                        onChange={e => setNewClass({ ...newClass, date: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-mono text-zinc-500 uppercase mb-1 block">Horário</label>
                                    <input
                                        type="time"
                                        required
                                        value={newClass.time}
                                        onChange={e => setNewClass({ ...newClass, time: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-mono text-zinc-500 uppercase mb-1 block">Vagas</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={newClass.capacity}
                                        onChange={e => setNewClass({ ...newClass, capacity: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-mono text-zinc-500 uppercase mb-1 block">Custo (Créditos)</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={newClass.cost}
                                        onChange={e => setNewClass({ ...newClass, cost: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-mono text-zinc-500 uppercase mb-1 block">Duração</label>
                                <select
                                    value={newClass.duration}
                                    onChange={e => setNewClass({ ...newClass, duration: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-brand-500 outline-none">
                                    <option value="30min">30 min</option>
                                    <option value="45min">45 min</option>
                                    <option value="60min">60 min</option>
                                    <option value="90min">90 min</option>
                                </select>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase rounded-lg">Cancelar</button>
                                <button type="submit" disabled={submitting} className="flex-1 py-3 bg-brand-500 hover:bg-brand-400 text-black font-bold uppercase rounded-lg disabled:opacity-50">
                                    {submitting ? 'Criando...' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
