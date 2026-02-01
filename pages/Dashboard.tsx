import React, { useState, useEffect } from 'react';
import { 
  CloudSun, Sprout, Syringe, Activity, MapPin, Wind, Droplets, 
  Thermometer, ArrowRight, ShieldCheck, Bell, TrendingUp, Search, 
  BookOpen, Heart, Quote
} from 'lucide-react';
import { askAI, getUserData } from '../services/puterService';

const Dashboard: React.FC = () => {
  const [weather, setWeather] = useState<any>(null);
  const [dailyInspiration, setDailyInspiration] = useState({ hadith: '', iqbal: '', greeting: '' });
  const [stats, setStats] = useState({ sprays: 0, alerts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Satellite Weather Fetch (Srinagar Node)
        const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=34.08&longitude=74.79&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`);
        const wData = await wRes.json();
        const currentW = {
          temp: `${Math.round(wData.current.temperature_2m)}°C`,
          hum: `${wData.current.relative_humidity_2m}%`,
          cond: wData.current.weather_code <= 3 ? "Khush-gawar Mausam" : "Badal/Barish"
        };
        setWeather(currentW);

        // 2. Dynamic AI Content (Hadith, Iqbal & Greeting)
        // Hum AI ko bol rahe hain ke har din naya aur relevant content de
        const prompt = `System: You are an Islamic & Literary scholar for FC Kashmir.
        Task: Provide 3 items in Real Urdu Script (No Roman Urdu):
        1. A beautiful Morning Greeting for a Kashmiri Farmer.
        2. A short Hadith-e-Nabvi (SAW) about agriculture or hard work.
        3. A famous verse (Shaar) by Allama Iqbal about self-respect (Khudi) or nature.
        JSON format: {"greeting": "...", "hadith": "...", "iqbal": "..."}`;
        
        const aiRes = await askAI(prompt, false);
        if (aiRes) {
          const match = aiRes.match(/\{.*\}/s);
          if (match) setDailyInspiration(JSON.parse(match[0]));
        }

        // 3. Stats from Cloud
        const sprays = await getUserData('fck_sprays');
        if (sprays) setStats({ sprays: sprays.length, alerts: 0 });
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* Header & Weather Section */}
      <section className="relative overflow-hidden bg-emerald-900 rounded-[3.5rem] p-10 text-white shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-black text-emerald-400 leading-tight" dir="rtl">
              {dailyInspiration.greeting || 'صبح بخیر، ایف سی کشمیر پورٹل پر خوش آمدید'}
            </h1>
            <div className="flex items-center gap-3 text-emerald-100/60 font-bold uppercase text-[10px]">
              <MapPin className="w-4 h-4" /> Srinagar Core • {new Date().toLocaleDateString('ur-PK')}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 flex justify-around items-center">
            <div className="text-center">
               <p className="text-5xl font-black">{weather?.temp || '--'}</p>
               <p className="text-[10px] font-bold uppercase mt-2 text-emerald-300">{weather?.cond}</p>
            </div>
            <div className="space-y-2">
               <div className="flex items-center gap-2 text-sm"><Droplets className="w-4 h-4 text-blue-300" /> {weather?.hum}</div>
               <div className="flex items-center gap-2 text-sm"><Wind className="w-4 h-4 text-emerald-300" /> 12 km/h</div>
            </div>
          </div>
        </div>
      </section>

      {/* Hadith & Iqbal Cards (Dill Khush Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-10 rounded-[3.5rem] border-t-8 border-emerald-600 shadow-xl relative overflow-hidden group">
          <Heart className="absolute -right-4 -bottom-4 w-24 h-24 text-emerald-50 opacity-50 group-hover:scale-110 transition-transform" />
          <h3 className="text-emerald-900 font-black text-xs uppercase mb-6 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> حدیثِ نبوی ﷺ
          </h3>
          <p className="text-xl md:text-2xl font-bold leading-relaxed text-slate-800 text-right" dir="rtl">
            {dailyInspiration.hadith || 'جو مسلمان درخت لگائے یا کھیتی کرے اور اس میں سے کوئی پرندہ یا انسان کھائے تو یہ اس کے لیے صدقہ ہے۔'}
          </p>
        </div>

        <div className="bg-emerald-950 p-10 rounded-[3.5rem] text-white shadow-xl relative overflow-hidden group">
          <Quote className="absolute -left-4 -top-4 w-24 h-24 text-white/5 opacity-50" />
          <h3 className="text-emerald-400 font-black text-xs uppercase mb-6 flex items-center gap-2 justify-end">
            کلامِ اقبال <Sprout className="w-4 h-4" />
          </h3>
          <p className="text-xl md:text-2xl font-bold leading-relaxed text-emerald-50 text-right" dir="rtl">
            {dailyInspiration.iqbal || 'ذرا نم ہو تو یہ مٹی بڑی زرخیز ہے ساقی'}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Spray History', icon: Syringe, val: stats.sprays, color: 'emerald' },
          { label: 'Market Prices', icon: TrendingUp, val: 'Live', color: 'blue' },
          { label: 'Soil Health', icon: Activity, val: 'Good', color: 'amber' },
          { label: 'Expert Help', icon: Search, val: 'AI', color: 'rose' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border shadow-sm text-center space-y-3 hover:scale-105 transition-transform">
            <div className={`w-12 h-12 mx-auto bg-${item.color}-50 text-${item.color}-600 rounded-2xl flex items-center justify-center`}><item.icon /></div>
            <p className="text-[10px] font-black uppercase text-slate-400">{item.label}</p>
            <p className="text-lg font-black text-slate-800">{item.val}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;