import React, { useState, useEffect } from 'react';
import { 
  Store, TrendingUp, TrendingDown, Search, Mic, 
  Volume2, Languages, MapPin, Calendar, ArrowRightLeft, Loader2 
} from 'lucide-react';
import { askAI } from '../services/puterService';

const MarketPrices: React.FC = () => {
  const [langMode, setLangMode] = useState<'ur' | 'en'>('ur');
  const [searchQuery, setSearchQuery] = useState('');
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 1. AI Simulated Mandi Data (Srinagar/Sopore focus)
  const fetchMarketRates = async () => {
    setLoading(true);
    try {
      const prompt = `Provide current market prices for Kashmiri fruits (Apple varieties, Pear, Walnut) in Srinagar and Sopore mandis. 
      Return ONLY a JSON array: [{"item": "Apple Kullu", "price": "1200-1500", "unit": "Box", "trend": "up", "mandi": "Srinagar"}, ...]`;
      const res = await askAI(prompt, false);
      const match = res?.match(/\[.*\]/s);
      if (match) setMarketData(JSON.parse(match[0]));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchMarketRates(); }, []);

  const speakRate = (item: string, price: string, mandi: string) => {
    window.speechSynthesis.cancel();
    const text = langMode === 'ur' 
      ? `${mandi} منڈی میں ${item} کا ریٹ ${price} روپے فی باکس ہے`
      : `In ${mandi} market, ${item} rate is ${price} per box.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMode === 'ur' ? 'ur-PK' : 'en-US';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32 px-4 animate-in fade-in duration-700">
      
      {/* Header with Language Toggle */}
      <div className="bg-emerald-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-right order-1 md:order-2" dir="rtl">
            <h2 className="text-3xl font-black font-urdu">منڈی ریٹس (Market Prices)</h2>
            <p className="text-emerald-200 text-sm font-bold flex items-center justify-end gap-2">
              <Calendar className="w-4 h-4" /> {new Date().toLocaleDateString('ur-PK')}
            </p>
          </div>
          <button 
            onClick={() => setLangMode(langMode === 'ur' ? 'en' : 'ur')}
            className="order-2 md:order-1 bg-white/10 px-6 py-3 rounded-2xl border border-white/20 font-bold hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <Languages className="w-5 h-5" /> {langMode === 'ur' ? 'English' : 'اردو'}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-[2.5rem] shadow-lg border flex items-center gap-4 px-8">
        <Search className="text-slate-400" />
        <input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={langMode === 'ur' ? "پھل یا منڈی کا نام لکھیں..." : "Search fruit or market..."}
          className="flex-1 bg-transparent outline-none font-bold text-slate-700 font-urdu"
          dir={langMode === 'ur' ? 'rtl' : 'ltr'}
        />
        <button className="p-3 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100"><Mic className="w-5 h-5" /></button>
      </div>

      {/* Prices Grid */}
      {loading ? (
        <div className="py-20 text-center"><Loader2 className="animate-spin w-12 h-12 text-emerald-600 mx-auto" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketData.map((data, i) => (
            <div key={i} className="bg-white p-8 rounded-[3rem] border shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${data.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                  {data.trend === 'up' ? <TrendingUp /> : <TrendingDown />}
                </div>
                <div className="text-right" dir="rtl">
                   <p className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1 justify-end"><MapPin className="w-3 h-3" /> {data.mandi}</p>
                   <h3 className="text-2xl font-black text-slate-800 font-urdu">{data.item}</h3>
                </div>
              </div>
              
              <div className="flex justify-between items-end border-t pt-6">
                <button 
                  onClick={() => speakRate(data.item, data.price, data.mandi)}
                  className="bg-slate-100 p-4 rounded-2xl hover:bg-emerald-900 hover:text-white transition-all"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <div className="text-right">
                   <p className="text-3xl font-black text-emerald-700">₹{data.price}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Per {data.unit}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketPrices;