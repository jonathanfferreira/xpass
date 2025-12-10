import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PartnerDetails from './pages/PartnerDetails';

// Placeholder Home
const Home = () => (
  <div className="min-h-screen bg-black text-white p-8">
    <h1 className="text-2xl font-heading uppercase text-white mb-4">Academias</h1>
    <div className="space-y-4">
      {/* Simple link to partner 1 for demo */}
      <a href="/partner/1" className="block bg-zinc-900 border border-white/10 rounded-xl p-4 hover:border-brand-500 transition-colors">
        <div className="font-bold uppercase text-lg">Ironberg Gym</div>
        <div className="text-zinc-500 text-xs font-mono">Vila Olímpia, SP</div>
      </a>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/partner/:id" element={<PartnerDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
