import React, { useState, useEffect } from 'react';
import { 
  CloudSun, Quote, BookOpen, BellRing, ArrowRight, 
  Lock, ShieldCheck, Zap, MapPin, Droplets, Wind
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { askAI } from '../services/puterService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState<any>(null);
  const [dailyInspiration, setDailyInspiration] = useState({ hadith: '', iqbal: '', greeting: '' });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Weather Fetch (Srinagar)
        const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=34.08&longitude=74.79&current=temperature_2m,relative_humidity_2m&timezone=auto`);
        const wData = await wRes.json();
        setWeather({ 
          temp: `${Math.round(wData.current.temperature_2m)}°C`, 
          hum: `${wData.current.relative_humidity_2m}%` 
        });

        // 2. AI Content via Puter (Greeting, Hadith, Iqbal)
        const prompt = `Provide 3 items for a Kashmiri farmer in Urdu script: 1. Morning Greeting, 2. Hadith about hard work, 3. Iqbal Shaar about Khudi. Return JSON: {"greeting": "...", "hadith": "...", "iqbal": "..."}`;
        const aiRes = await askAI(prompt, false);
        if (aiRes) {
          const match = aiRes.match(/\{.*\}/s);
          if (match) setDailyInspiration(JSON.parse(match[0]));
        }

        // 3. English Voice Alert
        const msg = new SpeechSynthesisUtterance("Attention. Sorry to say that you have missed the spray scheduled.");
        msg.lang = 'en-US';
        window.speechSynthesis.speak(msg);

      } catch (e) { console.error(e); }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="flex-1 p-6 md:p-12 space-y-8 text-right overflow-y-auto h-full no-scrollbar bg-black" dir="rtl">
      
      {/* 1. CRITICAL ALERT ON TOP */}
      <div className="bg-rose-500/10 border border-rose-500/20 p-10 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl animate-in slide-in-from-top-4">
         <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-rose-500/20 rounded-[2.5rem] flex items-center justify-center text-rose-500 shadow-2xl">
              <BellRing className="animate-pulse" size={40} />
            </div>
            <div className="text-right">
               <p className="text-rose-500 font-black font-urdu text-3xl tracking-tight leading-none">توجہ فرمائیں! اسپرے الرٹ</p>
               <p className="text-[10px] text-rose-200/40 uppercase font-black tracking-[0.3em] mt-2 italic">Critical: Pink Bud Stage Spray Schedule Missed</p>
            </div>
         </div>
         <button 
           onClick={() => navigate('/farmer-portal')} 
           className="bg-rose-600 text-white px-12 py-5 rounded-3xl font-black text-xs uppercase shadow-2xl hover:bg-rose-700 transition-all active:scale-95 flex items-center gap-3"
         >
           Check Auditor <ArrowRight size={18} />
         </button>
      </div>

      {/* 2. TOP GREETING HERO */}
      <header className="bg-emerald-950/30 p-10 md:p-14 rounded-[4rem] border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl md:text-6xl font-black font-urdu text-emerald-400 tracking-tight leading-tight">
            {dailyInspiration.greeting || 'السلام علیکم، میرے قابل احترام ساتھیو!'}
          </h2>
          <p className="text-xl md:text-2xl font-bold font-urdu text-emerald-100/60 leading-relaxed italic max-w-4xl mr-auto">
            "{dailyInspiration.iqbal || 'خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے خدا بندے سے خود پوچھے بتا تیری رضا کیا ہے'}"
          </p>
          <div className="flex items-center justify-end gap-2 text-emerald-500/20 text-[10px] uppercase font-black tracking-widest pt-4">
            <MapPin size={12} /> Srinagar Core Node • {new Date().toLocaleDateString('ur-PK')}
          </div>
        </div>
        <Quote className="absolute -left-10 -top-10 w-64 h-64 text-white/5" />
      </header>

      {/* 3. ADMIN STATION VIP ACCESS CARD */}
      <section className="grid grid-cols-1 gap-6" dir="ltr">
        <div 
          onClick={() => navigate('/admin')}
          className="bg-rose-500/5 border-2 border-dashed border-rose-500/20 p-8 rounded-[3.5rem] flex items-center justify-between group cursor-pointer hover:bg-rose-500/10 transition-all"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-rose-500/20 rounded-3xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
              <Lock size={32} />
            </div>
            <div className="text-left">
              <h3 className="text-2xl font-black text-rose-500 uppercase tracking-tighter">Admin Command Station</h3>
              <p className="text-[10px] font-bold text-rose-200/40 uppercase tracking-[0.2em]">Full Station Control & Master Data Management</p>
            </div>
          </div>
          <ShieldCheck className="text-rose-500/20 group-hover:text-rose-500 transition-colors" size={48} />
        </div>
      </section>

      {/* 4. WEATHER & HADITH GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 p-10 rounded-[3.5rem] border border-white/5 flex flex-col items-center justify-center text-center group hover:bg-white/10 transition-all">
          <CloudSun size={64} className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
          <p className="text-7xl font-black tracking-tighter text-white">{weather?.temp || '5°C'}</p>
          <div className="flex gap-4 mt-4 text-emerald-500/40 font-black text-[10px] uppercase tracking-widest">
            <span className="flex items-center gap-1 text-blue-400"><Droplets size={12}/> {weather?.hum || '60%'}</span>
            <span className="flex items-center gap-1 text-emerald-400"><Wind size={12}/> 12 km/h</span>
          </div>
        </div>

        <div className="bg-white/5 p-10 rounded-[3.5rem] border border-white/5 flex flex-col justify-center text-right space-y-6">
          <div className="flex items-center justify-end gap-3 text-emerald-500/30 font-black text-[10px] uppercase tracking-widest">
            فرمانِ رسول ﷺ <BookOpen size={14}/>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-urdu leading-relaxed text-slate-200">
            {dailyInspiration.hadith || 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ'}
          </p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;