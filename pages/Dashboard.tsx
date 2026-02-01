import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Megaphone, Zap, BellRing, ScanEye, Syringe, Lock, 
  MessageCircle, BarChart3, Microscope, Rabbit, Warehouse, 
  Calendar, FlaskConical, Quote, BookOpen, MapPin, MapPinned, Sparkles
} from 'lucide-react';
import { askAI } from '../services/puterService';

export default function Dashboard() {
  const navigate = useNavigate();
  const [news, setNews] = useState<any[]>([]);
  const [wisdom, setWisdom] = useState<any>(null);
  const puter = (window as any).puter;

  useEffect(() => {
    const sync = async () => {
      const res = await puter.kv.get('fck_news_db');
      if (res) setNews(JSON.parse(res));

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
      title: "Market & Planning",
      items: [
        { label: 'Mandi Stats', icon: BarChart3, path: '/market', color: 'text-amber-500' },
        { label: 'CA Storage', icon: Warehouse, path: '/ca-storage', color: 'text-indigo-500' },
        { label: 'Livestock AI', icon: Rabbit, path: '/livestock', color: 'text-orange-500' },
        { label: 'Crop Calendar', icon: Calendar, path: '/calendar', color: 'text-cyan-500' },
      ]
    }
  ];

  return (
    <div className="p-4 lg:p-10 space-y-8 text-right bg-black min-h-screen overflow-y-auto no-scrollbar" dir="rtl">
      
      {/* 1. TOP BAR */}
      <div className="flex justify-between items-center">
        <button onClick={() => navigate('/admin')} className="bg-white/5 border border-white/10 px-6 py-2 rounded-xl text-rose-400 font-bold hover:bg-rose-500/10 transition-all flex items-center gap-2">
          <Lock size={16}/> Station Control
        </button>
        <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
           <MapPin size={14}/> Kulgam Node
        </div>
      </div>

      {/* 2. NEWS FLASH */}
      {news.length > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[2.5rem] flex items-center gap-6 animate-pulse">
          <div className="bg-emerald-500 p-3 rounded-2xl text-black"><Megaphone size={24} /></div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Breaking News</p>
            <p className="text-xl font-bold font-urdu text-white truncate leading-relaxed">{news[0].content}</p>
          </div>
        </div>
      )}

      {/* 3. SPRAY ALERT (Priority focus) */}
      <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center text-rose-500 shadow-2xl">
            <BellRing className="animate-pulse" size={32} />
          </div>
          <div className="text-right">
            <p className="text-rose-500 font-black font-urdu text-2xl">اسپرے الرٹ</p>
            <p className="text-[10px] text-rose-300/40 uppercase font-black tracking-widest mt-1 italic">Pink Bud Stage Schedule Missed</p>
          </div>
        </div>
        <button onClick={() => navigate('/spray-track')} className="bg-rose-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-rose-700 transition-all">Audit Now</button>
      </div>

      {/* 4. WELCOME & WISDOM */}
      <header className="bg-emerald-950/20 p-10 rounded-[4rem] border border-white/5 relative overflow-hidden shadow-2xl">
        <h2 className="text-4xl md:text-5xl font-black font-urdu text-emerald-400 mb-6">{wisdom?.greeting || 'السلام علیکم!'}</h2>
        <p className="text-xl md:text-2xl font-bold font-urdu text-emerald-100/60 leading-relaxed italic max-w-4xl mr-auto leading-relaxed">
          "{wisdom?.iqbal || 'ذرا نم ہو تو یہ مٹی بڑی زرخیز ہے ساقی'}"
        </p>
        <Quote className="absolute -left-10 -top-10 w-64 h-64 text-white/5" />
      </header>

      {/* 5. TOOLS GRID */}
      <div className="space-y-8">
        {toolGroups.map((group, idx) => (
          <div key={idx} className="space-y-4">
            <p className="text-[10px] font-black uppercase text-emerald-500/40 tracking-[0.3em] px-4">{group.title}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {group.items.map(tool => (
                <div key={tool.label} onClick={() => navigate(tool.path)} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/10 transition-all active:scale-95 group shadow-inner">
                  <tool.icon className={`${tool.color} mb-4 group-hover:scale-110 transition-transform`} size={32} />
                  <p className="font-bold text-[10px] uppercase text-white tracking-widest leading-none mt-2">{tool.label}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 6. EXPERT & HADITH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
         <div onClick={() => navigate('/expert')} className="bg-emerald-600 p-10 rounded-[3.5rem] flex items-center justify-between gap-6 cursor-pointer shadow-2xl hover:bg-emerald-500 transition-all group">
            <div className="flex items-center gap-4">
               <MessageCircle size={40} className="text-white group-hover:animate-bounce" />
               <div className="text-right">
                  <h3 className="text-2xl font-black font-urdu text-white uppercase">ماہر سے بات کریں</h3>
                  <p className="text-[8px] text-emerald-100 uppercase font-black">AI Expert Advice</p>
               </div>
            </div>
         </div>
         <div className="bg-white/5 p-10 rounded-[3.5rem] border border-white/5 flex flex-col justify-center shadow-inner">
            <p className="text-[9px] font-black text-emerald-500/40 uppercase mb-4 text-right">Hadith of the Day <BookOpen size={14} className="inline ml-2"/></p>
            <p className="text-xl font-bold font-urdu leading-relaxed text-slate-200">
              {wisdom?.hadith || 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ'}
            </p>
         </div>
      </div>

    </div>
  );
}