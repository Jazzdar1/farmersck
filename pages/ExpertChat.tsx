import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Send, Mic, MicOff, Bot, User, Sparkles, 
  Volume2, VolumeX, ShieldCheck, Quote, Loader2 
} from 'lucide-react';
import { askAI } from '../services/puterService';

const ExpertChat: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [headerInfo, setHeaderInfo] = useState({ hadith: '', greeting: '' });
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  // 1. Voice-to-Text: Kisan ki awaz ko Urdu mein badalna
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser support missing.");
    const recognition = new SpeechRecognition();
    recognition.lang = 'ur-PK'; 
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e: any) => setInput(e.results[0][0].transcript);
    recognition.start();
  };

  // 2. Text-to-Voice: AI ke jawab ko Urdu mein sunana
  const speakUrdu = (text: string) => {
    window.speechSynthesis.cancel(); // Purani awaz ko rokna
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.lang = 'ur-PK'; // Urdu language script and voice
    msg.rate = 0.9; // Thodi dheeri awaz taake samajh aa jaye
    msg.onstart = () => setIsSpeaking(true);
    msg.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(msg);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const prompt = `System: You are 'FC Kashmir Expert'. Answer as a wise Kashmiri agriculture expert. 
      Use Real Urdu Script (اردو). Question: ${input}`;
      const aiRes = await askAI(prompt, false);
      const botMsg = { role: 'bot', text: aiRes || "معذرت، میں ابھی جواب نہیں دے پا رہا ہوں۔" };
      setMessages(prev => [...prev, botMsg]);
      
      // Automatic jawab sunana
      speakUrdu(botMsg.text);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "نیٹ ورک کا مسئلہ ہے۔" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[85vh] flex flex-col space-y-4 animate-in fade-in duration-700">
      <div className="bg-emerald-900 rounded-[3rem] p-8 text-white shadow-2xl text-right" dir="rtl">
        <h2 className="text-2xl font-black text-emerald-400">{headerInfo.greeting || 'خوش آمدید'}</h2>
        <p className="text-sm italic opacity-80">{headerInfo.hadith || 'محنت میں برکت ہے۔'}</p>
      </div>

      <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-[3.5rem] border shadow-inner p-8 overflow-y-auto no-scrollbar space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-6 rounded-[2.5rem] shadow-sm relative ${m.role === 'user' ? 'bg-slate-100 text-slate-800' : 'bg-emerald-900 text-white'}`}>
              <p className="text-lg font-medium leading-relaxed" dir={m.role === 'bot' ? 'rtl' : 'ltr'}>{m.text}</p>
              {m.role === 'bot' && (
                <button onClick={() => speakUrdu(m.text)} className="absolute -left-12 top-1/2 -translate-y-1/2 p-3 bg-emerald-100 text-emerald-900 rounded-full hover:bg-emerald-200 shadow-md">
                  <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce' : ''}`} />
                </button>
              )}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-right text-[10px] font-bold text-emerald-600 animate-pulse">ماہر جواب تیار کر رہا ہے...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="bg-white p-4 rounded-[3rem] shadow-2xl border flex items-center gap-3 border-emerald-100">
        <button onClick={startListening} className={`p-5 rounded-full ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-100 text-emerald-700'}`}>
          {isListening ? <MicOff /> : <Mic />}
        </button>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="بولیں یا لکھیں..." 
          className="flex-1 bg-transparent p-4 outline-none font-bold text-right" 
          dir="rtl" 
        />
        <button onClick={handleSend} className="bg-emerald-900 text-white p-5 rounded-[2rem] shadow-xl"><Send /></button>
      </div>
    </div>
  );
};

export default ExpertChat;