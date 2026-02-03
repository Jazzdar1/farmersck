import React, { useState } from 'react';
import { TrendingUp, MapPin, ArrowUpRight, Search, BarChart3, Filter } from 'lucide-react';

export default function MarketPrices() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Example Data - In a real app, this would come from your KV database or an API
  const mandiData = [
    { id: 1, crop: 'Apple (Delicious)', mandi: 'Kulgam', price: '1200', trend: 'up', quality: 'A-Grade' },
    { id: 2, crop: 'Apple (American)', mandi: 'Srinagar', price: '950', trend: 'stable', quality: 'A-Grade' },
    { id: 3, crop: 'Apple (Kullu)', mandi: 'Shopian', price: '1400', trend: 'up', quality: 'Premium' },
    { id: 4, crop: 'Walnut', mandi: 'Anantnag', price: '4500', trend: 'down', quality: 'With Shell' },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Header & Search */}
      <div className="bg-emerald-600 p-6 md:p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black font-urdu mb-2">منڈی کے ریٹ</h1>
          <p className="text-emerald-100 text-[10px] uppercase tracking-widest font-black">Live J&K Mandi Analytics</p>
          
          <div className="mt-6 relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/50" size={18} />
            <input 
              type="text" 
              placeholder="Search Crop or Mandi..." 
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-4 pl-12 rounded-2xl text-white placeholder:text-white/50 outline-none focus:bg-white/20 transition-all font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <BarChart3 className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5" />
      </div>

      {/* 2. Smart Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-[2rem] flex items-center gap-4">
          <div className="bg-amber-500 p-3 rounded-2xl text-black"><TrendingUp size={24}/></div>
          <div>
            <p className="text-[10px] uppercase font-black text-amber-500/60 tracking-widest">Highest Rate Today</p>
            <p className="text-xl font-bold text-white">Shopian Mandi (Apple Kullu)</p>
          </div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-[2rem] flex items-center gap-4">
          <div className="bg-blue-500 p-3 rounded-2xl text-black"><Filter size={24}/></div>
          <div>
            <p className="text-[10px] uppercase font-black text-blue-500/60 tracking-widest">Market Status</p>
            <p className="text-xl font-bold text-white">Stable Trading Volume</p>
          </div>
        </div>
      </div>

      {/* 3. Responsive Data View */}
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase text-emerald-500/40 tracking-[0.3em] px-4">Current Market Rates</p>
        
        {/* MOBILE VIEW: Cards (Hidden on Large Screens) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {mandiData.map(item => (
            <div key={item.id} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] relative group active:scale-95 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">{item.crop}</h3>
                  <div className="flex items-center gap-1 text-emerald-500/60 text-[10px] font-black uppercase tracking-widest">
                    <MapPin size={10}/> {item.mandi}
                  </div>
                </div>
                <div className="bg-emerald-500 text-black px-4 py-2 rounded-xl font-black text-sm">
                  ₹{item.price}
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-4">
                 <span className="text-[10px] font-black text-white/40 uppercase">{item.quality}</span>
                 <button className="text-emerald-500 flex items-center gap-1 text-[10px] font-black uppercase">
                   View Trend <ArrowUpRight size={14}/>
                 </button>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP VIEW: Table (Hidden on Mobile) */}
        <div className="hidden md:block overflow-hidden rounded-[2rem] border border-white/5 bg-white/5">
          <table className="w-full text-right" dir="rtl">
            <thead className="bg-white/5 text-[10px] uppercase font-black text-emerald-500/50">
              <tr>
                <th className="p-6">فصل (Crop)</th>
                <th className="p-6">منڈی (Mandi)</th>
                <th className="p-6">کوالٹی (Quality)</th>
                <th className="p-6">ریٹ (Price/Box)</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {mandiData.map(item => (
                <tr key={item.id} className="border-t border-white/5 hover:bg-white/5 transition-all">
                  <td className="p-6 font-bold">{item.crop}</td>
                  <td className="p-6 text-white/60">{item.mandi}</td>
                  <td className="p-6 font-urdu">{item.quality === 'A-Grade' ? 'درجہ اول' : 'پریمیم'}</td>
                  <td className="p-6 text-emerald-500 font-black">₹{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}