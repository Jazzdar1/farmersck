import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, RefreshCw, Sparkles, Zap
} from 'lucide-react';
import { askAI } from '../services/puterService';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  time: string;
}

export default function ExpertChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Salam! Main FC Kashmir ka AI Maher hoon. Koi bhi sawal puchein, main foran jawab dunga.",
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Call Faster AI
    const responseText = await askAI(input, true);
      
    const botMsg: Message = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020408] text-white flex flex-col font-sans" dir="rtl">
      
      {/* Header */}
      <div className="bg-[#0a0c10] p-4 border-b border-white/5 flex items-center gap-4 sticky top-0 z-10 shadow-xl">
        <div className="bg-emerald-500/10 p-3 rounded-full relative">
            <Bot size={24} className="text-emerald-500" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0c10] animate-pulse"></div>
        </div>
        <div>
            <h1 className="font-bold text-lg leading-none">AI ماہر (Fast)</h1>
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
               <Zap size={10} className="fill-current" /> Instant Replies
            </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 duration-300`}
          >
            <div 
              className={`max-w-[85%] p-4 rounded-2xl relative shadow-lg ${
                msg.sender === 'user' 
                ? 'bg-emerald-600 text-white rounded-br-none' 
                : 'bg-[#1a1d24] text-gray-100 rounded-bl-none border border-white/5'
              }`}
            >
                <p className={`text-sm leading-relaxed ${msg.sender === 'bot' ? 'font-urdu' : ''}`}>
                   {msg.text}
                </p>
                <span className="text-[9px] opacity-50 block text-left mt-2">{msg.time}</span>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-end animate-pulse">
            <div className="bg-[#1a1d24] p-4 rounded-2xl rounded-bl-none border border-white/5 flex items-center gap-2">
                <RefreshCw size={14} className="animate-spin text-emerald-500" />
                <span className="text-xs text-gray-400">Soch raha hoon...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#0a0c10] border-t border-white/5">
        <div className="relative flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Sawal puchein..." 
              className="flex-1 bg-[#020408] border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500 transition-all font-urdu"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-2xl shadow-lg shadow-emerald-900/50 transition-all disabled:opacity-50 active:scale-95"
            >
                <Send size={20} />
            </button>
        </div>
      </div>

    </div>
  );
}