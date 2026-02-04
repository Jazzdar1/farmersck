import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Volume2, VolumeX, AlertTriangle, CheckCircle, 
  Calendar, Clock, User, MessageCircle, ScanEye, BarChart3,
  CloudSun, FlaskConical, Tractor, BookOpen, Calculator, 
  Activity, Users, BellRing, Quote, LogOut, Wallet, TrendingUp, PieChart, ChevronLeft
} from 'lucide-react';

export default function FarmerPortal() {
  const navigate = useNavigate();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [activeAlert, setActiveAlert] = useState<any>(null);
  const [newDate, setNewDate] = useState("");
  const [quote, setQuote] = useState({ text: "", author: "" });
  const puter = (window as any).puter;

  // Mock Data for Finance Card
  const stats = { netProfit: "96,700" };

  const quotes = [
    { text: "اپنے من میں ڈوب کر پا جا سراغِ زندگی", author: "علامہ اقبال" },
    { text: "جس نے پودا لگایا اور اس کی حفاظت کی، اسے صدقہ کا ثواب ملے گا۔", author: "حدیثِ مبارکہ" },
    { text: "ستاروں سے آگے جہاں اور بھی ہیں", author: "علامہ اقبال" }
  ];

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const playVoice = useCallback((stage: string) => {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    const msgEn = `Attention! You have missed the ${stage} Spray.`;
    const msgUr = `توجہ فرمائیں! آپ کا ${stage} کا اسپرے چھوٹ گیا ہے۔`;
    const speak = (text: string, lang: string) => {
      const s = new SpeechSynthesisUtterance(text);
      s.lang = lang; s.rate = 0.85;
      window.speechSynthesis.speak(s);
    };
    speak(msgEn, 'en-US');
    speak(msgUr, 'ur-PK');
  }, [voiceEnabled]);

  useEffect(() => {
    const scan = async () => {
      if (!puter) return;
      const res = await puter.kv.get('fck_spray_db');
      const data = JSON.parse(res || "[]");
      const overdue = data.find((t: any) => !t.isDone && new Date(t.dueDate) < new Date());
      if (overdue && !activeAlert) {
        setActiveAlert(overdue);
        playVoice(overdue.stage);
      }
    };
    scan();
  }, [puter, playVoice, activeAlert]);

  const handleTaskUpdate = async (type: 'done' | 'reschedule') => {
    if (!puter || !activeAlert) return;
    const res = await puter.kv.get('fck_spray_db');
    let data = JSON.parse(res || "[]");
    data = data.map((t: any) => {
      if (t.id === activeAlert.id) {
        if (type === 'done') return { ...t, isDone: true };
        if (type === 'reschedule' && newDate) return { ...t, dueDate: new Date(newDate).toISOString() };
      }
      return t;
    });
    await puter.kv.set('fck_spray_db', JSON.stringify(data));
    window.speechSynthesis.cancel();
    setActiveAlert(null);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden pb-10" dir="rtl">
      
      {/* HEADER */}
      <header className="bg-[#1A1A1A] p-6 flex justify-between items-center border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-[#FFC107] p-2 rounded-xl text-black shadow-lg"><ShieldCheck size={20} /></div>
          <h1 className="text-xl font-black font-nastaleeq italic">فارمر پورٹل</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/farm-manager')} className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20"><Wallet size={20} /></button>
          <button onClick={() => setVoiceEnabled(!voiceEnabled)} className={`p-2 rounded-xl ${voiceEnabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
            {voiceEnabled ? <Volume2 size={20}/> : <VolumeX size={20}/>}
          </button>
          <button onClick={() => { localStorage.clear(); navigate('/'); }} className="p-2 bg-rose-600/10 text-rose-500 rounded-xl border border-rose-600/20"><LogOut size={20} /></button>
        </div>
      </header>

      {/* FINANCE CARD */}
      <div className="p-6">
        <div onClick={() => navigate('/farm-manager')} className="relative p-8 rounded-[3rem] bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/20 overflow-hidden cursor-pointer active:scale-95 transition-all group shadow-2xl">
          <div className="absolute -left-10 -top-10 opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-1000"><PieChart size={200}/></div>
          <div className="relative z-10 flex justify-between items-end">
            <div>
              <h4 className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.3em] mb-2">نیٹ منافع (Net Profit)</h4>
              <p className="text-4xl font-black text-white leading-none tracking-tighter">₹{stats.netProfit}</p>
              <p className="text-[9px] font-black uppercase text-white/30 mt-3 tracking-widest flex items-center gap-2">تفصیل دیکھیں <ChevronLeft size={10} /></p>
            </div>
            <div className="bg-emerald-500 p-4 rounded-2xl text-black"><TrendingUp size={24}/></div>
          </div>
        </div>
      </div>

      {/* QUOTE SECTION */}
      <div className="px-6 mb-2">
        <div className="bg-gradient-to-r from-[#1A1A1A] to-black p-8 rounded-[3rem] border border-white/5 relative text-center">
          <Quote className="absolute top-4 right-4 text-white/5" size={40} />
          <p className="text-2xl font-nastaleeq leading-relaxed text-[#FFC107] italic mb-2">"{quote.text}"</p>
          <p className="text-[10px] font-black uppercase text-white/30">— {quote.author}</p>
        </div>
      </div>

      {/* TILES GRID */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Tile onClick={() => navigate('/my-portal')} icon={User} label="پروفائل" sub="PROFILE" bg="bg-blue-600" />
        <Tile onClick={() => navigate('/farm-manager')} icon={Calculator} label="فارم منیجر" sub="FINANCE" bg="bg-emerald-600" />
        <Tile onClick={() => navigate('/fck-scanner')} icon={ScanEye} label="اسکینر پرو" sub="DISEASE SCAN" bg="bg-[#FFC107]" iconColor="text-black" />
        <Tile onClick={() => navigate('/expert')} icon={MessageCircle} label="ماہرانہ رائے" sub="AI EXPERT" bg="bg-purple-600" />
        <Tile onClick={() => navigate('/market')} icon={BarChart3} label="منڈی ریٹ" sub="MARKET RATES" bg="bg-amber-600" />
        <Tile onClick={() => navigate('/weather')} icon={CloudSun} label="موسمی حال" sub="WEATHER HUB" bg="bg-cyan-600" />
        <Tile onClick={() => navigate('/soil')} icon={FlaskConical} label="مٹی کا ٹیسٹ" sub="SOIL ANALYSIS" bg="bg-indigo-600" />
        <Tile onClick={() => navigate('/news')} icon={BookOpen} label="زرعی خبریں" sub="AGRI NEWS" bg="bg-sky-600" />
      </div>

      {/* MODAL REMAINING... */}
      {activeAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
          <div className="bg-[#1A1A1A] w-full max-w-md rounded-[3rem] border border-rose-500/30 p-8 text-center animate-in zoom-in shadow-2xl">
            <div className="bg-rose-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce">
              <BellRing size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2 uppercase">Spray Alert!</h2>
            <p className="text-xs text-white/40 font-nastaleeq mb-6 italic">گزارش ہے کہ شیڈول کے مطابق اسپرے مکمل کریں۔</p>
            <div className="space-y-4">
              <input type="date" className="w-full bg-white/5 p-4 rounded-2xl text-[#FFC107] font-black text-center outline-none border border-white/10" onChange={(e) => setNewDate(e.target.value)} />
              <button onClick={() => handleTaskUpdate('done')} className="w-full py-5 bg-emerald-600 text-black font-black rounded-2xl text-[12px] uppercase tracking-widest">MARK AS DONE</button>
              <button onClick={() => handleTaskUpdate('reschedule')} disabled={!newDate} className="w-full py-5 bg-white/5 border border-white/10 text-[#FFC107] font-black rounded-2xl text-[10px] uppercase opacity-50">RESCHEDULE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Tile({ onClick, icon: Icon, label, sub, bg, iconColor = "text-white" }: any) {
  return (
    <div onClick={onClick} className="bg-[#1A1A1A] p-6 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center h-[185px] relative overflow-hidden active:scale-95 transition-all cursor-pointer">
      <div className={`${bg} ${iconColor} p-3 rounded-xl mb-4 shadow-lg`}><Icon size={22} /></div>
      <p className="text-white font-black text-[11px] uppercase tracking-widest mb-1">{sub}</p>
      <h3 className="text-white/40 font-black font-nastaleeq text-[12px]">{label}</h3>
    </div>
  );
}