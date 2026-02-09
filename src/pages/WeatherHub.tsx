import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CloudRain, Sun, Wind, Thermometer, Droplets, MapPin, 
  ChevronDown, Moon, Crosshair, ArrowRight, Loader2, Calendar, 
  Sprout, Snowflake, Beaker, RefreshCw, Cloud, AlertTriangle, Volume2
} from 'lucide-react';

export default function WeatherHub() {
  const navigate = useNavigate();
  const [city, setCity] = useState("Srinagar");
  const [coords, setCoords] = useState({ lat: 34.0837, lon: 74.7973 }); 
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [isDay, setIsDay] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // ALERTS & VOICE STATE
  const [activeAlerts, setActiveAlerts] = useState<string[]>([]);
  
  // FARMER SPECIFIC STATES
  const [sprayCondition, setSprayCondition] = useState({ status: "Checking...", color: "text-gray-400", bg: "bg-gray-800", icon: <Loader2 className="animate-spin"/> });
  const [frostRisk, setFrostRisk] = useState(false);
  const [moonPhase, setMoonPhase] = useState("Waxing Gibbous");

  const DISTRICTS: any = {
    "Srinagar": { lat: 34.0837, lon: 74.7973 },
    "Anantnag": { lat: 33.7311, lon: 75.1487 },
    "Baramulla": { lat: 34.1980, lon: 74.3636 },
    "Budgam": { lat: 34.0167, lon: 74.7167 },
    "Kulgam": { lat: 33.6400, lon: 75.0200 },
    "Pulwama": { lat: 33.8792, lon: 74.8973 },
    "Kupwara": { lat: 34.5262, lon: 74.2546 },
    "Shopian": { lat: 33.7200, lon: 74.8300 },
    "Ganderbal": { lat: 34.2167, lon: 74.7833 },
    "Bandipora": { lat: 34.4200, lon: 74.6400 },
    "Jammu": { lat: 32.7266, lon: 74.8570 },
    "Udhampur": { lat: 32.9199, lon: 75.1420 },
    "Kathua": { lat: 32.3861, lon: 75.5186 },
    "Samba": { lat: 32.5574, lon: 75.1147 },
    "Reasi": { lat: 33.0827, lon: 74.8365 },
    "Ramban": { lat: 33.2467, lon: 75.2467 },
    "Doda": { lat: 33.1466, lon: 75.5463 },
    "Kishtwar": { lat: 33.3167, lon: 75.7667 },
    "Poonch": { lat: 33.7719, lon: 74.0934 },
    "Rajouri": { lat: 33.3811, lon: 74.3094 }
  };

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Moon Logic
  const getMoonPhase = (date: Date) => {
      const daysSinceNew = Math.floor((date.getTime() - new Date("2024-01-11").getTime()) / (1000 * 60 * 60 * 24)) % 29;
      if (daysSinceNew < 3) return "New Moon";
      if (daysSinceNew < 14) return "Waxing";
      if (daysSinceNew < 17) return "Full Moon";
      return "Waning";
  };

  // 🔊 VOICE ANNOUNCEMENT FUNCTION
  const speakAlerts = (alerts: string[]) => {
    if (!('speechSynthesis' in window) || alerts.length === 0) return;
    
    window.speechSynthesis.cancel(); // Stop any previous speech
    
    // Create a natural sentence
    const alertText = `Attention Farmers! ${alerts.length} Critical Weather Warnings. ${alerts.join(". ")}`;
    
    const utterance = new SpeechSynthesisUtterance(alertText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    window.speechSynthesis.speak(utterance);
  };

  // FETCH WEATHER
  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setActiveAlerts([]); 
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&wind_speed_unit=kmh&timezone=auto&timestamp=${Date.now()}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Weather API Failed");
      
      const data = await res.json();
      
      if (data.current) {
        setWeather(data.current);
        const dayTime = data.current.is_day === 1;
        setIsDay(dayTime);
        
        // --- 🚨 SMART ALERTS ---
        const newAlerts = [];
        const wind = data.current.wind_speed_10m;
        const gusts = data.current.wind_gusts_10m;
        const rain = data.current.precipitation;
        const temp = data.current.temperature_2m;
        const rainProb = data.daily.precipitation_probability_max[0];
        const minTemp = data.daily.temperature_2m_min[0];

        // 1. Wind Alert
        if (wind > 20 || gusts > 35) newAlerts.push(`High Wind Warning! Speed ${wind} km/h.`);
        
        // 2. Rain Alert
        if (rain > 2.0) newAlerts.push(`Heavy Rain Alert! ${rain}mm rain detected.`);
        else if (rainProb > 70) newAlerts.push("High Rain Probability! Postpone spraying.");
        
        // 3. Temperature Alerts
        if (minTemp < 4) newAlerts.push("Frost Alert! Temperature dropping below 4 degrees.");
        if (temp > 32) newAlerts.push("Heatwave Warning! Irrigate immediately.");

        setActiveAlerts(newAlerts);
        
        // 🔊 TRIGGER VOICE IF ALERTS EXIST
        if (newAlerts.length > 0) {
            speakAlerts(newAlerts);
        }

        // --------------------------------

        // Spray Logic
        if (rain > 0 || rainProb > 60) setSprayCondition({ status: "NO SPRAY (Rain)", color: "text-rose-400", bg: "bg-rose-500/10", icon: <CloudRain size={18}/> });
        else if (wind > 15) setSprayCondition({ status: "RISKY (Windy)", color: "text-amber-400", bg: "bg-amber-500/10", icon: <Wind size={18}/> });
        else if (!dayTime) setSprayCondition({ status: "NIGHT (Avoid)", color: "text-indigo-400", bg: "bg-indigo-500/10", icon: <Moon size={18}/> });
        else setSprayCondition({ status: "EXCELLENT", color: "text-emerald-400", bg: "bg-emerald-500/10", icon: <Beaker size={18}/> });

        // Frost Logic
        setFrostRisk(minTemp < 4);
        setForecast(data.daily.time.map((t: any, i: number) => ({ day: new Date(t).toLocaleDateString('en-US', { weekday: 'short' }), max: Math.round(data.daily.temperature_2m_max[i]), min: Math.round(data.daily.temperature_2m_min[i]), prob: data.daily.precipitation_probability_max[i] })));
        setMoonPhase(getMoonPhase(new Date()));
      }
    } catch (e) { console.error("Weather Error:", e); } 
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchWeather(coords.lat, coords.lon); }, [fetchWeather, coords]);

  const changeLocation = (newLat: number, newLon: number, newName: string) => {
      setCity(newName);
      setCoords({ lat: newLat, lon: newLon }); 
      setShowDropdown(false);
  };

  const hour = currentTime.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className={`min-h-screen relative overflow-hidden text-white font-sans transition-all duration-1000 ${isDay ? 'bg-sky-900' : 'bg-[#010208]'}`} dir="rtl">
      
      <div className={`fixed inset-0 transition-all duration-1000 ${isDay ? 'bg-gradient-to-b from-sky-400 to-blue-900' : 'bg-gradient-to-b from-[#010208] to-[#0a1128]'}`}></div>

      <div className="relative z-10 p-4 pb-20">
        
        {/* === 🚨 ACTIVE ALERTS BANNER === */}
        {activeAlerts.length > 0 && (
          <div className="mb-4 bg-rose-600 rounded-[1.5rem] p-4 shadow-[0_0_20px_rgba(225,29,72,0.6)] animate-pulse border border-rose-400 relative overflow-hidden">
             <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-3">
                    <AlertTriangle className="text-white shrink-0" size={24} fill="white" stroke="none" />
                    <h3 className="font-black uppercase text-sm tracking-widest text-white">Severe Alert</h3>
                 </div>
                 <Volume2 className="text-white opacity-80 animate-bounce" size={20} />
             </div>
             <div className="space-y-1">
               {activeAlerts.map((alert, i) => (
                 <p key={i} className="text-xs font-bold text-white/90 border-l-2 border-white/50 pl-2 ml-1">{alert}</p>
               ))}
             </div>
          </div>
        )}

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4 bg-black/30 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-lg">
          <div><h1 className="text-xl font-nastaleeq text-white">{greeting === "Good Morning" ? "صبح بخیر" : "خوش آمدید"}</h1><p className="text-[9px] font-black uppercase tracking-widest text-white/60 flex items-center gap-1"><Moon size={10} className="text-yellow-200" /> {moonPhase}</p></div>
          <div className="text-left" dir="ltr"><div className="text-xl font-black tracking-tight leading-none">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div><div className="text-[9px] font-black uppercase tracking-widest opacity-50">{currentTime.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</div></div>
        </div>

        {/* SEARCH */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => navigate('/')} className="p-3 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 active:scale-95 transition-all"><ArrowRight className="rotate-180" size={18} /></button>
          
          <div className="flex-1 relative">
            <button onClick={() => setShowDropdown(!showDropdown)} className="w-full p-3 bg-[#FFC107] text-black rounded-xl font-black text-[10px] uppercase flex justify-between items-center shadow-lg"><div className="flex items-center gap-2"><MapPin size={14}/> {city}</div><ChevronDown size={16}/></button>
            {showDropdown && (
              <div className="absolute top-12 left-0 right-0 bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 grid grid-cols-2 gap-1 shadow-2xl z-[500] max-h-56 overflow-y-auto">
                {Object.keys(DISTRICTS).map(d => (
                  <button key={d} onClick={() => changeLocation(DISTRICTS[d].lat, DISTRICTS[d].lon, d)} className="p-2 bg-white/5 rounded-lg text-[9px] font-bold text-right hover:bg-[#FFC107] hover:text-black transition-all">{d}</button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => navigator.geolocation.getCurrentPosition(p => changeLocation(p.coords.latitude, p.coords.longitude, "My Location"))} className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 active:scale-90 transition-all"><Crosshair size={18}/></button>
          <button onClick={() => fetchWeather(coords.lat, coords.lon)} className={`p-3 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30 active:scale-90 transition-all ${loading ? 'animate-spin' : ''}`}><RefreshCw size={18}/></button>
        </div>

        {loading ? (
          <div className="h-48 flex flex-col items-center justify-center bg-black/20 backdrop-blur-xl rounded-[2.5rem] border border-white/10"><Loader2 className="animate-spin text-[#FFC107]" size={30} /></div>
        ) : weather && (
          <>
            <div className="p-6 rounded-[2.5rem] border shadow-2xl backdrop-blur-xl bg-black/20 mb-3 relative overflow-hidden group border-white/10">
                <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12 transition-transform group-hover:scale-110">{isDay ? <Sun size={150}/> : <Moon size={150}/>}</div>
                <div className="flex justify-between items-start relative z-10">
                    <div dir="ltr"><h2 className="text-6xl font-black tracking-tighter drop-shadow-2xl leading-none">{Math.round(weather.temperature_2m)}°</h2><p className="text-[9px] font-black uppercase text-white/60 tracking-[0.3em] mt-1">RealFeel {Math.round(weather.temperature_2m - 2)}°</p></div>
                    {/* FROST BADGE */}
                    {frostRisk && <div className="bg-rose-500/20 border border-rose-500 text-rose-200 px-3 py-2 rounded-xl flex flex-col items-center animate-pulse shadow-lg"><Snowflake size={18} /><span className="text-[8px] font-black uppercase mt-1">Frost Risk</span></div>}
                </div>
                <div className={`mt-6 ${sprayCondition.bg} border border-white/5 p-3 rounded-2xl flex items-center justify-between`}>
                     <div className="flex items-center gap-3"><div className={`p-2 bg-black/20 rounded-full ${sprayCondition.color}`}>{sprayCondition.icon}</div><div className="text-right"><p className="text-[8px] text-white/50 uppercase font-black tracking-widest">Spray Condition</p><p className={`text-sm font-bold ${sprayCondition.color}`}>{sprayCondition.status}</p></div></div><Sprout size={24} className="text-white/10" />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
               <Metric icon={Wind} label="Wind" value={`${Math.round(weather?.wind_speed_10m)}`} unit="km/h" highlight={weather?.wind_speed_10m > 15} />
               <Metric icon={Droplets} label="Humidity" value={`${weather?.relative_humidity_2m}`} unit="%" />
               <Metric icon={Thermometer} label="Precip" value={`${weather?.precipitation}`} unit="mm" highlight={weather?.precipitation > 0} />
            </div>

            <div className="bg-black/30 backdrop-blur-xl rounded-[2.5rem] p-5 border border-white/10">
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 text-[#FFC107] flex items-center gap-2"><Calendar size={12}/> 7-Day Forecast</h4>
              <div className="space-y-3">
                {forecast.map((f, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[10px] font-black w-8 text-white/40">{f.day}</span>
                    <div className="flex-1 flex justify-center gap-2 items-center">
                       {f.prob > 40 ? <CloudRain size={14} className="text-blue-400"/> : f.prob > 10 ? <Cloud size={14} className="text-gray-400"/> : <Sun size={14} className="text-amber-500"/>}
                       <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden"><div className={`h-full ${f.prob > 40 ? 'bg-blue-500' : 'bg-emerald-500'}`} style={{ width: `${Math.max(f.prob, 10)}%` }} /></div>
                    </div>
                    <div className="w-16 text-right font-black text-[10px]">{f.max}° <span className="text-white/20 ml-1">{f.min}°</span></div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, unit, highlight }: any) {
  return (
    <div className={`p-3 rounded-[1.5rem] border flex flex-col items-center justify-center transition-all ${highlight ? 'bg-rose-500/20 border-rose-500/50' : 'bg-black/30 border-white/5'}`}>
      <Icon size={16} className={`mb-1 ${highlight ? 'text-rose-400' : 'text-[#FFC107]'}`} />
      <span className="text-sm font-black">{value}<span className="text-[8px] ml-0.5 font-normal opacity-50">{unit}</span></span>
      <p className="text-[7px] font-black uppercase tracking-wider text-white/30">{label}</p>
    </div>
  );
}