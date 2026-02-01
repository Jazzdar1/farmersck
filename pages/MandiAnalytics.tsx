import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, MapPin, Calendar, ArrowUpRight, ArrowDownRight, Store } from 'lucide-react';
import { getUserData } from '../services/puterService';

export default function MandiAnalytics() {
  const [mandiData, setMandiData] = useState<any[]>([]);
  const puter = (window as any).puter;

  useEffect(() => {
    const fetchMandi = async () => {
      // Fetching prices updated by Admin
      const res = await puter.kv.get('fck_mandi_db');
      if (res) {
        setMandiData(JSON.parse(res));
      } else {
        // Default Sample Data for Kashmir
        setMandiData([
          { id: '1', crop: 'Apple (Delicious)', market: 'Kulgam', price: '800-1100', trend: 'up' },
          { id: '2', crop: 'Apple (Kullu)', market: 'Sopore', price: '900-1250', trend: 'up' },
          { id: '3', crop: 'Apple (American)', market: 'Srinagar', price: '600-850', trend: 'down' }
        ]);
      }
    };
    fetchMandi();
  }, []);

  return (
    <div className="p-4 md:p-10 bg-black min-h-screen text-right text-white" dir="rtl">
      
      {/* Header Section */}
      <header className="mb-10 space-y-4">
        <div className="flex items-center justify-between bg-amber-500/10 p-8 rounded-[3rem] border border-amber-500/20 shadow-2xl">
          <div className="text-right">
            <h1 className="text-4xl font-black font-urdu text-amber-500">منڈی ریٹس</h1>
            <p className="text-[10px] text-amber-500/40 font-black uppercase tracking-widest mt-2 flex items-center justify-end gap-2">
              <Calendar size={12}/> {new Date().toLocaleDateString('ur-PK')}
            </p>
          </div>
          <BarChart3 size={48} className="text-amber-500 animate-pulse" />
        </div>
      </header>

      {/* Market Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {mandiData.map((item) => (
          <div key={item.id} className="bg-[#0a0a0a] p-8 rounded-[3.5rem] border border-white/5 hover:border-amber-500/30 transition-all shadow-xl">
            <div className="flex justify-between items-start mb-6">
               {item.trend === 'up' ? 
                <ArrowUpRight className="text-emerald-500 bg-emerald-500/10 rounded-full p-2" size={32}/> : 
                <ArrowDownRight className="text-rose-500 bg-rose-500/10 rounded-full p-2" size={32}/>
               }
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.market} Mandi</p>
                  <h3 className="text-2xl font-black font-urdu text-white mt-1">{item.crop}</h3>
               </div>
            </div>
            
            <div className="flex items-end justify-between border-t border-white/5 pt-6">
               <p className="text-sm font-black text-emerald-500 uppercase tracking-widest">Per Box (Avg)</p>
               <p className="text-3xl font-black text-white">₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Expert Analysis Section */}
      <div className="bg-emerald-950/20 p-10 rounded-[4rem] border border-white/5 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-6">
           <TrendingUp className="text-emerald-500" size={28} />
           <h2 className="text-2xl font-black font-urdu text-emerald-400 uppercase">مارکیٹ تجزیہ</h2>
        </div>
        <p className="text-xl font-bold font-urdu text-emerald-100/60 leading-relaxed italic">
          "موجودہ رجحان کے مطابق، آنے والے دنوں میں ڈلیشیس سیب کی مانگ بڑھنے کا امکان ہے۔ کسانوں کو مشورہ دیا جاتا ہے کہ گریڈنگ پر خاص توجہ دیں۔"
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center opacity-20">
         <Store size={48} className="mx-auto mb-4 text-slate-500" />
         <p className="text-[10px] font-black uppercase tracking-[0.5em]">Verified by J&K Horticulture Marketing</p>
      </div>

    </div>
  );
}