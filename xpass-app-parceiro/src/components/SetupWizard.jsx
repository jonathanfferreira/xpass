import React, { useState } from 'react';
import { db, auth } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Building, MapPin, Camera, CheckCircle } from 'lucide-react';

export default function SetupWizard({ user, onComplete }) {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        address: '',
        description: '',
        basePrice: 5, // Credits
        photos: []
    });

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Update Partner Profile in Firestore
            await updateDoc(doc(db, 'partners', user.uid), {
                ...formData,
                status: 'APPROVED', // Auto-approving for demo/MVP after setup
                setupCompleted: true,
                updatedAt: new Date()
            });
            onComplete();
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Erro ao salvar perfil.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-zinc-900 border border-white/10 p-8 rounded-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-heading uppercase font-bold text-white mb-2">Bem-vindo ao XPASS</h1>
                    <p className="text-zinc-500 font-mono text-xs uppercase">Configure seu estabelecimento para começar</p>
                </div>

                <div className="space-y-6">
                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-mono text-brand-500 uppercase mb-2">
                                    <Building size={16} /> Endereço Completo
                                </label>
                                <input
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                                    placeholder="Rua Exemplo, 123..." />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-mono text-brand-500 uppercase mb-2">
                                    <MapPin size={16} /> Descrição da Academia
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-brand-500 outline-none h-32"
                                    placeholder="Conte sobre sua estrutura, equipamentos..." />
                            </div>
                            <button
                                onClick={() => setStep(2)}
                                className="w-full bg-white text-black font-bold uppercase py-3 rounded-lg hover:bg-zinc-200 transition-colors mt-4">
                                Próximo
                            </button>
                        </div>
                    )}

                    {/* Step 2: Pricing & Photos */}
                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-mono text-brand-500 uppercase mb-2">
                                    <CheckCircle size={16} /> Preço Base (Créditos)
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        value={formData.basePrice}
                                        onChange={e => setFormData({ ...formData, basePrice: parseInt(e.target.value) })}
                                        className="w-24 bg-black border border-white/10 rounded-lg p-3 text-white focus:border-brand-500 outline-none text-center font-bold text-xl"
                                    />
                                    <span className="text-zinc-500 text-xs uppercase max-w-[200px]">
                                        Valor cobrado por check-in avulso. 1 Crédito ≈ R$ 10.
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 border-2 border-dashed border-zinc-800 rounded-lg text-center cursor-pointer hover:border-brand-500/50 transition-colors">
                                <Camera size={32} className="mx-auto text-zinc-600 mb-2" />
                                <span className="text-xs text-zinc-500 uppercase">Adicionar Fotos (Em breve)</span>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 bg-zinc-800 text-white font-bold uppercase py-3 rounded-lg hover:bg-zinc-700 transition-colors">
                                    Voltar
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="flex-1 bg-brand-500 text-black font-bold uppercase py-3 rounded-lg hover:bg-brand-400 transition-colors">
                                    {isLoading ? 'Salvando...' : 'Finalizar Setup'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
