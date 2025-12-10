import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Calendar, Clock, Info, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import { db, functions, auth } from '../lib/firebase';
import { httpsCallable } from 'firebase/functions';
import { doc, getDoc } from 'firebase/firestore';

// MOCK PARTNER (Still mock implementation for Partner Profile, as we focus on Booking System)
// Ideally this comes from Firestore 'partners' or 'users' collection
const MOCK_PARTNER_DATA = {
    name: 'Ironberg Gym',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
    rating: 4.8,
    address: 'Rua Olimpíadas, 230 - Vila Olímpia',
    description: 'A maior rede de academias de bodybuilding da América Latina. Equipamentos de ponta e ambiente hardcore.',
    amenities: ['Estacionamento', 'Chuveiro', 'Lanchonete', 'Wi-Fi']
};

export default function PartnerDetails() {
    const { id } = useParams(); // Partner ID
    const navigate = useNavigate();
    const [partner, setPartner] = useState(null); // Load real or mock
    const [classes, setClasses] = useState([]);
    const [loadingClasses, setLoadingClasses] = useState(true);
    const [bookingState, setBookingState] = useState({ isOpen: false, classItem: null, loading: false, success: false, error: null });

    useEffect(() => {
        // 1. Fetch Partner Details (Simulated or Real)
        // In a real scenario: const docRef = doc(db, 'partners', id); ...
        // We will just use Mock for the Profile part to speed up, but use Real for Classes.
        setPartner({ ...MOCK_PARTNER_DATA, id: id });

        // 2. Fetch Classes
        fetchClasses();
    }, [id]);

    const fetchClasses = async () => {
        setLoadingClasses(true);
        try {
            const getClassesFn = httpsCallable(functions, 'getClassesForPartner');
            const result = await getClassesFn({ partnerId: id });
            setClasses(result.data.classes || []);
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setLoadingClasses(false);
        }
    };

    const handleBookClass = async () => {
        if (!auth.currentUser) {
            alert("Faça login para reservar!");
            return; // Redirect to login
        }

        const { classItem } = bookingState;
        setBookingState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const bookClassFn = httpsCallable(functions, 'bookClass');
            const result = await bookClassFn({ classId: classItem.id });

            if (result.data.success) {
                setBookingState(prev => ({ ...prev, loading: false, success: true }));
                fetchClasses(); // Refresh to update spots
            }
        } catch (error) {
            console.error("Booking Error:", error);
            setBookingState(prev => ({ ...prev, loading: false, error: error.message }));
        }
    };

    if (!partner) return <div className="min-h-screen bg-black" />;

    return (
        <div className="min-h-screen bg-black pb-20">
            {/* HEADER IMAGE */}
            <div className="relative h-64">
                <img src={partner.image} alt={partner.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors">
                    <ArrowLeft size={20} />
                </button>
            </div>

            {/* INFO CONTENT */}
            <div className="px-6 -mt-10 relative z-10">
                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-xl">
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-2xl font-heading font-bold text-white uppercase">{partner.name}</h1>
                        <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded text-yellow-500 text-xs font-bold font-mono">
                            <Star size={12} fill="currentColor" /> {partner.rating}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono mb-4">
                        <MapPin size={14} /> {partner.address}
                    </div>

                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">{partner.description}</p>

                    <div className="flex flex-wrap gap-2">
                        {partner.amenities.map(am => (
                            <span key={am} className="text-[10px] uppercase font-mono bg-white/5 px-2 py-1 rounded text-zinc-400 border border-white/5">{am}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* UPCOMING CLASSES */}
            <div className="px-6 mt-8">
                <h2 className="text-xl font-heading text-white uppercase mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-brand-500" /> Próximas Aulas
                </h2>

                <div className="space-y-4">
                    {loadingClasses ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <Loader size={24} className="text-brand-500 animate-spin mb-2" />
                            <p className="text-zinc-500 font-mono text-xs uppercase">Buscando horários...</p>
                        </div>
                    ) : classes.length === 0 ? (
                        <div className="p-4 border border-zinc-800 rounded-xl text-center text-zinc-600 text-xs uppercase font-mono">Nenhuma aula disponível.</div>
                    ) : (
                        classes.map(cls => (
                            <div key={cls.id} className="bg-zinc-900 border border-white/5 rounded-xl p-4 flex items-center justify-between group">
                                <div>
                                    <h3 className="text-white font-bold font-heading uppercase">{cls.name}</h3>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500 font-mono uppercase">
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {new Date(cls.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span>•</span>
                                        <span>{cls.duration || '60min'}</span>
                                        <span>•</span>
                                        {/* Instructor is not in DB schema yet, assumed 'Instructor' or added to extended data */}
                                        <span>Instrutor</span>
                                    </div>
                                    <div className="mt-1 text-[10px] text-zinc-600 font-mono uppercase">
                                        {new Date(cls.startTime).toLocaleDateString('pt-BR')}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setBookingState({ isOpen: true, classItem: cls, loading: false })}
                                    disabled={cls.bookedCount >= cls.capacity}
                                    className={`flex flex-col items-center justify-center min-w-[80px] py-2 rounded-lg font-bold uppercase text-xs transition-colors ${cls.bookedCount >= cls.capacity ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-brand-500 hover:bg-brand-400 text-black'
                                        }`}>
                                    {cls.bookedCount >= cls.capacity ? (
                                        <span>Lotado</span>
                                    ) : (
                                        <>
                                            <span>Reservar</span>
                                            <div className="text-[10px] opacity-80 font-mono mt-0.5">{cls.cost} Crédito{cls.cost > 1 ? 's' : ''}</div>
                                        </>
                                    )}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* BOOKING CONFIRMATION MODAL */}
            {bookingState.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-3xl p-6 relative overflow-hidden">
                        {/* DECORATION */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-500/20 blur-3xl rounded-full pointer-events-none"></div>

                        {!bookingState.success ? (
                            <>
                                <h2 className="text-xl font-heading text-white uppercase text-center mb-6">Confirmar Reserva</h2>

                                <div className="bg-black/50 rounded-xl p-4 mb-6 border border-white/5">
                                    <h3 className="text-white font-bold uppercase text-center mb-1">{bookingState.classItem.name}</h3>
                                    <div className="flex justify-center gap-2 text-xs text-zinc-400 font-mono uppercase mb-4">
                                        <span>{new Date(bookingState.classItem.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span>•</span>
                                        <span>Instrutor</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                        <span className="text-zinc-500 text-xs font-mono uppercase">Custo Total</span>
                                        <span className="text-brand-500 font-bold text-lg">{bookingState.classItem.cost} Créditos</span>
                                    </div>
                                </div>

                                {bookingState.error && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 flex items-center gap-3">
                                        <AlertTriangle size={18} className="text-red-500 shrink-0" />
                                        <span className="text-red-500 text-xs font-mono">{bookingState.error}</span>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setBookingState({ ...bookingState, isOpen: false, error: null })}
                                        className="flex-1 py-3 bg-zinc-800 text-white font-bold uppercase rounded-xl hover:bg-zinc-700 transition-colors">
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleBookClass}
                                        disabled={bookingState.loading}
                                        className="flex-1 py-3 bg-brand-500 text-black font-bold uppercase rounded-xl hover:bg-brand-400 transition-colors disabled:opacity-50">
                                        {bookingState.loading ? 'Confirmando...' : 'Confirmar'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8 animate-in zoom-in duration-300">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500 border border-green-500/30">
                                    <CheckCircle size={32} />
                                </div>
                                <h2 className="text-2xl font-heading text-white uppercase mb-2">Reserva Confirmada!</h2>
                                <p className="text-zinc-400 text-sm mb-8">Sua aula foi agendada. Prepare-se!</p>
                                <button
                                    onClick={() => {
                                        setBookingState({ isOpen: false, classItem: null, success: false, loading: false });
                                    }}
                                    className="w-full py-3 bg-white text-black font-bold uppercase rounded-xl hover:bg-zinc-200 transition-colors">
                                    Ver Meus Agendamentos
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
