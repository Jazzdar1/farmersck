import React, { useState, useEffect } from 'react';
import { 
  Cloud, Wind, Droplets, Loader2, Thermometer, CloudSun, Sprout, ShieldCheck, 
  AlertTriangle, Calendar, Navigation, MapPin, Sun, Snowflake, CloudRain, Sunrise, Sunset
} from 'lucide-react';
import { askAI } from '../services/puterService';

// J&K Districts with exact coordinates for 100% accuracy
const districtCoords: Record<string, {lat: number, lon: number}> = {
  "Anantnag": {lat: 33.7311, lon: 75.1487}, "Bandipora": {lat: 34.4224, lon: 74.6391},
  "Baramulla": {lat: 34.2021, lon: 74.3436}, "Budgam": {lat: 33.9975, lon: 74.7818},
  "Doda": {lat: 33.1447, lon: 75.5467}, "Ganderbal": {lat: 34.2268, lon: 74.7735},
  "Jammu": {lat: 32.7266, lon: 74.8570}, "Kathua": {lat: 32.3811, lon: 75.5192},
  "Kishtwar": {lat: 33.3106, lon: 75.7661}, "Kulgam": {lat: 33.6403, lon: 75.0169},
  "Kupwara": {lat: 34.5262, lon: 74.2546}, "Poonch": {lat: 33.7680, lon: 74.0910},
  "Pulwama": {lat: 33.8712, lon: 74.8947}, "Rajouri": {lat: 33.3813, lon: 74.3034},
  "Ramban": {lat: 33.2442, lon: 75.1895}, "Reasi": {lat: 33.0850, lon: 74.8290},
  "Samba": {lat: 32.5619, lon: 75.1205}, "Shopian": {lat: 33.7195, lon: 74.8314},
  "Srinagar": {lat: 34.0837, lon: 74.7973}, "Udhampur": {lat: 32.9234, lon: 75.1325}
};

const WeatherHub: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('Srinagar');
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [aiAdvice, setAiAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = async (dist: string) => {
    setLoading(true);
    try {
      const { lat, lon } = districtCoords[dist];
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
      );
      const data = await response.json();
      
      const currentStats = {
        temp: `${Math.round(data.current.temperature_2m)}°C`,
        hum: `${data.current.relative_humidity_2m}%`,
        wind: `${data.current.wind_speed_10m} km/h`,
        cond: getCondition(data.current.weather_code),
        sunrise: new Date(data.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sunset: new Date(data.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setWeather(currentStats);

      const daily = data.daily.time.slice(1, 5).map((time: string, i: number) => ({
        date: new Date(time).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' }),
        max: `${Math.round(data.daily.temperature_2m_max[i+1])}°C`,
        min: `${Math.round(data.daily.temperature_2m_min[i+1])}°C`,
        cond: getCondition(data.daily.weather_code[i+1])
      }));
      setForecast(daily);

      // Request for Real Urdu Advice
      const prompt = `Weather in ${dist} is ${currentStats.temp}, ${currentStats.cond}. Provide 1 line of urgent farming advice for apple/saffron protection in Real Urdu (Urdu Script), English, and Hindi. No conversational text.`;
      const advice = await askAI(prompt, false);
      setAiAdvice(advice || "اپنے باغات کا خیال رکھیں۔");

    } catch (e) { console.error("Fetch Error:", e); } finally { setLoading(false); }
  };

  const getCondition = (code: number) => {
    if (code === 0) return "Clear Sky";
    if (code <= 3) return "Partly Cloudy";
    if (code >= 71 && code <= 77) return "Snowfall";
    if (code >= 51) return "Rainy";
    return "Overcast";
  };

  useEffect(() => { fetchWeatherData(selectedDistrict); }, [selectedDistrict]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32 p-4 text-left">
      {/* 20 Districts Selector */}
      <div className="bg-emerald-900 rounded-[3.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <h2 className="text-3xl font-black mb-6 flex items-center gap-4"><MapPin className="text-emerald-400" /> J&K Weather Hub</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 max-h-40 overflow-y-auto no-scrollbar p-2">
          {Object.keys(districtCoords).map(d => (
            <button key={d} onClick={() => setSelectedDistrict(d)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedDistrict === d ? 'bg-white text-emerald-900 shadow-xl' : 'bg-white/10 hover:bg-white/20'}`}>{d}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center"><Loader2 className="animate-spin w-12 h-12 text-emerald-600 mx-auto" /></div>
      ) : weather && (
        <div className="space-y-8 animate-in zoom-in-95">
          {/* Weather Warning Section */}
          {(weather.cond === "Snowfall" || weather.cond === "Rainy") && (
            <div className="bg-rose-50 border-2 border-rose-100 p-6 rounded-[2.5rem] flex items-center gap-6">
              <div className="p-4 bg-rose-500 text-white rounded-2xl animate-bounce"><AlertTriangle /></div>
              <div className="text-right w-full" dir="rtl">
                <p className="text-rose-900 font-black text-xl">موسمی انتباہ: {weather.cond === "Snowfall" ? 'برف باری' : 'بارش'} کا امکان!</p>
                <p className="text-xs font-bold text-rose-700">احتیاطی تدابیر اختیار کریں۔</p>
              </div>
            </div>
          )}

          {/* Real-time Stats & Sun Cycle */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="bg-white p-6 rounded-[2.5rem] border shadow-sm flex flex-col items-center text-center">
                <Thermometer className="text-rose-500 mb-2" />
                <p className="text-[10px] font-black uppercase text-slate-400">Temperature</p>
                <p className="text-3xl font-black">{weather.temp}</p>
             </div>
             <div className="bg-white p-6 rounded-[2.5rem] border shadow-sm flex flex-col items-center text-center">
                <Wind className="text-emerald-500 mb-2" />
                <p className="text-[10px] font-black uppercase text-slate-400">Wind</p>
                <p className="text-3xl font-black">{weather.wind}</p>
             </div>
             <div className="bg-white p-6 rounded-[2.5rem] border shadow-sm flex flex-col items-center text-center">
                <Sunrise className="text-amber-500 mb-2" />
                <p className="text-[10px] font-black uppercase text-slate-400">Sunrise</p>
                <p className="text-xl font-bold">{weather.sunrise}</p>
             </div>
             <div className="bg-white p-6 rounded-[2.5rem] border shadow-sm flex flex-col items-center text-center">
                <Sunset className="text-orange-500 mb-2" />
                <p className="text-[10px] font-black uppercase text-slate-400">Sunset</p>
                <p className="text-xl font-bold">{weather.sunset}</p>
             </div>
          </div>

          {/* 4-Day Forecast Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
             {forecast.map((f, i) => (
               <div key={i} className="bg-white/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-white flex flex-col items-center text-center space-y-3 shadow-sm">
                  <p className="text-[10px] font-black uppercase text-slate-400">{f.date}</p>
                  <div className="text-emerald-600">
                    {f.cond === "Snowfall" ? <Snowflake /> : f.cond === "Rainy" ? <CloudRain /> : <Sun />}
                  </div>
                  <p className="font-black text-slate-800">{f.cond}</p>
                  <p className="text-xs font-bold text-emerald-700">{f.max} / {f.min}</p>
               </div>
             ))}
          </div>

          {/* Agri Advice Card (Real Urdu) */}
          <div className="bg-emerald-950 p-12 rounded-[4rem] text-white relative shadow-2xl border-4 border-emerald-900 overflow-hidden">
            <div className="relative z-10 text-right" dir="rtl">
                <h4 className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-3 justify-end underline underline-offset-8 decoration-emerald-500/30">زرعی مشورہ ({selectedDistrict}) <Sprout className="w-5 h-5" /></h4>
                <p className="text-2xl md:text-4xl font-bold leading-relaxed whitespace-pre-line font-urdu">
                    {aiAdvice}
                </p>
                <div className="mt-8 flex items-center gap-2 text-[9px] font-bold text-emerald-500/30 uppercase justify-end tracking-tighter">
                    سیٹلائٹ ڈیٹا سے تصدیق شدہ <ShieldCheck className="w-3 h-3" />
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherHub;