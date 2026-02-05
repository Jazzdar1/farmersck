import React, { useState, useRef, useEffect } from 'react';
import { 
  ScanEye, Camera, Loader2, ShieldCheck, Sprout, 
  Volume2, Languages, RefreshCcw, MessageSquare, Send, Share2 
} from 'lucide-react';
import { askAI } from '../services/puterService';

const SmartDiagnose: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [langMode, setLangMode] = useState<'ur' | 'en'>('ur');
  const [analysis, setAnalysis] = useState<{ urdu: string, english: string } | null>(null);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [userQuery, setUserQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [chatHistory]);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMode === 'ur' ? 'ur-PK' : 'en-US';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  const handleScan = async () => {
    if (!selectedImage) return;
    setLoading(true);
    setAnalysis(null);
    setChatHistory([]);

    try {
      const prompt = `VISION TASK: Analyze this plant/fruit image. Identify disease and cure. 
      Respond ONLY in JSON: {"urdu": "بیماری اور علاج کی تفصیل", "english": "Disease and cure summary"}`;
      const res = await askAI(prompt, true, selectedImage);
      const match = res?.match(/\{.*\}/s);
      if (match) {
        const data = JSON.parse(match[0]);
        setAnalysis(data);
        speak(langMode === 'ur' ? data.urdu : data.english);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const askFollowUp = async () => {
    if (!userQuery.trim() || !analysis) return;
    const currentQuery = userQuery;
    setChatHistory(prev => [...prev, { role: 'user', text: currentQuery }]);
    setUserQuery('');
    setChatLoading(true);

    try {
      const chatPrompt = `The previous diagnosis was: ${analysis.english}. User asks: ${currentQuery}. 
      Answer in ${langMode === 'ur' ? 'Real Urdu Script' : 'Simple English'}. Keep it short.`;
      const res = await askAI(chatPrompt, false);
      setChatHistory(prev => [...prev, { role: 'bot', text: res }]);
      speak(res);
    } catch (e) { console.error(e); }
    setChatLoading(false);
  };

  const shareToWhatsApp = () => {
    if (!analysis) return;
    const chatDetails = chatHistory.map(m => `${m.role === 'user' ? 'Kisan' : 'AI'}: ${m.text}`).join('\n');
    const message = `*FC Kashmir: Agir-Report*\n\n*Diagnosis:* ${analysis.english}\n*اردو:* ${analysis.urdu}\n\n*Expert Chat:*\n${chatDetails}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-32 px-4">
      {/* Header with Language Toggle */}
      <div className="bg-emerald-900 p-8 rounded-[3rem] flex items-center justify-between text-white shadow-2xl">
        <button onClick={() => setLangMode(langMode === 'ur' ? 'en' : 'ur')} className="bg-white/10 px-6 py-2 rounded-xl border border-white/20 font-bold hover:bg-white/20">
          <Languages className="w-5 h-5" /> {langMode === 'ur' ? 'English' : 'اردو'}
        </button>
        <h2 className="text-2xl font-black font-urdu" dir="rtl">اسمارٹ اے آئی تشخیص</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        {/* Scanner Side */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[3.5rem] border shadow-sm space-y-6">
            <div onClick={() => fileInputRef.current?.click()} className="w-full aspect-square bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200 flex items-center justify-center cursor-pointer overflow-hidden relative">
              {selectedImage ? <img src={selectedImage} className="w-full h-full object-cover" /> : <Camera className="text-slate-300 w-16 h-16" />}
            </div>
            <input type="file" ref={fileInputRef} hidden onChange={(e) => {
               const reader = new FileReader();
               reader.onload = () => setSelectedImage(reader.result as string);
               reader.readAsDataURL(e.target.files![0]);
            }} accept="image/*" />
            <button onClick={handleScan} disabled={!selectedImage || loading} className="w-full py-5 bg-emerald-900 text-white rounded-[2rem] font-black shadow-xl flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin" /> : <><ScanEye /> Start Scan</>}
            </button>
          </div>

          {analysis && (
            <button onClick={shareToWhatsApp} className="w-full py-4 bg-green-600 text-white rounded-[2rem] font-black shadow-lg flex items-center justify-center gap-3 hover:bg-green-700 transition-all">
              <Share2 /> WhatsApp Report Bhejen
            </button>
          )}
        </div>

        {/* AI Result & Chat Side */}
        <div className="bg-emerald-950 rounded-[4rem] text-white shadow-2xl border-4 border-emerald-900 flex flex-col overflow-hidden h-full min-h-[600px]">
          <div className="p-10 flex-1 overflow-y-auto no-scrollbar space-y-8">
            {analysis ? (
              <div className="space-y-6 animate-in fade-in" dir={langMode === 'ur' ? 'rtl' : 'ltr'}>
                <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">{langMode === 'ur' ? 'تشخیص و حل' : 'Initial Diagnosis'}</h4>
                <p className="text-2xl font-bold font-urdu leading-relaxed">{langMode === 'ur' ? analysis.urdu : analysis.english}</p>
                <button onClick={() => speak(langMode === 'ur' ? analysis.urdu : analysis.english)} className="bg-white/10 p-3 rounded-xl"><Volume2 /></button>
                
                {/* Follow-up History */}
                <div className="pt-8 border-t border-white/5 space-y-4">
                  {chatHistory.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-emerald-800' : 'bg-white/5 border border-white/10'}`}>
                        <p className={langMode === 'ur' ? 'font-urdu' : ''}>{m.text}</p>
                      </div>
                    </div>
                  ))}
                  {chatLoading && <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />}
                  <div ref={chatEndRef} />
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4 py-20">
                <MessageSquare className="w-16 h-16" />
                <p className="font-bold uppercase text-[10px]">Scanning ke baad yahan chat karein</p>
              </div>
            )}
          </div>

          {/* Chat Input Dock */}
          {analysis && (
            <div className="p-6 bg-black/20 border-t border-white/5 flex gap-3">
              <input 
                value={userQuery} 
                onChange={(e) => setUserQuery(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && askFollowUp()}
                placeholder={langMode === 'ur' ? "مزید سوال پوچھیں..." : "Ask follow-up..."}
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none font-urdu"
                dir={langMode === 'ur' ? 'rtl' : 'ltr'}
              />
              <button onClick={askFollowUp} className="bg-emerald-500 text-white p-4 rounded-2xl shadow-lg hover:bg-emerald-400">
                <Send className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartDiagnose;