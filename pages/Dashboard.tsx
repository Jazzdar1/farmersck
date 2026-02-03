import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BellRing, ScanEye, Syringe, Lock, Sun, Moon, MessageCircle, BarChart3, 
  Microscope, X, Volume2, VolumeX, Sparkles, MapPinned, CloudSun, Quote, BookOpen, 
  Clock, AlertTriangle, Flame, Settings, LayoutDashboard, User, Calculator
} from 'lucide-react';
import RotatingLogo from '../components/RotatingLogo';
import DigitalClock from '../components/DigitalClock';

export default function Dashboard() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'standard' | 'high-contrast'>(
    (localStorage.getItem('fck_theme') as any) || 'standard'
  );
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const isGuest = localStorage.getItem('fck_access_mode') !== 'full';
  const userName = localStorage.getItem('fck_user_name') || 'Farmer';

  const [overdueTask, setOverdueTask] = useState<'spray' | 'pesticide' | 'fertilizer' | null>('spray'); 

  useEffect(() => {
    localStorage.setItem('fck_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (overdueTask && !isMuted) {
      const announce = () => playVoiceAlert(overdueTask);
      const timer = setTimeout(announce, 1500);
      const interval = setInterval(announce, 30000); 
      return () => { clearTimeout(timer); clearInterval(interval); };
    }
  }, [overdueTask, isMuted]);

  const playVoiceAlert = (type: 'spray' | 'pesticide' | 'fertilizer') => {
    window.speechSynthesis.cancel();
    if (isMuted) return;
    let message = "";
    switch(type) {
      case 'spray': message = "Emergency! Spray schedule missed. اپنا اسپرے کا شیڈول فوری مکمل کریں۔"; break;
      case 'pesticide': message = "Warning! Pesticide application is overdue. کیڑے مار ادویات کا استعمال کریں۔"; break;
      case 'fertilizer': message = "Alert! Soil nutrition required. کھاد کی خوراک وقت پر ڈالیں۔"; break;
    }
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = 'en-US'; 
    speech.rate = 0.8; 
    window.speechSynthesis.speak(speech);
  };

  const handleToolClick = (path: string, isProtected: boolean) => {
    if (isProtected && isGuest) { setShowRestrictedModal(true); } 
    else { navigate(path); }
  };

  const toolGroups = [
    {
      title: "Essential Services | بنیادی خدمات",
      items: [
        { label: 'Ask Expert AI | ماہر', icon: MessageCircle, path: '/expert', color: 'text-purple-500', protected: true },
        { label: 'Weather Hub | موسم', icon: CloudSun, path: '/weather', color: 'text-cyan-500', protected: false },
        { label: 'Mandi Prices | منڈی', icon: BarChart3, path: '/market', color: 'text-amber-500', protected: false },
        { label: 'Scanner Pro | اسکینر', icon: ScanEye, path: '/fck-scanner', color: 'text-blue-600', protected: true },
      ]
    },
    {
      title: "Orchard Management | باغات کا انتظام",
      items: [
        { label: 'Spray Audit | اسپرے', icon: Syringe, path: '/spray-track', color: 'text-rose-500', protected: true },
        { label: 'Soil Health | مٹی', icon: Microscope, path: '/soil', color: 'text-emerald-600', protected: true },
        { label: 'Dealer Locator | ڈیلر', icon: MapPinned, path: '/dealers', color: 'text-orange-500', protected: true },
      ]
    },
    {
      title: "System Control | سسٹم کنٹرول",
      items: [
        { label: 'Admin Station | اسٹیشن', icon: Settings, path: '/admin', color: 'text-slate-400', protected: false }, // Set protected to false so you can reach the Admin Login directly
      ]
    }
  ];

  return (
    <div className={`p-4 md:p-10 space-y-8 text-right min-h-screen transition-all duration-1000 
      ${overdueTask === 'spray' ? 'animate-pulse bg-rose-950/20' : theme === 'high-contrast' ? 'bg-black text-yellow-400' : 'bg-slate-950 text-white'}`} 
      dir="rtl">
      
      {showRestrictedModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80">
          <div className="bg-slate-900 border-2 border-emerald-500/30 w-full max-w-md rounded-[3rem] p-10 relative text-center">
            <button onClick={() => setShowRestrictedModal(false)} className="absolute top-6 right-6 text-white/40"><X /></button>
            <Lock className="text-emerald-500 mx-auto mb-6" size={64} />
            <h2 className="text-3xl font-black font-urdu text-white mb-4">رسائی محدود ہے</h2>
            <button onClick={() => navigate('/farmer-portal')} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase shadow-xl">Sign In</button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/5 p-6 rounded-[2.5rem] border border-white/10 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="animate-revolve"><RotatingLogo size="sm" /></div>
          <div className="text-left border-l border-white/10 pl-4">
            <p className="text-[10px] font-black uppercase text-emerald-500">{isGuest ? 'Guest' : `Farmer: ${userName}`}</p>
            <DigitalClock /> 
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-2xl transition-all ${isMuted ? 'bg-rose-500 text-white' : 'bg-white/10 text-emerald-400'}`}>
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
          <button onClick={() => setTheme(theme === 'standard' ? 'high-contrast' : 'standard')} className="p-4 bg-white/10 rounded-2xl text-cyan-400 hover:bg-white/20 transition-all">
            {theme === 'standard' ? <Moon size={24} /> : <Sun size={24} className="text-yellow-400" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AlertButton onClick={() => playVoiceAlert('spray')} label="CRITICAL SPRAY" sub="فوری اسپرے" color="bg-rose-600" isGlow={overdueTask === 'spray'} />
        <AlertButton onClick={() => playVoiceAlert('pesticide')} label="Pesticide Alert" sub="کیڑے مار دوا" color="bg-orange-500" isGlow={overdueTask === 'pesticide'} />
        <AlertButton onClick={() => playVoiceAlert('fertilizer')} label="Fertilizer Alert" sub="کھاد" color="bg-blue-500" isGlow={overdueTask === 'fertilizer'} />
      </div>

      <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/60 p-8 md:p-10 rounded-[3.5rem] border border-emerald-500/20 shadow-2xl relative overflow-hidden">
        <Quote className="absolute -left-5 -top-5 text-emerald-500/10" size={180} />
        <h2 className="text-3xl md:text-4xl font-black font-urdu text-emerald-400 leading-tight relative z-10 text-right">خوش آمدید، {userName}!</h2>
        <div className="relative z-10 my-6 border-y border-white/5 py-6 font-urdu text-2xl md:text-3xl text-white italic text-right">"ذرا نم ہو تو یہ مٹی بڑی زرخیز ہے ساقی"</div>
        <div className="relative z-10 flex flex-row-reverse items-center gap-4">
          <BookOpen size={24} className="text-emerald-400" />
          <p className="text-lg md:text-xl font-urdu text-emerald-100/80 italic">"خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ"</p>
        </div>
      </div>

      <div className="space-y-12 pb-20">
        {toolGroups.map((group, idx) => (
          <div key={idx} className="space-y-4">
            <p className="text-[10px] font-black uppercase text-emerald-500/40 tracking-[0.3em] px-4 font-urdu">{group.title}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {group.items.map(tool => (
                <div key={tool.label} onClick={() => handleToolClick(tool.path, tool.protected)} className="bg-white/5 p-6 md:p-8 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/10 transition-all active:scale-95 group relative shadow-inner">
                  {isGuest && tool.protected && <Lock size={12} className="absolute top-4 left-4 text-amber-500/40" />}
                  <tool.icon className={`${tool.color} mb-3 group-hover:scale-110 transition-transform`} size={28} />
                  <p className="font-bold text-[10px] uppercase text-white/80 tracking-widest">{tool.label}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertButton({ onClick, label, sub, color, isGlow }: any) {
  return (
    <button onClick={onClick} className={`${color} p-6 rounded-[2.5rem] flex items-center justify-between text-white shadow-xl transition-all relative overflow-hidden ${isGlow ? 'ring-8 ring-rose-500/30 scale-105 animate-bounce shadow-[0_0_50px_rgba(225,29,72,0.6)]' : 'opacity-40'}`}>
      <div className="text-right z-10">
        <div className="flex items-center gap-2">
           <h3 className="text-lg font-black uppercase leading-none">{label}</h3>
           {isGlow && <Flame size={18} className="text-yellow-400 animate-pulse" />}
        </div>
        <p className="text-sm font-urdu opacity-80 mt-1 font-bold">{sub}</p>
      </div>
      <Volume2 className={isGlow ? "animate-spin" : ""} size={24} />
    </button>
  );
}