import React, { useState, useEffect } from 'react';
import { TrendingUp, MapPin } from 'lucide-react';
import { getUserData } from '../services/puterService';

export default function MarketPrices() {
  const [rates, setRates] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getUserData('fck_mandi_db'); // ADMIN KEY MATCH
      if (res) setRates(res);
    };
    fetch();
  }, []);

  return (
    <div className="p-10 text-right bg-black min-h-screen text-white" dir="rtl">
      <h1 className="text-4xl font-black font-urdu text-emerald-400 mb-10">تازہ ترین منڈی ریٹ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rates.map(item => (
          <div key={item.id} className="bg-white/5 p-10 rounded-[3rem] border border-white/5 shadow-2xl text-center">
            <h3 className="text-3xl font-bold font-urdu mb-4">{item.crop}</h3>
            <p className="text-5xl font-black text-emerald-400 mb-6">{item.price}</p>
            <div className="flex items-center justify-center gap-2 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-t border-white/5 pt-6">
              <MapPin size={14}/> {item.market}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}