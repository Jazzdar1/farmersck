import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowRight, MoreVertical, CheckCheck, Paperclip, Smile } from 'lucide-react';

export default function ExpertChat() {
  const navigate = useNavigate();
  // State for messages visible in UI
  const [messages, setMessages] = useState<any[]>([
    { id: 1, role: 'assistant', text: 'السلام علیکم! میں حاضر ہوں۔ آپ اپنے باغ کے بارے میں کچھ بھی پوچھ سکتے ہیں۔', time: '21:52' }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const lang = localStorage.getItem('fck_lang') || 'ur';
  const scrollRef = useRef<HTMLDivElement>(null);
  const puter = (window as any).puter;

  // 1. CHAT MEMORY LOGIC: This keeps track of the context
  const [chatHistory, setChatHistory] = useState<any[]>([
    { role: 'assistant', content: 'السلام علیکم! میں حاضر ہوں۔ آپ اپنے باغ کے بارے میں کچھ بھی پوچھ سکتے ہیں۔' }
  ]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const userMsg = { id: Date.now(), role: 'user', text: input, time };
    
    // Update UI
    setMessages(prev => [...prev, userMsg]);
    
    // Update Logical History for Gemini
    const updatedHistory = [...chatHistory, { role: 'user', content: input }];
    setChatHistory(updatedHistory);
    
    const currentInput = input;
    setInput("");
    setIsThinking(true);

    try {
      // 2. SEND FULL HISTORY: Gemini now sees the "Follow-up" context
      // We take the last 6 messages to keep the response fast but smart
      const contextPrompt = updatedHistory.slice(-6).map(m => `${m.role}: ${m.content}`).join("\n");
      
      const response = await puter.ai.chat(
        `You are a professional Apple Orchard Expert in Kashmir. 
         Maintain the conversation flow based on this history:
         ${contextPrompt}
         
         Reply specifically to the last message in ${lang === 'ur' ? 'Urdu' : 'English'}.`
      );
      
      const aiResponseText = response.toString();
      
      // Update UI with AI reply
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        text: aiResponseText, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) 
      }]);

      // Update Logical History with AI reply
      setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponseText }]);

    } catch (err) {
      setMessages(prev => [...prev, { id: 'err', role: 'assistant', text: 'Network issue. Try again.', time: '!' }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#0b141a] text-[#e9edef] overflow-hidden">
      {/* HEADER */}
      <div className="h-[55px] bg-[#202c33] px-3 flex justify-between items-center shrink-0 border-b border-white/5 z-10">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/my-portal')} className="p-2 -mr-2"><ArrowRight className={lang === 'en' ? 'rotate-180' : ''} size={20} /></button>
          <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center text-black font-black text-[10px] ml-2">AI</div>
          <div className="flex flex-col px-1">
            <h2 className="text-[14px] font-bold leading-none">{lang === 'ur' ? 'زرعی ماہر' : 'Agri Expert'}</h2>
            <p className="text-[9px] text-emerald-500 font-bold uppercase mt-1 tracking-widest">online</p>
          </div>
        </div>
        <MoreVertical size={18} className="text-[#aebac1] opacity-60" />
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#0b141a] relative no-scrollbar">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: '300px' }}></div>
        
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative max-w-[85%] px-3 py-1.5 rounded-lg text-[14px] shadow-sm ${m.role === 'user' ? 'bg-[#005c4b] rounded-tr-none' : 'bg-[#202c33] rounded-tl-none'}`}>
              <p className={`font-urdu leading-relaxed pb-3 ${lang === 'ur' ? 'text-right' : 'text-left'}`}>{m.text}</p>
              <div className="absolute bottom-1 right-2 flex items-center gap-1">
                <span className="text-[8px] text-white/30">{m.time}</span>
                {m.role === 'user' && <CheckCheck size={11} className="text-[#53bdeb]" />}
              </div>
            </div>
          </div>
        ))}
        {isThinking && <div className="flex justify-start"><div className="bg-[#202c33] px-3 py-1.5 rounded-lg text-[9px] text-emerald-500 animate-pulse">typing...</div></div>}
        <div ref={scrollRef} className="h-4" />
      </div>

      {/* INPUT AREA */}
      <div className="bg-[#202c33] p-2 flex items-center gap-2 shrink-0 pb-6 border-t border-white/5">
        <div className="flex-1 bg-[#2a3942] rounded-2xl px-4 py-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={lang === 'ur' ? 'پیغام' : 'Message'}
            className="w-full bg-transparent outline-none text-[16px] font-urdu text-white"
          />
        </div>
        <button onClick={handleSend} className="bg-[#00a884] w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg shrink-0 active:scale-90"><Send size={20} /></button>
      </div>
    </div>
  );
}