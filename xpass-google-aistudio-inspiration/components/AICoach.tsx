import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, MapPin, Camera, Image as ImageIcon, Sparkles, ChevronRight } from 'lucide-react';
import { Studio } from '../types';
import { STUDIOS } from '../constants';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text?: string;
  type: 'text' | 'studio-card' | 'image-analysis';
  data?: any;
}

const AICoach: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', type: 'text', text: 'Olá! Sou seu XPASS Coach com IA. Posso encontrar academias, analisar seus equipamentos ou sugerir treinos. Como posso ajudar?' }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', type: 'text', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    processAIResponse(inputText);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  // Simulate Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      
      const userMsg: Message = { 
        id: Date.now().toString(), 
        sender: 'user', 
        type: 'image-analysis', 
        data: { url: imageUrl, caption: 'O que é isso?' } 
      };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        const botMsg: Message = { 
          id: (Date.now() + 1).toString(), 
          sender: 'bot', 
          type: 'text', 
          text: 'Isso parece ser um "Leg Press 45º". Excelente para quadríceps! Certifique-se de manter as costas apoiadas e não estender totalmente os joelhos no topo do movimento.' 
        };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, 2500);
    }
  };

  // Intelligent Response Router
  const processAIResponse = (input: string) => {
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let newMessages: Message[] = [];

      // SCENARIO 1: Maps Grounding (Finding Studios)
      if (lowerInput.includes('perto') || lowerInput.includes('onde') || lowerInput.includes('academia') || lowerInput.includes('yoga')) {
        newMessages.push({ 
          id: Date.now().toString(), 
          sender: 'bot', 
          type: 'text', 
          text: 'Usei minha integração com Google Maps para encontrar as melhores opções próximas a você:' 
        });
        
        // Simulate fetching a studio
        const studio = STUDIOS[0]; // Iron Forge
        newMessages.push({
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          type: 'studio-card',
          data: studio
        });
      } 
      // SCENARIO 2: Workout Advice
      else if (lowerInput.includes('treino') || lowerInput.includes('perder peso') || lowerInput.includes('hipertrofia')) {
        newMessages.push({ 
          id: Date.now().toString(), 
          sender: 'bot', 
          type: 'text', 
          text: 'Baseado no seu perfil, sugiro focar em exercícios compostos. Que tal tentar este protocolo hoje?' 
        });
      }
      // DEFAULT
      else {
         newMessages.push({ 
          id: Date.now().toString(), 
          sender: 'bot', 
          type: 'text', 
          text: 'Entendido. Estou processando essa informação com o Gemini Flash para te dar a resposta mais precisa...' 
        });
      }

      setMessages(prev => [...prev, ...newMessages]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* CHAT WINDOW */}
      <div 
        className={`fixed bottom-24 right-4 z-50 w-80 sm:w-96 bg-onyx-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right overflow-hidden ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-50 opacity-0 pointer-events-none translate-y-10'
        }`}
        style={{ height: '500px', maxHeight: '70vh' }}
      >
        {/* Header */}
        <div className="p-4 bg-onyx-800 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="relative w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-600 to-purple-600 opacity-80" />
                <Sparkles size={20} className="relative z-10" />
             </div>
             <div>
                <h3 className="font-heading font-bold text-white uppercase text-sm flex items-center gap-2">
                   Gemini Coach <span className="text-[9px] bg-white/10 px-1.5 rounded text-zinc-300 font-mono">PRO</span>
                </h3>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] font-mono text-zinc-400 uppercase">Online & Connected</span>
                </div>
             </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">
             <X size={18} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-onyx-950/50 scrollbar-thin scrollbar-thumb-onyx-800 scrollbar-track-transparent">
           {messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                
                {/* TEXT MESSAGE */}
                {msg.type === 'text' && (
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-brand-500 text-black font-medium rounded-tr-none' 
                        : 'bg-onyx-800 text-zinc-300 border border-white/5 rounded-tl-none shadow-lg'
                    }`}
                  >
                     {msg.text}
                  </div>
                )}

                {/* IMAGE ANALYSIS MESSAGE (User sent photo) */}
                {msg.type === 'image-analysis' && msg.data && (
                   <div className="flex flex-col items-end gap-2">
                      <div className="w-40 h-40 rounded-xl overflow-hidden border-2 border-brand-500 shadow-lg relative">
                         <img src={msg.data.url} alt="Uploaded" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                            <span className="text-[9px] text-white font-mono flex items-center gap-1">
                               <Sparkles size={10} className="text-brand-500" /> Analyzing...
                            </span>
                         </div>
                      </div>
                   </div>
                )}

                {/* RICH CARD: STUDIO (Bot sent map result) */}
                {msg.type === 'studio-card' && msg.data && (
                   <div className="max-w-[85%] bg-onyx-800 rounded-xl overflow-hidden border border-white/10 shadow-lg group cursor-pointer hover:border-brand-500/30 transition-colors">
                      <div className="h-24 relative">
                         <img src={msg.data.imageUrl} className="w-full h-full object-cover opacity-80" alt={msg.data.name} />
                         <div className="absolute top-2 right-2 bg-brand-500 text-black text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <MapPin size={10} /> {msg.data.distance}
                         </div>
                      </div>
                      <div className="p-3">
                         <h4 className="font-heading text-white text-sm uppercase">{msg.data.name}</h4>
                         <p className="text-[10px] text-zinc-400 font-mono mb-3">{msg.data.category} • {msg.data.rating} ★</p>
                         <button className="w-full py-1.5 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-[10px] font-bold uppercase text-white transition-colors flex items-center justify-center gap-1">
                            Ver Detalhes <ChevronRight size={10} />
                         </button>
                      </div>
                   </div>
                )}

             </div>
           ))}

           {isTyping && (
             <div className="flex justify-start">
                <div className="bg-onyx-800 p-3 rounded-xl rounded-tl-none border border-white/5 flex gap-1 items-center">
                   <Bot size={14} className="text-brand-500 mr-2 animate-pulse" />
                   <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                   <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                   <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-onyx-900 border-t border-white/5 flex flex-col gap-2">
           {/* Quick Actions */}
           <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              <button 
                 onClick={() => fileInputRef.current?.click()}
                 className="flex-shrink-0 p-2 bg-onyx-800 rounded-lg text-zinc-400 hover:text-brand-500 hover:bg-onyx-700 transition-colors border border-transparent hover:border-brand-500/20"
                 title="Analyze Photo"
              >
                 <Camera size={18} />
              </button>
              <button 
                 onClick={() => { setInputText('Academias perto de mim'); handleSend(); }}
                 className="flex-shrink-0 px-3 py-1.5 bg-onyx-800 rounded-lg text-xs font-mono text-zinc-400 hover:text-white hover:bg-onyx-700 transition-colors whitespace-nowrap border border-white/5"
              >
                 <MapPin size={12} className="inline mr-1 text-brand-500" /> Perto de mim
              </button>
              <button 
                 onClick={() => { setInputText('Como usar esta máquina?'); handleSend(); }}
                 className="flex-shrink-0 px-3 py-1.5 bg-onyx-800 rounded-lg text-xs font-mono text-zinc-400 hover:text-white hover:bg-onyx-700 transition-colors whitespace-nowrap border border-white/5"
              >
                 <ImageIcon size={12} className="inline mr-1 text-blue-500" /> Analisar Eqpto.
              </button>
           </div>

           <div className="flex gap-2">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pergunte ao Gemini..."
                className="flex-1 bg-onyx-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none placeholder:text-zinc-600"
              />
              <button 
                onClick={handleSend}
                className="p-2 bg-brand-500 rounded-lg text-black hover:bg-brand-400 transition-colors"
              >
                 <Send size={16} />
              </button>
           </div>
           
           {/* Hidden File Input */}
           <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload}
           />
        </div>
      </div>

      {/* FLOATING BUTTON */}
      <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end pointer-events-none">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`pointer-events-auto relative w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,82,0,0.4)] transition-all duration-300 ${isOpen ? 'bg-onyx-800 scale-0' : 'bg-brand-500 hover:scale-105'}`}
        >
          {/* Breathing Effect Ring */}
          {!isOpen && (
            <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping opacity-50" />
          )}
          
          <Sparkles size={24} className="text-white fill-white" />
        </button>
      </div>
    </>
  );
};

export default AICoach;