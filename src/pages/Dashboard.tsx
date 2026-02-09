import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sun, Moon, Star, Sprout, Lock, Layout, 
  LogIn, Megaphone, X, BellRing
} from 'lucide-react';
import RotatingLogo from '../components/RotatingLogo';
import { DashboardTile, DEFAULT_MAIN_TILES, ICON_MAP } from '../utils/tileHelpers';
import { ADMIN_USERNAME } from "../config";

const GREETINGS = [{ ur: "خوش آمدید، اے دھرتی کے محافظ", en: "Welcome, Protector of the Earth" }];
const WISDOM_POOL = [{ ur: "ذرا نم ہو تو یہ مٹی بڑی زرخیز ہے ساقی", en: "With just a little moisture, this soil is incredibly fertile." }];

export default function Dashboard() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'standard' | 'high-contrast'>((localStorage.getItem('fck_theme') as any) || 'standard');
  const [tiles, setTiles] = useState<DashboardTile[]>(DEFAULT_MAIN_TILES); 
  const [currentQuote, setCurrentQuote] = useState(WISDOM_POOL[0]);
  const [currentGreet, setCurrentGreet] = useState(GREETINGS[0]);
  const [user, setUser] = useState<any>(null);
  
  // ✅ DEFAULT
  const [flashNews, setFlashNews] = useState<any[]>([
      { type: 'Info', title: 'Status', message: 'سسٹم آن لائن ہے۔' }
  ]);

  const loadAlerts = async () => {
    // 1. Local (Priority)
    const local = localStorage.getItem('fck_flash_news');
    if (local) {
        const parsed = JSON.parse(local);
        if (parsed.length > 0) setFlashNews(parsed);
    }

    // 2. Public Web (Backup with Fix)
    try {
        if(ADMIN_USERNAME) {
            // ✅ FIX: Replace underscore with hyphen
            const userSlug = ADMIN_USERNAME.toLowerCase().replace(/_/g, '-');
            const res = await fetch(`https://${userSlug}.puter.site/alerts.json?t=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) setFlashNews(data);
            }
        }
    } catch (e) {}
  };

  useEffect(() => {
    const puter = (window as any).puter;
    if (puter?.auth) puter.auth.getUser().then((u: any) => setUser(u)).catch(() => {});

    // TILES LOAD (Optional: If you want tiles to update dynamically too)
    const localTiles = localStorage.getItem('fck_main_tiles');
    if(localTiles) setTiles(JSON.parse(localTiles));

    loadAlerts();
    window.addEventListener('storage', loadAlerts); 
    const interval = setInterval(loadAlerts, 10000); 
    
    return () => {
        window.removeEventListener('storage', loadAlerts);
        clearInterval(interval);
    };
  }, []);

  const handleTileClick = (link: string, isLocked?: boolean) => {
    if (isLocked && !user) {
      alert("Please Login to access this feature.\nاس فیچر کے لیے لاگ ان ضروری ہے۔");
      navigate('/farmer-login');
    } else {
      navigate(link);
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 pb-24 font-sans transition-colors duration-500 ${theme === 'high-contrast' ? 'bg-black text-yellow-400' : 'bg-[#020408] text-white'}`}>
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-8 animate-in slide-in-from-top duration-700">
        <div className="flex gap-4 items-center">
          <RotatingLogo />
          <div>
            <h1 className={`text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none ${theme === 'high-contrast' ? 'text-yellow-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400'}`}>
              FC KASHMIR
            </h1>
            <p className={`text-sm font-bold font-urdu mt-1 ${theme === 'high-contrast' ? 'text-white' : 'text-emerald-600'}`}>
              جدید زراعت، خوشحال کسان
            </p>
          </div>
        </div>

        <div className="flex gap-3">
           <div className="relative">
              <button className="p-3 bg-white/5 rounded-2xl">
                 <BellRing size={20} className={flashNews.length > 0 ? "text-rose-500 animate-swing" : "text-white/50"} />
              </button>
              <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full animate-ping"></span>
           </div>

           {!user ? (
             <button onClick={() => navigate('/farmer-login')} className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                <LogIn size={18} /> <span className="hidden md:inline text-xs font-bold uppercase">Login</span>
             </button>
           ) : (
             <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center font-bold text-white border border-white/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
               {user.username.substring(0,2).toUpperCase()}
             </div>
           )}
        </div>
      </div>

      {/* 🔴 ALERT TICKER */}
      <div className="mb-8 bg-gradient-to-r from-rose-900/40 to-red-900/40 border border-rose-500/30 p-1 rounded-2xl overflow-hidden shadow-lg shadow-rose-900/20 relative animate-in fade-in">
          <div className="absolute left-0 top-0 bottom-0 bg-rose-600 px-3 z-10 flex items-center justify-center">
              <Megaphone size={18} className="text-white animate-pulse" />
          </div>
          <div className="py-2 pl-12 pr-4 overflow-hidden">
               <div className="whitespace-nowrap animate-marquee flex items-center">
                   {flashNews.map((n, i) => (
                       <span key={i} className="text-white font-bold mx-8 inline-flex items-center gap-2 text-sm">
                           <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-widest ${n.type==='Warning'?'bg-rose-500':'bg-blue-500'}`}>{n.type || 'INFO'}</span> 
                           <span className="text-white/90">{n.title}:</span>
                           <span className="font-urdu font-normal text-emerald-300">{n.message}</span>
                       </span>
                   ))}
               </div>
          </div>
      </div>

      {/* GREETING */}
      <div className="mb-8 p-6 rounded-[2.5rem] bg-gradient-to-br from-emerald-900/20 to-black border border-emerald-500/20 relative overflow-hidden group">
         <div className="absolute -right-10 -top-10 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
            <Sprout size={150} />
         </div>
         <h2 className="text-2xl font-urdu font-bold text-white mb-1">{currentGreet.ur}</h2>
         <p className="text-xs uppercase tracking-widest text-emerald-500 font-bold mb-4">{currentGreet.en}</p>
         <div className="h-px w-20 bg-emerald-500/50 mb-4"></div>
         <p className="text-lg font-urdu text-white/80 leading-relaxed">"{currentQuote.ur}"</p>
         <p className="text-[10px] text-white/40 mt-1 italic">{currentQuote.en}</p>
      </div>

      {/* TILES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.filter(t => t.isActive).map((tile, index) => {
            const IconComp = ICON_MAP[tile.icon] || Layout;
            const gradientClass = theme === 'high-contrast' ? 'bg-black border-2 border-yellow-400' : `bg-gradient-to-br ${tile.gradient}`;
            return (
                <div 
                  key={tile.id} 
                  onClick={() => handleTileClick(tile.link, tile.isLocked)} 
                  className={`${gradientClass} p-6 rounded-[2.5rem] relative overflow-hidden h-[200px] flex flex-col justify-between cursor-pointer hover:scale-[1.02] active:scale-95 transition-all duration-300 group shadow-xl ${tile.shadow || ''}`}
                >
                  <IconComp className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-125 transition-transform duration-500 rotate-12" size={120} />
                  {(tile.isLocked && !user) && <Lock size={16} className="absolute top-6 left-6 text-white/60 bg-black/20 p-1 rounded-md" />}
                  <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-2xl flex items-center justify-center border border-white/20 shadow-lg group-hover:rotate-6 transition-transform"><IconComp size={24} className="text-white drop-shadow-md" /></div>
                  <div className="relative z-10">
                      <h3 className="font-black font-urdu text-xl text-white leading-tight drop-shadow-md mb-1">{tile.label}</h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/70 bg-black/20 inline-block px-2 py-1 rounded-lg backdrop-blur-sm group-hover:bg-white/20 transition-colors">{tile.sub}</p>
                  </div>
                </div>
            );
        })}
      </div>

      <style>{`
        .animate-marquee { animation: marquee 15s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-swing { animation: swing 1s ease-in-out infinite; }
      `}</style>
    </div>
  );
}