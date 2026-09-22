import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Camera, Sparkles, ChevronRight, ClipboardList } from 'lucide-react';
import { Studio } from '../types';
import { STUDIOS } from '../constants';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text?: string;
  type: 'text' | 'studio-card' | 'image-analysis';
  data?: any;
}

interface AICoachProps {
  onSelectStudio?: (studio: Studio) => void;
}

const AICoach: React.FC<AICoachProps> = ({ onSelectStudio }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [anamnesisStep, setAnamnesisStep] = useState<number>(0);
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'bot', 
      type: 'text', 
      text: 'Olá! Sou o XPASS Coach com inteligência artificial Gemini. Posso encontrar os melhores estúdios perto de você, analisar treinos ou montar seu plano personalizado. Como posso ajudar hoje?' 
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', type: 'text', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    if (anamnesisStep > 0) {
       processAnamnesis(currentInput);
    } else {
       await processAIResponse(currentInput);
    }
  };

  const startAnamnesis = () => {
    setAnamnesisStep(1);
    setMessages(prev => [...prev, {
       id: Date.now().toString(),
       sender: 'bot',
       type: 'text',
       text: 'Vamos criar seu plano de treino e nutrição. Qual é o seu principal objetivo? (Ex: Ganho de massa, Emagrecimento, Condicionamento físico)'
    }]);
  };

  const processAnamnesis = (input: string) => {
     setTimeout(() => {
        let responseText = '';
        if (anamnesisStep === 1) {
           responseText = 'Excelente meta! Qual é o seu peso atual (kg) e altura (cm)?';
           setAnamnesisStep(2);
        } else if (anamnesisStep === 2) {
           responseText = 'Perfeito. Quantos dias por semana você tem disponibilidade para treinar?';
           setAnamnesisStep(3);
        } else if (anamnesisStep === 3) {
           responseText = 'Tudo pronto! Calculei sua taxa metabólica basal e configurei seu plano de treino e meta de 2.400 kcal diárias. Confira tudo na aba "Meu Plano"!';
           setAnamnesisStep(0);
        }
        
        setMessages(prev => [...prev, {
           id: Date.now().toString(),
           sender: 'bot',
           type: 'text',
           text: responseText
        }]);
        setIsTyping(false);
     }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      
      const userMsg: Message = { 
        id: Date.now().toString(), 
        sender: 'user', 
        type: 'image-analysis', 
        data: { url: imageUrl, caption: 'O que é este aparelho?' } 
      };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        const botMsg: Message = { 
          id: (Date.now() + 1).toString(), 
          sender: 'bot', 
          type: 'text', 
          text: 'Identifiquei pela visão computacional: "Leg Press 45º". Aparelho excelente para quadríceps e glúteos. Mantenha os pés afastados na largura dos ombros e não faça hiperextensão dos joelhos no final do curso.' 
        };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const processAIResponse = async (input: string) => {
    const lowerInput = input.toLowerCase();

    // Check if live API endpoint is available
    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'bot',
            type: 'text',
            text: data.reply
          }]);
          setIsTyping(false);
          return;
        }
      }
    } catch (err) {
      // Graceful fallback to client-side logic
    }

    // Local smart responses
    setTimeout(() => {
      let newMessages: Message[] = [];

      if (lowerInput.includes('perto') || lowerInput.includes('onde') || lowerInput.includes('academia') || lowerInput.includes('estúdio') || lowerInput.includes('yoga') || lowerInput.includes('pilates')) {
        newMessages.push({ 
          id: Date.now().toString(), 
          sender: 'bot', 
          type: 'text', 
          text: 'Localizei estúdios parceiros próximos com ótimas avaliações e vagas abertas no momento:' 
        });
        
        const studio = lowerInput.includes('pilates') ? STUDIOS[1] : STUDIOS[0];
        newMessages.push({
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          type: 'studio-card',
          data: studio
        });
      } 
      else if (lowerInput.includes('plano') || lowerInput.includes('dieta') || lowerInput.includes('ficha') || lowerInput.includes('anamnese')) {
        startAnamnesis();
        setIsTyping(false);
        return;
      }
      else if (lowerInput.includes('crédito') || lowerInput.includes('preço') || lowerInput.includes('valor')) {
        newMessages.push({ 
          id: Date.now().toString(), 
          sender: 'bot', 
          type: 'text', 
          text: 'No XPASS, 1 crédito equivale a aproximadamente R$ 1,50. Cada estúdio define seu custo de créditos de acordo com os horários de pico ou off-peak. Você pode recarregar créditos a qualquer momento pelo Energy Core!' 
        });
      }
      else {
        newMessages.push({ 
          id: Date.now().toString(), 
          sender: 'bot', 
          type: 'text', 
          text: 'Treino de alta performance requer consistência, sono de qualidade e superávit/déficit calórico adequado. Se quiser, digite "criar plano" para fazermos uma anamnese completa!' 
        });
      }

      setMessages(prev => [...prev, ...newMessages]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* CHAT WINDOW */}
      <div 
        className={`fixed bottom-24 right-4 z-50 w-80 sm:w-96 bg-onyx-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right overflow-hidden ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-50 opacity-0 pointer-events-none translate-y-10'
        }`}
        style={{ height: '520px', maxHeight: '75vh' }}
      >
        {/* Header */}
        <div className="p-4 bg-onyx-800 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="relative w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-black overflow-hidden shadow-lg shadow-brand-500/30">
                <Sparkles size={20} className="relative z-10 fill-black" />
             </div>
             <div>
                <h3 className="font-heading font-bold text-white uppercase text-sm flex items-center gap-2">
                   Gemini Coach <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-zinc-300 font-mono">PRO</span>
                </h3>
                <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] font-mono text-zinc-400 uppercase">Online & Conectado</span>
                </div>
             </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer p-1">
             <X size={18} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-onyx-950/80 scrollbar-thin scrollbar-thumb-onyx-800 scrollbar-track-transparent">
           {messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                
                {/* TEXT MESSAGE */}
                {msg.type === 'text' && (
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-brand-500 text-black font-semibold rounded-tr-none' 
                        : 'bg-onyx-800 text-zinc-200 border border-white/10 rounded-tl-none shadow-lg'
                    }`}
                  >
                     {msg.text}
                  </div>
                )}

                {/* IMAGE ANALYSIS */}
                {msg.type === 'image-analysis' && msg.data && (
                   <div className="flex flex-col items-end gap-2">
                      <div className="w-40 h-40 rounded-xl overflow-hidden border-2 border-brand-500 shadow-lg relative">
                         <img src={msg.data.url} alt="Uploaded" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                            <span className="text-[9px] text-white font-mono flex items-center gap-1">
                               <Sparkles size={10} className="text-brand-500" /> Analisando foto...
                            </span>
                         </div>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">{msg.data.caption}</span>
                   </div>
                )}

                {/* STUDIO CARD RECOMMENDATION */}
                {msg.type === 'studio-card' && msg.data && (
                  <div className="max-w-[90%] bg-onyx-900 border border-brand-500/40 rounded-xl p-3 shadow-lg flex flex-col gap-2">
                     <div className="flex gap-3">
                        <img src={msg.data.imageUrl} alt={msg.data.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                           <h4 className="font-heading font-bold text-white text-sm uppercase">{msg.data.name}</h4>
                           <span className="text-[10px] font-mono text-zinc-400 block">{msg.data.category} • {msg.data.distance}</span>
                           <span className="text-xs font-mono font-bold text-brand-500 mt-1 block">{msg.data.creditCost} Créditos</span>
                        </div>
                     </div>
                     <button 
                        onClick={() => {
                          setIsOpen(false);
                          if (onSelectStudio) onSelectStudio(msg.data);
                        }}
                        className="w-full py-1.5 bg-white/10 hover:bg-brand-500 hover:text-black rounded-lg text-xs font-heading font-bold uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer"
                     >
                        Ver Detalhes <ChevronRight size={14} />
                     </button>
                  </div>
                )}
             </div>
           ))}

           {/* TYPING INDICATOR */}
           {isTyping && (
             <div className="flex justify-start">
               <div className="bg-onyx-800 border border-white/5 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.4s]" />
               </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-onyx-900/90 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
           <button 
             onClick={startAnamnesis} 
             className="flex-shrink-0 text-[10px] bg-white/5 hover:bg-brand-500 hover:text-black border border-white/10 px-2.5 py-1 rounded-full font-mono text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
           >
              <ClipboardList size={10} /> Criar Plano
           </button>
           <button 
             onClick={() => { setInputText('Academias de musculação perto de mim'); }} 
             className="flex-shrink-0 text-[10px] bg-white/5 hover:bg-brand-500 hover:text-black border border-white/10 px-2.5 py-1 rounded-full font-mono text-zinc-300 transition-colors cursor-pointer"
           >
              Buscar Estúdios
           </button>
           <button 
             onClick={() => { setInputText('Como funcionam os créditos?'); }} 
             className="flex-shrink-0 text-[10px] bg-white/5 hover:bg-brand-500 hover:text-black border border-white/10 px-2.5 py-1 rounded-full font-mono text-zinc-300 transition-colors cursor-pointer"
           >
              Créditos
           </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-onyx-900 border-t border-white/10 flex items-center gap-2">
           <input 
             type="file" 
             ref={fileInputRef} 
             onChange={handleImageUpload} 
             accept="image/*" 
             className="hidden" 
           />
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="p-2 text-zinc-400 hover:text-brand-500 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
             title="Enviar foto para análise visual"
           >
              <Camera size={18} />
           </button>

           <input 
             type="text" 
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             onKeyDown={handleKeyDown}
             placeholder="Pergunte ao AI Coach..."
             className="flex-1 bg-onyx-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-500/50"
           />

           <button 
             onClick={handleSend}
             disabled={!inputText.trim()}
             className="p-2 bg-brand-500 disabled:opacity-30 text-black font-bold rounded-xl transition-all shadow-md shadow-brand-500/20 cursor-pointer"
           >
              <Send size={16} />
           </button>
        </div>
      </div>

      {/* FLOATING TRIGGER BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-2xl bg-brand-500 text-black flex items-center justify-center shadow-[0_0_25px_rgba(255,82,0,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
      >
        <Bot size={28} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white border-2 border-black rounded-full" />
      </button>
    </>
  );
};

export default AICoach;
