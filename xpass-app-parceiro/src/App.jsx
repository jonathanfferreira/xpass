import React, { useState, useEffect } from 'react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Dashboard from './components/Dashboard';
import SetupWizard from './components/SetupWizard';
import { ArrowRight, Lock } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [partnerProfile, setPartnerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch Partner Profile
        const docRef = doc(db, 'partners', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPartnerProfile(docSnap.data());
        } else {
          // If no partner doc, maybe it's a first login. 
          // We will let SetupWizard handle creation or check 'users' collection depending on architecture.
          // For now, assume if auth exists but no partner doc, we treat as PENDING_SETUP
          setPartnerProfile({ status: 'PENDING_SETUP' });
        }
      } else {
        setPartnerProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      setError('Credenciais inválidas.');
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-brand-500 font-mono text-xs uppercase animate-pulse">Carregando XPASS Partner...</div>;

  // 1. NOT LOGGED IN
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-50"></div>
        <div className="absolute w-96 h-96 bg-brand-500/20 blur-[100px] rounded-full -top-20 -left-20 pointer-events-none"></div>

        <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 backdrop-blur-xl p-8 rounded-2xl relative z-10">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-heading font-black italic tracking-tighter text-white mb-2">XPASS <span className="text-brand-500">PARTNER</span></h1>
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Acesso exclusivo para parceiros</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-500 uppercase mb-1 ml-1">Email Corporativo</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                placeholder="seunome@academia.com"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-500 uppercase mb-1 ml-1">Senha</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all pr-10"
                  placeholder="••••••••"
                />
                <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              </div>
            </div>

            {error && <div className="text-red-500 text-xs font-mono bg-red-500/10 p-2 rounded border border-red-500/20 text-center">{error}</div>}

            <button type="submit" className="w-full bg-brand-500 hover:bg-brand-400 text-black font-heading font-bold uppercase py-3 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(255,82,0,0.2)]">
              Entrar no Portal <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <a href="#" className="text-[10px] text-zinc-600 hover:text-white uppercase font-mono transition-colors">Esqueci minha senha</a>
          </div>
        </div>

        <div className="mt-8 text-zinc-800 text-[10px] font-mono uppercase">
          &copy; 2024 XPASS Inc. All rights reserved.
        </div>
      </div>
    );
  }

  // 2. LOGGED IN BUT PENDING SETUP or NO PROFILE
  if (partnerProfile?.status === 'PENDING_SETUP' || !partnerProfile?.setupCompleted) {
    return <SetupWizard user={user} onComplete={() => window.location.reload()} />;
  }

  // 3. LOGGED IN & APPROVED (Dashboard)
  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;
