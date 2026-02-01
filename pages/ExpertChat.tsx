import React, { useState } from 'react';
import { Send, MessageCircle, Bot, User, Sparkles } from 'lucide-react';
import { askAI } from '../services/puterService';

export default function ExpertChat() {
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState<{role: string, text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query) return;
    setLoading(true);
    setChat(prev => [...prev, { role: 'user', text: query }]);
    
    // Expert Prompting
    const fullPrompt = `Kashmiri Farmer Expert AI: ${query}`;
    const response = await askAI(fullPrompt, false);
    
    setChat(prev => [...prev, { role: 'bot', text: response || "Bhai, network ka masla hai. Dubara poochein." }]);
    setQuery('');
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-10 bg-black min-h-screen text-right flex flex-col" dir="rtl">
      <header className="mb-8 flex items-center justify-between bg-emerald-600/10 p-6 rounded-[2.5rem] border border-emerald-500/20">
         <div className="flex items-center gap-4">
            <div className="bg-emerald-500 p-3 rounded-2xl text-black"><Bot size={28}/></div>
            <div>
               <h1 className="text-2xl font-black font-urdu text-emerald-400 leading-none">زرعی ماہر AI</h1>
               <p className="text-[9px] text-emerald-500/40 uppercase tracking-[0.2em] mt-1 font-black italic">Powered by FCK Expert Engine</p>
            </div>
         </div>
      </header>

      {/* Chat History */}
      <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar mb-24 px-2">
        {chat.length === 0 && (
          <div className="text-center py-20 opacity-30">
             <Sparkles size={48} className="mx-auto mb-4 text-emerald-500" />
             <p className="font-urdu text-xl text-white">کیسے مدد کروں؟ سیب کے باغ یا کھاد کے بارے میں پوچھیں۔</p>
          </div>
        )}
        {chat.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-start flex-row-reverse' : 'justify-start'}`}>
            <div className={`p-5 rounded-[2rem] max-w-[85%] text-lg font-urdu leading-relaxed ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="fixed bottom-6 inset-x-4 md:inset-x-20 bg-[#0a0a0a] p-4 rounded-[3rem] border border-white/10 flex items-center gap-4 shadow-2xl">
        <input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="اپنا سوال یہاں لکھیں..."
          className="bg-transparent flex-1 text-white font-urdu text-xl outline-none px-4"
        />
        <button 
          onClick={handleAsk}
          className="bg-emerald-600 p-4 rounded-full text-white hover:bg-emerald-500 transition-all active:scale-90"
        >
          {loading ? <div className="animate-spin border-2 border-white/30 border-t-white rounded-full w-6 h-6"></div> : <Send size={24} />}
        </button>
      </div>
    </div>
  );
}