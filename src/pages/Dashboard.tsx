import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sun, Moon, Star, Sprout, Lock, Layout, 
  LogIn, Megaphone, X 
} from 'lucide-react';
import RotatingLogo from '../components/RotatingLogo';
import { DashboardTile, DEFAULT_MAIN_TILES, ICON_MAP } from '../utils/tileHelpers';

// Dual Language Greetings
const GREETINGS = [
  { ur: "خوش آمدید، اے دھرتی کے محافظ", en: "Welcome, Protector of the Earth" }
];
const WISDOM_POOL = [
  { ur: "ذرا نم ہو تو یہ مٹی بڑی زرخیز ہے ساقی", en: "With just a little moisture, this soil is incredibly fertile." }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'standard' | 'high-contrast'>((localStorage.getItem('fck_theme') as any) || 'standard');
  const [tiles, setTiles] = useState<DashboardTile[]>([]); 
  const [currentQuote, setCurrentQuote] = useState(WISDOM_POOL[0]);
  const [currentGreet, setCurrentGreet] = useState(GREETINGS[0]);
  const [user, setUser] = useState<any>(null);
  const [flashNews, setFlashNews] = useState<any[]>([]);

  useEffect(() => {
    const initDashboard = async () => {
        try {
            const puter = (window as any).puter;
            if (puter?.auth) {
                try {
                    const pUser = await puter.auth.getUser();
                    if (pUser) setUser(pUser);
                } catch (err) {}
            }
            
            let data = DEFAULT_MAIN_TILES;
            if (puter?.kv) {
                const saved = await puter.kv.get('fck_main_tiles');
                if (saved) data = JSON.parse(saved);
            }
            setTiles(data.filter(t => t.isActive));

            if (puter?.kv) {
                const news = await puter.kv.get('fck_flash_news');
                if (news) setFlashNews(JSON.parse(news));
            }
        } catch (error) {}
    };
    initDashboard();
  }, []);

  const handleToolClick = (path: string, isProtected: boolean = false) => {
    if (isProtected && !user) navigate('/farmer-login');
    else navigate(path);
  };

  return (
    <div className={`p-4 md:p-10 space-y-8 text-right min-h-screen transition-all duration-500 ${theme === 'high-contrast' ? 'bg-black text-yellow-400' : 'bg-[#050505] text-white'}`} dir="rtl">
      
      {/* FLASH NEWS */}
      {flashNews.length > 0 && (
          <div className="space-y-2 animate-in slide-in-from-top-4">
              {flashNews.map((news) => (
                  <div key={news.id} className={`p-4 rounded-[1.5rem] flex items-center justify-between shadow-xl ${news.type === 'Critical' ? 'bg-gradient-to-r from-rose-600 to-red-700' : 'bg-gradient-to-r from-blue-600 to-indigo-700'} text-white`}>
                      <button onClick={() => setFlashNews(flashNews.filter(n => n.id !== news.id))} className="opacity-60 hover:opacity-100 p-2"><X size={18}/></button>
                      <div className="text-right flex-1 mr-4">
                          <p className="font-black uppercase text-[10px] tracking-widest flex items-center justify-end gap-2 mb-1 opacity-80">
                              {news.title} <Megaphone size={14} className="animate-bounce" />
                          </p>
                          <p className="text-sm font-bold font-urdu leading-tight">{news.message}</p>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* TOP BAR */}
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

      {/* HERO SECTION */}
      <div className="bg-gradient-to-br from-emerald-900 to-slate-950 p-8 md:p-12 rounded-[3rem] border border-emerald-500/20 shadow-2xl relative overflow-hidden group">
         <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400"><Star size={14} fill="currentColor" /><span className="text-sm font-bold tracking-wide uppercase">{currentGreet.en}</span></div>
          <h2 className="text-3xl md:text-5xl font-black font-nastaleeq text-white leading-tight">{user ? `${user.username} صاحب!` : 'محترم کسان دوست!'}</h2>
          <div className="my-6 border-r-4 border-emerald-500 pr-6">
              <p className="text-2xl md:text-3xl text-white/90 leading-[1.8] font-nastaleeq italic">"{currentQuote.ur}"</p>
              <p className="text-sm text-white/50 mt-2 italic">{currentQuote.en}</p>
          </div>
        </div>
        <Sprout className="absolute -right-10 -bottom-10 text-emerald-500/5 group-hover:rotate-12 transition-transform duration-700" size={300} />
      </div>

      {/* BILINGUAL TILES GRID */}
      <h3 className="text-white/40 font-bold text-sm uppercase tracking-widest pr-2">Quick Access | فوری رسائی</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 pb-20">
        {tiles.map(tile => {
            const IconComp = ICON_MAP[tile.icon] || Layout;
            const isLocked = tile.isLocked && !user;
            const gradientClass = tile.gradient ? `bg-gradient-to-br ${tile.gradient}` : 'bg-gray-800';

            return (
                <div key={tile.id} onClick={() => handleToolClick(tile.link, tile.isLocked)} className={`${gradientClass} p-6 rounded-[2.5rem] relative overflow-hidden h-[200px] flex flex-col justify-between cursor-pointer hover:scale-[1.02] active:scale-95 transition-all duration-300 group shadow-xl ${tile.shadow || ''}`}>
                  <IconComp className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-125 transition-transform duration-500 rotate-12" size={120} />
                  {(tile.isLocked && !user) && <Lock size={16} className="absolute top-6 left-6 text-white/60 bg-black/20 p-1 rounded-md" />}
                  
                  {/* Icon */}
                  <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-2xl flex items-center justify-center border border-white/20 shadow-lg group-hover:rotate-6 transition-transform"><IconComp size={24} className="text-white drop-shadow-md" /></div>
                  
                  {/* Text Container */}
                  <div className="relative z-10">
                      {/* URDU Label (Main) */}
                      <h3 className="font-black font-urdu text-xl text-white leading-tight drop-shadow-md mb-1">{tile.label}</h3>
                      {/* ENGLISH Sub (Secondary but clear) */}
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/70 bg-black/20 inline-block px-2 py-1 rounded">{tile.sub}</p>
                  </div>
                </div>
            );
        })}
      </div>
    </div>
  );
}