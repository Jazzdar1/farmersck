import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ScanEye, Lock, Sun, Moon, MessageCircle, BarChart3, 
  CloudSun, User, BookOpen, Heart, Star, Sprout, FlaskConical 
} from 'lucide-react';
import RotatingLogo from '../components/RotatingLogo';
import DigitalClock from '../components/DigitalClock';

const GREETINGS = [
  { ur: "خوش آمدید، اے دھرتی کے محافظ", en: "Welcome, Protector of the Earth" },
  { ur: "جی آیا نوں، کسان ویر", en: "Welcome, Brother Farmer" },
  { ur: "السلام علیکم، رزق کے معمار", en: "Greetings, Architect of Provision" }
];

const WISDOM_POOL = [
  { ur: "ذرا نم ہو تو یہ مٹی بڑی زرخیز ہے ساقی", en: "With just a little moisture, this soil is incredibly fertile.", author: "Allama Iqbal" },
  { ur: "عمل سے زندگی بنتی ہے جنت بھی جہنم بھی", en: "Life is made by action, both Heaven and Hell.", author: "Allama Iqbal" },
  { ur: "بہترین انسان وہ ہے جو دوسروں کو فائدہ پہنچائے", en: "The best of people are those that bring most benefit to others.", author: "Hadith" }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'standard' | 'high-contrast'>((localStorage.getItem('fck_theme') as any) || 'standard');
  const [currentQuote, setCurrentQuote] = useState(WISDOM_POOL[0]);
  const [currentGreet, setCurrentGreet] = useState(GREETINGS[0]);
  
  const isGuest = localStorage.getItem('fck_access_mode') !== 'full';
  const userName = localStorage.getItem('fck_user_name') || 'Kisaan';

  useEffect(() => {
    setCurrentQuote(WISDOM_POOL[Math.floor(Math.random() * WISDOM_POOL.length)]);
    setCurrentGreet(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
  }, []);

  const handleToolClick = (path: string, isProtected: boolean) => {
    if (isProtected && isGuest) navigate('/farmer-portal');
    else navigate(path);
  };

  return (
    <div className={`p-4 md:p-10 space-y-6 text-right min-h-screen transition-all duration-500 ${theme === 'high-contrast' ? 'bg-black text-yellow-400' : 'bg-[#050505] text-white'}`} dir="rtl">
      
      {/* 1. TOP BAR */}
      <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl p-4 rounded-[2rem] border border-white/10 shadow-2xl">
        <div className="flex items-center gap-4">
          <RotatingLogo size="sm" />
          <div className="text-left border-l border-white/10 pl-4">
            <p className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">{isGuest ? 'GUEST' : 'PREMIUM'}</p>
            <DigitalClock /> 
          </div>
        </div>
        <button onClick={() => setTheme(theme === 'standard' ? 'high-contrast' : 'standard')} className="p-3 bg-white/10 rounded-2xl text-emerald-400 active:scale-90 transition-all">
          {theme === 'standard' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {/* 2. HEADER */}
      <div className="bg-gradient-to-br from-emerald-600/20 via-slate-900 to-emerald-950/40 p-10 rounded-[3rem] border border-emerald-500/20 shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-bold font-nastaleeq tracking-wide">{currentGreet.ur}</span>
          </div>

          <h2 className="text-4xl font-black font-nastaleeq text-white">{userName} صاحب!</h2>

          <div className="my-6 border-r-4 border-emerald-500 pr-6">
            <p className="text-3xl md:text-5xl text-white leading-[1.8] font-nastaleeq italic drop-shadow-lg">
              "{currentQuote.ur}"
            </p>
            <p className="text-sm md:text-lg text-emerald-100/50 font-sans mt-4 italic">
              {currentQuote.en}
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mt-4 flex items-center gap-2">
              <Heart size={10} fill="currentColor" className="text-rose-500" /> {currentQuote.author}
            </p>
          </div>
        </div>
        <Sprout className="absolute -right-10 -bottom-10 text-emerald-500/5 group-hover:rotate-12 transition-transform duration-700" size={280} />
      </div>

      {/* 3. TILES GRID (Only Working Tiles) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 pb-20">
        
        {/* Core Features - 100% Working */}
        <ToolTile 
          onClick={() => handleToolClick('/my-portal', true)} 
          icon={User} label="میرا پورٹل" sub="MY PORTAL" 
          bg="bg-blue-600" isLocked={isGuest} 
        />
        
        <ToolTile 
          onClick={() => handleToolClick('/expert', false)} 
          icon={MessageCircle} label="ماہر سے رابطہ" sub="AI EXPERT" 
          bg="bg-purple-600" 
        />
        
        <ToolTile 
          onClick={() => handleToolClick('/weather', false)} 
          icon={CloudSun} label="موسم کا حال" sub="WEATHER" 
          bg="bg-cyan-600" 
        />
        
        <ToolTile 
          onClick={() => handleToolClick('/mandi', false)} 
          icon={BarChart3} label="منڈی ریٹ" sub="MARKET RATES" 
          bg="bg-amber-600" 
        />
        
        <ToolTile 
          onClick={() => handleToolClick('/fck-scanner', false)} 
          icon={ScanEye} label="اسکینر" sub="SCANNER" 
          bg="bg-rose-600" 
        />
        
        <ToolTile 
          onClick={() => handleToolClick('/soil', true)} 
          icon={FlaskConical} label="مٹی کا ٹیسٹ" sub="SOIL TEST" 
          bg="bg-indigo-600" isLocked={isGuest} 
        />

      </div>
    </div>
  );
}

function ToolTile({ onClick, icon: Icon, label, sub, bg, isLocked }: any) {
  return (
    <div 
      onClick={onClick} 
      className={`${bg} p-5 rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 active:scale-95 transition-all group relative overflow-hidden h-[160px] shadow-lg shadow-${bg.split('-')[1]}-500/20`}
    >
      {isLocked && <Lock size={12} className="absolute top-4 left-4 text-white/40" />}
      <Icon className="absolute -right-3 -top-3 text-black/20 group-hover:scale-125 transition-transform duration-500" size={90} />
      
      <div className="bg-white/20 p-4 rounded-[1.5rem] mb-2 backdrop-blur-md border border-white/10">
        <Icon size={24} className="text-white" />
      </div>
      
      <h3 className="font-black font-nastaleeq text-sm text-white leading-tight">{label}</h3>
      <p className="text-[8px] font-black uppercase tracking-widest text-white/50 mt-1">{sub}</p>
    </div>
  );
}