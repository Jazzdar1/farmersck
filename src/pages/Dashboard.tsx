import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sun, Moon, Heart, Star, Sprout, Lock, Layout, 
  LogIn, Megaphone, X 
} from 'lucide-react';
import RotatingLogo from '../components/RotatingLogo';
import DigitalClock from '../components/DigitalClock';
import { DashboardTile, DEFAULT_MAIN_TILES, ICON_MAP } from '../utils/tileHelpers';

// ... (Existing Greetings/Wisdom arrays keep same) ...
const GREETINGS = [
  { ur: "خوش آمدید، اے دھرتی کے محافظ", en: "Welcome, Protector of the Earth" },
  { ur: "جی آیا نوں، کسان ویر", en: "Welcome, Brother Farmer" },
  { ur: "السلام علیکم، رزق کے معمار", en: "Greetings, Architect of Provision" }
];
const WISDOM_POOL = [
  { ur: "ذرا نم ہو تو یہ مٹی بڑی زرخیز ہے ساقی", en: "With just a little moisture, this soil is incredibly fertile.", author: "Allama Iqbal" },
  { ur: "بہترین انسان وہ ہے جو دوسروں کو فائدہ پہنچائے", en: "The best of people are those that bring most benefit to others.", author: "Hadith" }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'standard' | 'high-contrast'>((localStorage.getItem('fck_theme') as any) || 'standard');
  const [tiles, setTiles] = useState<DashboardTile[]>([]); 
  const [currentQuote, setCurrentQuote] = useState(WISDOM_POOL[0]);
  const [currentGreet, setCurrentGreet] = useState(GREETINGS[0]);
  const [user, setUser] = useState<any>(null);
  
  // 📢 NEW: FLASH NEWS STATE
  const [flashNews, setFlashNews] = useState<any[]>([]);

  useEffect(() => {
    setCurrentQuote(WISDOM_POOL[Math.floor(Math.random() * WISDOM_POOL.length)]);
    setCurrentGreet(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
    
    const initDashboard = async () => {
        const puter = (window as any).puter;
        if (puter?.auth) {
            const pUser = await puter.auth.getUser();
            setUser(pUser);
        }
        
        // Tiles
        let data = DEFAULT_MAIN_TILES;
        if (puter?.kv) {
            const saved = await puter.kv.get('fck_main_tiles');
            if (saved) data = JSON.parse(saved);
        }
        setTiles(data.filter(t => t.isActive));

        // 📢 FETCH NEWS
        if (puter?.kv) {
            const news = await puter.kv.get('fck_flash_news');
            if (news) setFlashNews(JSON.parse(news));
        }
    };
    initDashboard();
  }, []);

  const handleToolClick = (path: string, isProtected: boolean = false) => {
    if (isProtected && !user) navigate('/farmer-login');
    else navigate(path);
  };

  return (
    <div className={`p-4 md:p-10 space-y-8 text-right min-h-screen transition-all duration-500 ${theme === 'high-contrast' ? 'bg-black text-yellow-400' : 'bg-[#050505] text-white'}`} dir="rtl">
      
      {/* 📢 FLASH NEWS BANNER */}
      {flashNews.length > 0 && (
          <div className="space-y-2">
              {flashNews.map((news) => (
                  <div key={news.id} className={`p-4 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-2 ${
                      news.type === 'Critical' ? 'bg-rose-500 text-white' : 
                      news.type === 'Warning' ? 'bg-amber-500 text-black' : 
                      'bg-blue-600 text-white'
                  }`}>
                      <button onClick={() => setFlashNews(flashNews.filter(n => n.id !== news.id))} className="opacity-60 hover:opacity-100"><X size={18}/></button>
                      <div className="text-right flex-1 mr-4">
                          <p className="font-black uppercase text-xs tracking-widest flex items-center justify-end gap-2">
                              {news.title} <Megaphone size={14} className="animate-bounce" />
                          </p>
                          <p className="text-sm font-urdu leading-tight mt-1 opacity-90">{news.message}</p>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* TOP BAR (Same as before) */}
      <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl p-4 rounded-[2rem] border border-white/10 shadow-2xl">
        <div className="flex items-center gap-4">
          <RotatingLogo size="sm" />
          <div className="text-left border-l border-white/10 pl-4">
            {user ? (
                <div><p className="text-[9px] font-black uppercase text-emerald-500 tracking-widest flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> ONLINE</p><p className="font-bold text-white text-sm">{user.username}</p></div>
            ) : (
                <div className="flex flex-col"><p className="text-[9px] font-black uppercase text-white/40 tracking-widest">GUEST MODE</p><button onClick={() => navigate('/farmer-login')} className="text-xs font-bold text-emerald-400 hover:text-white transition-colors flex items-center gap-1">Login Now <LogIn size={12} /></button></div>
            )}
          </div>
        </div>
        <button onClick={() => setTheme(theme === 'standard' ? 'high-contrast' : 'standard')} className="p-3 bg-white/10 rounded-2xl text-emerald-400 active:scale-90 transition-all hover:bg-white/20">
          {theme === 'standard' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {/* HERO SECTION (Same) */}
      <div className="bg-gradient-to-br from-emerald-900 to-slate-950 p-8 md:p-12 rounded-[3rem] border border-emerald-500/20 shadow-2xl relative overflow-hidden group">
         <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400"><Star size={14} fill="currentColor" /><span className="text-sm font-bold font-nastaleeq tracking-wide">{currentGreet.ur}</span></div>
          <h2 className="text-3xl md:text-5xl font-black font-nastaleeq text-white leading-tight">{user ? `${user.username} صاحب!` : 'محترم کسان دوست!'}</h2>
          <div className="my-6 border-r-4 border-emerald-500 pr-6"><p className="text-2xl md:text-3xl text-white/90 leading-[1.8] font-nastaleeq italic">"{currentQuote.ur}"</p></div>
        </div>
        <Sprout className="absolute -right-10 -bottom-10 text-emerald-500/5 group-hover:rotate-12 transition-transform duration-700" size={300} />
      </div>

      {/* TILES (Gradients Applied) */}
      <h3 className="text-white/40 font-bold text-sm uppercase tracking-widest pr-2">Quick Access</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 pb-20">
        {tiles.map(tile => {
            const IconComp = ICON_MAP[tile.icon] || Layout;
            const isLocked = tile.isLocked && !user;
            const gradientClass = tile.gradient ? `bg-gradient-to-br ${tile.gradient}` : 'bg-gray-800';
            const shadowClass = tile.shadow || 'shadow-emerald-500/20';

            return (
                <div key={tile.id} onClick={() => handleToolClick(tile.link, tile.isLocked)} className={`${gradientClass} p-6 rounded-[2.5rem] relative overflow-hidden h-[180px] flex flex-col justify-between cursor-pointer hover:scale-[1.02] active:scale-95 transition-all duration-300 group shadow-xl ${shadowClass}`}>
                  <IconComp className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-125 transition-transform duration-500 rotate-12" size={120} />
                  {isLocked && <Lock size={16} className="absolute top-6 left-6 text-white/60 bg-black/20 p-1 rounded-md" />}
                  <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-2xl flex items-center justify-center border border-white/20 shadow-lg group-hover:rotate-6 transition-transform"><IconComp size={24} className="text-white drop-shadow-md" /></div>
                  <div className="relative z-10"><h3 className="font-black font-nastaleeq text-lg text-white leading-tight drop-shadow-md mb-1">{tile.label}</h3><p className="text-[9px] font-black uppercase tracking-widest text-white/70">{tile.sub}</p></div>
                </div>
            );
        })}
      </div>
    </div>
  );
}