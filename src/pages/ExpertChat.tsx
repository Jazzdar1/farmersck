import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, Bot, User, Globe, MessageCircle, Loader2 } from 'lucide-react';

export default function ExpertChat() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'ur' | 'en'>('ur');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Chat History
  const [messages, setMessages] = useState<any[]>([
    { 
      role: 'model', // Puter AI uses 'model' instead of 'bot'
      text: 'السلام علیکم! میں فارمرز کارنر کشمیر (FCK) کا اسمارٹ اسسٹنٹ ہوں۔ میں آپ کی فصلوں کے حوالے سے کیا مدد کر سکتا ہوں؟', 
      action: null 
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const content = {
    ur: {
      title: "FCK AI اسسٹنٹ",
      subtitle: "آن لائن (Puter AI)",
      placeholder: "یہاں سوال پوچھیں...",
      thinking: "AI جواب لکھ رہا ہے...",
      whatsappBtn: "ماہر سے رابطہ کریں"
    },
    en: {
      title: "FCK AI Assistant",
      subtitle: "Online (Puter AI)",
      placeholder: "Ask anything...",
      thinking: "AI is typing...",
      whatsappBtn: "Connect to Human Expert"
    }
  };

  const t = content[language];

  // 🤖 REAL AI FUNCTION (Puter.js)
  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput(''); // Clear input
    
    // 1. Add User Message to UI
    const newMessages = [...messages, { role: 'user', text: userText, action: null }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
        const puter = (window as any).puter;
        
        // 2. CHECK FOR HUMAN HANDOFF (UI Logic)
        // Even though AI is smart, we manually trigger the button if user asks for human
        let action = null;
        const q = userText.toLowerCase();
        if (q.includes('expert') || q.includes('human') || q.includes('insan') || q.includes('doctor') || q.includes('call')) {
            action = 'whatsapp';
        }

        // 3. CALL PUTER AI (The Real Brain)
        // We send a "System Prompt" to tell the AI who it is.
        const systemPrompt = `
            You are the expert agricultural assistant for "Farmer's Corner Kashmir" (FCK). 
            Your name is FCK Assistant.
            You must answer in the SAME language the user speaks (Urdu or English).
            If the user speaks Urdu (Roman or Script), reply in Urdu Script or Roman Urdu (whichever is easier, but preferably Urdu Script).
            
            Topics you know: Apple Scab, Red Mite, Fertilizers (Urea, DAP), Weather in Kashmir, Pruning, Irrigation.
            
            Key Rules:
            1. Be polite and professional.
            2. If the user asks about something unrelated to farming (e.g. politics), politely bring them back to farming.
            3. Keep answers concise (short and sweet).
            4. If the user asks to talk to a human/expert, say "Certainly, please use the button below to connect on WhatsApp."
        `;

        // Puter Chat API
        const response = await puter.ai.chat(userText, { system: systemPrompt });
        
        // 4. Update UI with Real AI Response
        setMessages(prev => [...prev, { 
            role: 'model', 
            text: response?.message?.content || "Sorry, I am having trouble connecting to the brain.", 
            action: action 
        }]);

    } catch (error) {
        console.error("AI Error:", error);
        setMessages(prev => [...prev, { 
            role: 'model', 
            text: language === 'ur' ? "معاف کیجئے، نیٹ ورک کا مسئلہ ہے۔ دوبارہ کوشش کریں۔" : "Sorry, network error. Please try again.", 
            action: null 
        }]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#020408] text-white flex flex-col font-sans transition-all duration-300`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      
      {/* HEADER */}
      <div className="p-4 bg-[#0a0c10] border-b border-white/5 flex items-center justify-between shadow-lg z-10 sticky top-0">
         <div className="flex items-center gap-3">
             <button onClick={() => navigate('/')} className="p-2 bg-white/5 rounded-xl hover:bg-white/10"><ArrowLeft size={20} className={language === 'ur' ? '' : 'rotate-180'} /></button>
             <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0 animate-pulse"><Bot size={24} /></div>
             <div>
                 <h1 className={`font-black italic text-lg leading-none ${language === 'ur' ? 'font-urdu' : ''}`}>{t.title}</h1>
                 <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                     <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> {t.subtitle}
                 </p>
             </div>
         </div>

         <button onClick={() => setLanguage(language === 'ur' ? 'en' : 'ur')} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all">
             <Globe size={16} className="text-sky-400" />
             <span className="text-xs font-bold uppercase">{language === 'ur' ? 'English' : 'اردو'}</span>
         </button>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 p-4 overflow-y-auto space-y-6 pb-24">
          {messages.map((m, i) => (
              <div key={i} className={`flex flex-col gap-2 ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  
                  <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center shadow-lg ${m.role === 'user' ? 'bg-white text-black' : 'bg-emerald-600 text-white'}`}>
                          {m.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                      </div>
                      
                      <div className={`p-4 rounded-[1.5rem] text-sm leading-relaxed shadow-md ${
                          m.role === 'user' 
                          ? 'bg-white text-black rounded-tr-none' 
                          : 'bg-[#1a1d24] text-white/90 rounded-tl-none border border-white/5'
                      }`}>
                          {/* Markdown support is limited in simple text, but AI formatting usually works well enough as plain text */}
                          <p className={`whitespace-pre-wrap ${language === 'ur' ? 'font-urdu text-base' : 'font-sans'}`}>
                              {m.text}
                          </p>
                      </div>
                  </div>

                  {/* SMART ACTION BUTTON (Triggered if user asked for Expert) */}
                  {m.role === 'model' && m.action === 'whatsapp' && (
                      <div className={`ml-11 ${language === 'ur' ? 'mr-11 ml-0' : ''} animate-in zoom-in duration-300`}>
                          <a 
                            href="https://wa.me/919906123456" 
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center gap-2 shadow-lg transition-transform hover:scale-105 border-b-4 border-[#128C7E] active:border-b-0 active:translate-y-1"
                          >
                              <MessageCircle size={18} /> {t.whatsappBtn}
                          </a>
                      </div>
                  )}
              </div>
          ))}
          
          {isTyping && (
             <div className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-emerald-600/50 flex items-center justify-center"><Bot size={16}/></div>
                <div className="p-4 rounded-[1.5rem] bg-[#1a1d24] rounded-tl-none border border-white/5">
                    <p className="text-xs text-white/50 italic flex items-center gap-2">
                        <Loader2 size={12} className="animate-spin" /> {t.thinking}
                    </p>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-[#0a0c10] border-t border-white/5 fixed bottom-0 left-0 right-0 lg:left-80 z-20">
          <div className="relative max-w-4xl mx-auto">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                className={`w-full bg-[#020408] border border-white/10 rounded-[2rem] py-4 px-6 focus:border-emerald-500 outline-none shadow-inner transition-all ${language === 'ur' ? 'pr-6 pl-14 font-urdu' : 'pl-6 pr-14'}`}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend} className={`absolute top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-500 p-3 rounded-full text-white shadow-lg transition-all active:scale-90 ${language === 'ur' ? 'left-2' : 'right-2'}`}>
                  <Send size={18} className={input ? '' : 'opacity-50'} />
              </button>
          </div>
      </div>
    </div>
  );
}