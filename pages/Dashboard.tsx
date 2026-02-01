import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Megaphone, Zap, BellRing, ScanEye, Syringe, Lock, 
  MessageCircle, BarChart3, Microscope, Rabbit, Warehouse, 
  Calendar, Quote, BookOpen, MapPin, MapPinned, Sparkles, MessageSquare
} from 'lucide-react';
import { askAI } from '../services/puterService';

export default function Dashboard() {
  const navigate = useNavigate();
  const [news, setNews] = useState<any[]>([]);
  const [wisdom, setWisdom] = useState<any>(null);
  const puter = (window as any).puter;

  useEffect(() => {
    const sync = async () => {
      // Fetch News from Cloud
      const res = await puter.kv.get('fck_news_db');
      if (res) setNews(JSON.parse(res));

      // Fetch AI Wisdom (Urdu/Hadith/Iqbal)
      const aiRes = await askAI('Short Urdu Greeting, Hadith, and Iqbal Shaar. JSON: {"greeting": "...", "hadith": "...", "iqbal": "..."}', false);
      if (aiRes) {
        const match = aiRes.match(/\{.*\}/s);
        if (match) setWisdom(JSON.parse(match[0]));
      }
    };
    sync();
    const interval = setInterval(sync, 20000);
    return () => clearInterval(interval);
  }, []);

  const toolGroups = [
    {
      title: "Smart Monitoring",
      items: [
        { label: 'Scanner Pro', icon: ScanEye, path: '/fck-scanner', color: 'text-blue-500' },
        { label: 'Spray Audit', icon: Syringe, path: '/spray-track', color: 'text-rose-500' },
        { label: 'Dealer Locator', icon: MapPinned, path: '/dealers', color: 'text-cyan-500' },
        { label: 'Soil Health', icon: Microscope, path: '/soil', color: 'text-emerald-500' },
      ]
    },
    {
      title: "Market & Social",
      items: [
        { label: 'برادری', icon: MessageSquare, path: '/community', color: 'text-indigo-400' },
        { label: 'Mandi Stats', icon: BarChart3, path: '/market', color: 'text-amber-500' }, // Corrected Line
        { label: 'CA Storage', icon: Warehouse, path: '/ca-storage', color: 'text-indigo-500' },
        { label: 'Livestock AI', icon: Rabbit, path: '/livestock', color: 'text-orange-500' },
      ]
    }
  ];

  return (
    <div className="space-y-6 md:space-y-10 text-right pb-24" dir="rtl">
      
      {/* 1. Header & Admin */}
      <div className="flex justify-between items-center px-1">
        <button onClick={() => navigate('/admin')} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-rose-400 text-xs font-bold flex items-center gap-2 transition-all active:scale-95">
          <Lock size={14}/> Station Control
        </button>
        <div className="flex items-center gap-2 text-emerald-500 font-black text-[9px] uppercase tracking-widest">
           <MapPin size={12}/> Kulgam Node
        </div>
      </div>

      {/* 2. Live News Flash */}
      {news.length > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-[2.5rem] flex items-center gap-4 animate-pulse mx-1">
          <div className="bg-emerald-500 p-2 rounded-xl text-black shrink-0"><Megaphone size={20} /></div>
          <p className="text-lg font-bold font-urdu text-white truncate leading-relaxed">{news[0].content}</p>
        </div>
      )}

      {/* 3. Priority Spray Alert */}
      <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-[3rem] flex flex-col sm:flex-row items-center justify-between gap-4 mx-1 shadow-lg">
        <div className="flex items-center gap-4">
          <BellRing className="text-rose-500 animate-bounce" size={28} />
          <div className="text-right">
            <p className="text-rose-500 font-black font-urdu text-xl">اسپرے الرٹ</p>
            <p className="text-[10px] text-rose-300/40 uppercase font-black tracking-widest">Schedule Audit Required</p>
          </div>
        </div>
        <button onClick={() => navigate('/spray-track')} className="w-full sm:w-auto bg-rose-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase shadow-xl active:bg-rose-700 transition-all">Audit Now</button>
      </div>

      {/* 4. Interactive Tools Grid */}
      {toolGroups.map((group, idx) => (
        <div key={idx} className="space-y-4 px-1">
          <p className="text-[10px] font-black uppercase text-emerald-500/40 tracking-[0.2em] pr-2">{group.title}</p>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {group.items.map(tool => (
              <div 
                key={tool.label} 
                onClick={() => navigate(tool.path)} 
                className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center cursor-pointer active:scale-90 transition-all hover:bg-white/10 shadow-sm"
              >
                <tool.icon className={`${tool.color} mb-3`} size={28} />
                <p className="font-bold text-[9px] uppercase text-white tracking-widest leading-tight">{tool.label}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 5. Welcome & AI Wisdom */}
      <header className="bg-emerald-950/20 p-8 rounded-[3.5rem] border border-white/5 relative overflow-hidden mx-1 shadow-2xl">
        <h2 className="text-3xl font-black font-urdu text-emerald-400 mb-4">{wisdom?.greeting || 'السلام علیکم!'}</h2>
        <p className="text-lg font-bold font-urdu text-emerald-100/60 italic leading-relaxed max-w-lg mr-auto">
          "{wisdom?.iqbal || 'ذرا نم ہو تو یہ مٹی بڑی زرخیز ہے ساقی'}"
        </p>
        <Sparkles className="absolute left-6 bottom-6 text-emerald-500/20" size={40} />
      </header>

    </div>
  );
}