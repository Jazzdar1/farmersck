import React, { useState, useEffect } from 'react';
import { 
  CloudSun, Wind, Droplets, Thermometer, MapPin, 
  ChevronDown, X, Sun, CloudRain, Snowflake, Cloud, Volume2, Zap 
} from 'lucide-react';

export default function WeatherHub() {
  const [selectedDistrict, setSelectedDistrict] = useState('Kulgam');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<any>(null);
  const [alert, setAlert] = useState<{ eng: string, urdu: string, type: 'frost' | 'disease' | 'none' }>({ 
    eng: '', urdu: '', type: 'none' 
  });

  const districtCoords: Record<string, { lat: number, lon: number }> = {
    "Anantnag": { lat: 33.73, lon: 75.15 }, "Bandipora": { lat: 34.42, lon: 74.65 },
    "Baramulla": { lat: 34.20, lon: 74.34 }, "Budgam": { lat: 34.02, lon: 74.72 },
    "Doda": { lat: 33.13, lon: 75.57 }, "Ganderbal": { lat: 34.23, lon: 74.77 },
    "Jammu": { lat: 32.73, lon: 74.86 }, "Kathua": { lat: 32.38, lon: 75.52 },
    "Kishtwar": { lat: 33.31, lon: 75.77 }, "Kulgam": { lat: 33.65, lon: 75.02 },
    "Kupwara": { lat: 34.53, lon: 74.25 }, "Poonch": { lat: 33.77, lon: 74.10 },
    "Pulwama": { lat: 33.88, lon: 74.92 }, "Rajouri": { lat: 33.38, lon: 74.30 },
    "Ramban": { lat: 33.25, lon: 75.25 }, "Reasi": { lat: 33.08, lon: 74.83 },
    "Samba": { lat: 32.56, lon: 75.12 }, "Shopian": { lat: 33.72, lon: 74.83 },
    "Srinagar": { lat: 34.08, lon: 74.80 }, "Udhampur": { lat: 32.92, lon: 75.13 }
  };

  const getWeatherTheme = (code: number) => {
    if (code === 0) return { urdu: "آسمان صاف ہے", eng: "It is Sunny", bg: "from-blue-400 to-blue-600", icon: Sun, status: 'clear' };
    if (code <= 3) return { urdu: "آسمان ابر آلود ہے", eng: "It is Cloudy", bg: "from-slate-400 to-slate-600", icon: CloudSun, status: 'clouds' };
    if (code >= 51 && code <= 67) return { urdu: "بارش ہو رہی ہے", eng: "It is Raining", bg: "from-blue-800 to-slate-900", icon: CloudRain, status: 'rain' };
    if (code >= 71 && code <= 77) return { urdu: "برف باری ہو رہی ہے", eng: "It is Snowing", bg: "from-blue-100 to-blue-300 text-slate-800", icon: Snowflake, status: 'snow' };
    return { urdu: "موسم ابر آلود ہے", eng: "The weather is cloudy", bg: "from-gray-600 to-gray-800", icon: Cloud, status: 'clouds' };
  };

  const speakWeather = (temp: number, engText: string, urduText: string) => {
    const synth = window.speechSynthesis;
    const roundedTemp = Math.round(temp);
    const engSpeech = `It is ${roundedTemp} degrees Celsius. ${engText}.`;
    const urduSpeech = `درجہ حرارت ${roundedTemp} ڈگری سینٹی گریڈ ہے۔ ${urduText}۔`;
    
    const engUtterance = new SpeechSynthesisUtterance(engSpeech);
    engUtterance.lang = 'en-US';
    engUtterance.rate = 0.9;
    
    const urduUtterance = new SpeechSynthesisUtterance(urduSpeech);
    urduUtterance.lang = 'hi-IN'; // Compatible voice for Urdu
    urduUtterance.rate = 0.8;

    synth.cancel(); 
    synth.speak(engUtterance);
    engUtterance.onend = () => {
      setTimeout(() => synth.speak(urduUtterance), 500);
    };
  };

  const generateAlerts = (temp: number, humidity: number) => {
    if (temp <= 2) return { eng: "Warning: Frost risk detected.", urdu: "انتباہ: کہرے کا خطرہ۔", type: 'frost' as const };
    if (humidity > 80 && temp > 10 && temp < 20) return { eng: "High Scab disease risk.", urdu: "بیماری کا زیادہ خطرہ۔", type: 'disease' as const };
    return { eng: '', urdu: '', type: 'none' as const };
  };

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      const { lat, lon } = districtCoords[selectedDistrict];
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,apparent_temperature,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
        const data = await res.json();
        setWeather(data);
        
        const currentTemp = data.current.temperature_2m;
        const currentHum = data.current.relative_humidity_2m;
        const theme = getWeatherTheme(data.current.weather_code);
        const newAlert = generateAlerts(currentTemp, currentHum);
        setAlert(newAlert);

        let fEng = `It is ${Math.round(currentTemp)} degrees. ${theme.eng}.`;
        let fUrdu = `درجہ حرارت ${Math.round(currentTemp)} ڈگری ہے۔ ${theme.urdu}۔`;
        if (newAlert.type !== 'none') { fEng += ` ${newAlert.eng}`; fUrdu += ` ${newAlert.urdu}`; }
        
        speakWeather(currentTemp, fEng, fUrdu);
      } catch (error) { console.error("Weather error", error); }
      setLoading(false);
    };
    fetchWeather();
  }, [selectedDistrict]);

  if (loading) return <div className="p-10 text-emerald-500 font-black animate-pulse text-center font-urdu">لوڈ ہو رہا ہے...</div>;

  const currentTemp = weather?.current?.temperature_2m;
  const theme = getWeatherTheme(weather?.current?.weather_code);
  const MainIcon = theme.icon;

  return (
    <div className="space-y-6 pb-24 transition-all duration-700">
      
      {/* 1. DISTRICT SELECTOR */}
      <div className="relative">
        <label className="text-[10px] font-black uppercase text-emerald-500/50 tracking-widest px-2 mb-2 block">JK District Node</label>
        <div className="relative">
          <select 
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-2xl appearance-none font-bold outline-none"
          >
            {Object.keys(districtCoords).map(dist => <option key={dist} value={dist} className="bg-slate-900">{dist}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" />
        </div>
      </div>

      {/* 2. SMART ALERT BOX */}
      {alert.type !== 'none' && (
        <div className={`p-6 rounded-[2rem] border-2 animate-bounce flex items-center gap-4 ${alert.type === 'frost' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-rose-500/10 border-rose-500 text-rose-400'}`}>
          <div className={`p-3 rounded-2xl ${alert.type === 'frost' ? 'bg-blue-500' : 'bg-rose-500'} text-white`}><Zap size={24} /></div>
          <div className="text-right flex-1">
             <p className="font-urdu text-lg font-bold leading-tight">{alert.urdu}</p>
             <p className="text-[9px] uppercase font-black tracking-widest opacity-60 mt-1">{alert.eng}</p>
          </div>
        </div>
      )}

      {/* 3. DYNAMIC MAIN CARD */}
      <div className={`bg-gradient-to-b ${theme.bg} p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden transition-all duration-1000`}>
        {theme.status === 'rain' && <div className="absolute inset-0 bg-blue-500/10 animate-pulse pointer-events-none" />}
        {theme.status === 'snow' && <div className="absolute inset-0 bg-white/20 animate-bounce duration-[3000ms] pointer-events-none" />}
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className={theme.status === 'snow' ? 'text-slate-900' : 'text-white'}>
            <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest mb-4 opacity-70">
              <MapPin size={14}/> {selectedDistrict}, J&K
            </div>
            <h1 className="text-7xl md:text-8xl font-black leading-none">{Math.round(currentTemp)}°</h1>
            <div className="mt-4 space-y-1">
              <p className="text-3xl font-urdu font-bold">{theme.urdu}</p>
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold opacity-60">{theme.eng}</p>
                <button onClick={() => speakWeather(currentTemp, theme.eng, theme.urdu)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"><Volume2 size={16} /></button>
              </div>
            </div>
          </div>
          <MainIcon size={140} className={`opacity-40 absolute -right-6 -bottom-6 md:static ${theme.status === 'snow' ? 'text-slate-800' : 'text-white'}`} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-10 relative z-10">
          <Stat label="Humidity" value={`${weather?.current?.relative_humidity_2m}%`} icon={Droplets} dark={theme.status === 'snow'} />
          <Stat label="Wind" value={`${weather?.current?.wind_speed_10m} km/h`} icon={Wind} dark={theme.status === 'snow'} />
          <Stat label="Feels" value={`${Math.round(weather?.current?.apparent_temperature)}°`} icon={Thermometer} dark={theme.status === 'snow'} />
        </div>
      </div>

      {/* 4. WEEKLY OUTLOOK */}
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase text-emerald-500/40 tracking-[0.3em] px-4">Weekly Outlook</p>
        <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4 px-2">
          {weather?.daily?.time.map((time: string, i: number) => {
            const dayTheme = getWeatherTheme(weather.daily.weather_code[i]);
            const DayIcon = dayTheme.icon;
            const dayMax = weather.daily.temperature_2m_max[i];
            return (
              <button key={time} onClick={() => { setActiveDay({ date: time, max: dayMax, min: weather.daily.temperature_2m_min[i], theme: dayTheme }); speakWeather(dayMax, dayTheme.eng, dayTheme.urdu); }}
                className="min-w-[110px] bg-white/5 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center text-center hover:bg-emerald-500/10 transition-all active:scale-95 group"
              >
                <p className="text-[10px] font-black uppercase text-white/40 mb-3">{new Date(time).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <DayIcon size={28} className="text-emerald-500 mb-3" />
                <p className="text-xl font-bold text-white">{Math.round(dayMax)}°</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon, dark }: any) {
  return (
    <div className={`backdrop-blur-md p-4 rounded-2xl flex items-center gap-3 border ${dark ? 'bg-black/5 border-black/5' : 'bg-white/10 border-white/5'}`}>
      <Icon size={20} className={dark ? 'text-slate-800' : 'text-blue-200'} />
      <div className="text-right">
        <p className={`text-[8px] uppercase font-black mb-1 ${dark ? 'text-slate-600' : 'text-blue-200/60'}`}>{label}</p>
        <p className={`text-sm font-bold ${dark ? 'text-slate-900' : 'text-white'}`}>{value}</p>
      </div>
    </div>
  );
}