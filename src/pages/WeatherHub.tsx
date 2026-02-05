import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CloudRain, Sun, Wind, Thermometer, Droplets, MapPin, 
  ChevronDown, Moon, Sunrise, Clock, AlertOctagon, Crosshair, 
  ArrowRight, Loader2, Calendar, Sunset as SunsetIcon
} from 'lucide-react';

export default function WeatherHub() {
  const navigate = useNavigate();
  const [city, setCity] = useState("Srinagar");
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [isDay, setIsDay] = useState(true);
  const [loading, setLoading] = useState(true);
  const [advice, setAdvice] = useState({ ur: "", en: "", type: "safe", color: "#10b981" });
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const jkDistricts = ["Srinagar", "Anantnag", "Baramulla", "Budgam", "Kulgam", "Pulwama", "Kupwara", "Shopian", "Ganderbal", "Bandipora", "Jammu", "Udhampur", "Kathua", "Samba", "Reasi", "Ramban", "Doda", "Kishtwar", "Poonch", "Rajouri"];

  // Clock Sync
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Greetings Logic
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { en: "Good Morning", ur: "صبح بخیر", icon: <Sunrise size={16} className="text-amber-300 animate-pulse"/> };
    if (hour < 17) return { en: "Good Afternoon", ur: "سہ پہر بخیر", icon: <Sun size={16} className="text-yellow-400"/> };
    if (hour < 20) return { en: "Good Evening", ur: "شام بخیر", icon: <SunsetIcon size={16} className="text-orange-400"/> };
    return { en: "Good Night", ur: "شب بخیر", icon: <Moon size={16} className="text-indigo-300"/> };
  };

  const announce = useCallback((ur: string, en: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const s = new SpeechSynthesisUtterance(`${en}. ${ur}`);
    s.lang = 'ur-PK'; s.rate = 1.0;
    window.speechSynthesis.speak(s);
  }, []);

  const fetchWeather = useCallback(async (lat: number, lon: number, name: string) => {
    setLoading(true); setCity(name);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&wind_speed_unit=kmh&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.current) {
        const dayTime = data.current.is_day === 1;
        setIsDay(dayTime);
        
        let type = "safe", en = "PERFECT: YOU CAN SPRAY", ur = "اسپرے کے لیے بہترین وقت ہے";
        
        if (!dayTime) {
          type = "danger";
          en = "IT IS NIGHT: NO SPRAY WARNING STAY SAFE";
          ur = "رات کا وقت ہے: ابھی اسپرے نہ کریں";
        } else {
          if (data.current.precipitation > 0 || data.daily.precipitation_probability_max[0] > 40) {
            type = "danger"; en = "RAIN ALERT: STOP SPRAY"; ur = "بارش کا خطرہ ہے! اسپرے روک دیں";
          } else if (data.current.wind_speed_10m > 15) {
            type = "warning"; en = "WINDY: WAIT FOR CALM"; ur = "ہوا تیز ہے! ابھی انتظار کریں";
          }
        }

        setWeather(data.current);
        setForecast(data.daily.time.map((t: any, i: number) => ({ day: new Date(t).toLocaleDateString('en-US', { weekday: 'short' }), max: Math.round(data.daily.temperature_2m_max[i]), min: Math.round(data.daily.temperature_2m_min[i]), prob: data.daily.precipitation_probability_max[i] })));
        setAdvice({ type, en, ur, color: type === 'danger' ? '#f43f5e' : type === 'warning' ? '#fbbf24' : '#10b981' });
        announce(ur, en);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [announce]);

  useEffect(() => { fetchWeather(34.0837, 74.7973, "Srinagar"); }, [fetchWeather]);

  const greeting = getGreeting();

  return (
    <div className={`min-h-screen relative overflow-hidden text-white font-sans transition-all duration-1000 ${isDay ? 'bg-sky-900' : 'bg-[#010208]'}`} dir="rtl">
      
      {/* 1. ATMOSPHERE ENGINE */}
      <div className={`fixed inset-0 transition-all duration-1000 ${isDay ? 'bg-gradient-to-b from-sky-400 to-blue-900' : 'bg-gradient-to-b from-[#010208] to-[#0a1128]'}`}>
        {!isDay && [...Array(20)].map((_, i) => (
          <div key={i} className="absolute bg-white rounded-full animate-pulse opacity-40" 
            style={{ width: Math.random()*2+'px', height: Math.random()*2+'px', top: Math.random()*100+'%', left: Math.random()*100+'%', animationDelay: Math.random()*5+'s' }} 
          />
        ))}
      </div>

      <div className="relative z-10 p-4 pb-20">
        
        {/* 2. COMPACT HEADER */}
        <div className="flex justify-between items-center mb-3 bg-black/30 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-lg">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              {greeting.icon}
              <span className="text-[9px] font-black uppercase tracking-widest text-white/60">{greeting.en}</span>
            </div>
            <h1 className="text-xl font-nastaleeq text-white">{greeting.ur}</h1>
          </div>
          <div className="text-left" dir="ltr">
            <div className="text-xl font-black tracking-tight leading-none">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="text-[9px] font-black uppercase tracking-widest opacity-50 flex items-center gap-1 justify-end mt-1">
              <Calendar size={10}/> {currentTime.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
            </div>
          </div>
        </div>

        {/* 3. COMPACT SEARCH BAR */}
        <div className="flex gap-2 mb-3">
          <button onClick={() => navigate('/dashboard')} className="p-3 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 active:scale-95 transition-all"><ArrowRight className="rotate-180" size={18} /></button>
          <div className="flex-1 relative">
            <button onClick={() => setShowDropdown(!showDropdown)} className="w-full p-3 bg-[#FFC107] text-black rounded-xl font-black text-[10px] uppercase flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-2"><MapPin size={14}/> {city}</div>
              <ChevronDown size={16}/>
            </button>
            {showDropdown && (
              <div className="absolute top-12 left-0 right-0 bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 grid grid-cols-2 gap-1 shadow-2xl z-[500] max-h-56 overflow-y-auto">
                {jkDistricts.map(d => (
                  <button key={d} onClick={() => { fetchWeather(34.0, 74.0, d); setShowDropdown(false); }} className="p-2 bg-white/5 rounded-lg text-[9px] font-bold text-right hover:bg-[#FFC107] hover:text-black transition-all">{d}</button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => navigator.geolocation.getCurrentPosition(p => fetchWeather(p.coords.latitude, p.coords.longitude, "Detected Location"))} className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 active:scale-90 transition-all"><Crosshair size={18}/></button>
        </div>

        {/* 4. COMPACT WEATHER CARD */}
        {loading ? (
          <div className="h-48 flex flex-col items-center justify-center bg-black/20 backdrop-blur-xl rounded-[2.5rem] border border-white/10">
            <Loader2 className="animate-spin text-[#FFC107]" size={30} />
          </div>
        ) : weather && (
          <div className="p-6 rounded-[2.5rem] border shadow-2xl backdrop-blur-xl bg-black/40 mb-3 transition-all duration-700 relative overflow-hidden" style={{ borderColor: advice.color }}>
            
            <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12">{isDay ? <Sun size={150}/> : <Moon size={150}/>}</div>

            <div className="flex justify-between items-center relative z-10 mb-4">
              <div dir="ltr">
                <h2 className="text-6xl font-black tracking-tighter drop-shadow-2xl leading-none">{Math.round(weather.temperature_2m)}°</h2>
                <p className="text-[9px] font-black uppercase text-[#FFC107] tracking-[0.3em] mt-1">Celsius</p>
              </div>
              <div style={{ color: advice.color }}>
                {isDay ? <Sun size={40}/> : <Moon size={40}/>}
              </div>
            </div>

            <div className="space-y-2 relative z-10">
              <h3 className="text-lg font-black uppercase tracking-tight italic leading-none">{advice.en}</h3>
              <p className="text-xl font-nastaleeq leading-relaxed text-white/90">"{advice.ur}"</p>
            </div>

            {/* Compact Warning */}
            <div className={`mt-4 py-2 px-3 rounded-2xl flex items-center gap-2 border ${!isDay ? 'bg-rose-500/10 border-rose-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
               <AlertOctagon size={14} className={!isDay ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}/>
               <span className="text-[8px] font-black uppercase tracking-widest text-white/80">
                 {!isDay ? "Night Warning: Do not spray." : "Daylight Monitoring Active."}
               </span>
            </div>
          </div>
        )}

        {/* 5. COMPACT METRICS */}
        <div className="grid grid-cols-2 gap-3 mb-3">
           <Metric icon={Wind} label="Wind" value={`${Math.round(weather?.wind_speed_10m)} km/h`} highlight={weather?.wind_speed_10m > 15} />
           <Metric icon={Droplets} label="Humidity" value={`${weather?.relative_humidity_2m}%`} />
        </div>

        {/* 6. COMPACT FORECAST */}
        <div className="bg-black/40 backdrop-blur-2xl rounded-[2.5rem] p-5 border border-white/10 shadow-inner">
          <h4 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 text-[#FFC107] flex items-center gap-2">
            <Clock size={12}/> 7-Day Plan
          </h4>
          <div className="space-y-3">
            {forecast.map((f, i) => (
              <div key={i} className="flex items-center justify-between group">
                <span className="text-[10px] font-black w-8 text-white/40">{f.day}</span>
                <div className="flex-1 flex justify-center gap-2 items-center">
                   {f.prob > 30 ? <CloudRain size={14} className="text-blue-400"/> : <Sun size={14} className="text-amber-500"/>}
                   <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500/60" style={{ width: `${100-f.prob}%` }} />
                   </div>
                </div>
                <div className="w-14 text-right font-black text-[10px]">
                  {f.max}° <span className="text-white/20 ml-1">{f.min}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, highlight }: any) {
  return (
    <div className="bg-black/30 backdrop-blur-xl p-4 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center transition-all hover:border-white/20 shadow-inner">
      <div className={`p-2 rounded-xl bg-white/5 mb-2 ${highlight ? 'text-rose-500' : 'text-[#FFC107]'}`}><Icon size={18} /></div>
      <span className="text-lg font-black">{value}</span>
      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">{label}</p>
    </div>
  );
}