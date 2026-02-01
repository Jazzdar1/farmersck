import React, { useState } from 'react';
import { Microscope, FlaskConical, Droplets, AlertTriangle, CheckCircle2, Sprout, Info } from 'lucide-react';

export default function SoilHealth() {
  const [ph, setPh] = useState<number>(6.5);
  
  // N-P-K Levels
  const nutrients = [
    { name: 'Nitrogen (N)', level: 'Medium', advice: 'Add Urea or Compost', color: 'text-blue-500' },
    { name: 'Phosphorus (P)', level: 'Low', advice: 'Add DAP or Bone Meal', color: 'text-orange-500' },
    { name: 'Potassium (K)', level: 'High', advice: 'No MOP needed for now', color: 'text-emerald-500' }
  ];

  return (
    <div className="p-4 md:p-10 space-y-10 text-right bg-black min-h-screen text-white pb-32" dir="rtl">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 bg-emerald-600/10 p-8 rounded-[3rem] border border-emerald-500/20 shadow-2xl">
        <div className="text-right">
          <h1 className="text-4xl font-black font-urdu text-emerald-500">مٹی کی صحت</h1>
          <p className="text-[10px] text-emerald-500/40 font-black uppercase tracking-widest mt-2 flex items-center justify-end gap-2">
             Soil Quality & Nutrient Guide
          </p>
        </div>
        <div className="bg-emerald-600 p-4 rounded-3xl text-white">
          <Microscope size={48} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 1. PH LEVEL ANALYZER */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0a0a0a] p-8 rounded-[3.5rem] border border-white/5 space-y-8">
            <div className="flex items-center gap-4 text-emerald-400">
              <FlaskConical size={28} />
              <h2 className="text-2xl font-black font-urdu text-white">پی ایچ (pH) ٹیسٹ</h2>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-5xl font-black text-white">{ph}</p>
              <input 
                type="range" min="4" max="9" step="0.1" 
                value={ph} onChange={(e) => setPh(parseFloat(e.target.value))}
                className="w-full h-3 bg-emerald-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase px-1">
                <span>Alkaline</span>
                <span>Neutral</span>
                <span>Acidic</span>
              </div>
            </div>

            <div className={`p-6 rounded-3xl text-center border ${ph >= 6 && ph <= 7 ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-rose-500/10 border-rose-500 text-rose-500'}`}>
              <p className="font-black font-urdu text-lg leading-relaxed">
                {ph >= 6 && ph <= 7 ? "یہ مٹی سیب کے باغ کے لیے بہترین ہے!" : "مٹی میں تیزابیت (Acidity) زیادہ ہے۔ چونا استعمال کریں۔"}
              </p>
            </div>
          </div>
        </div>

        {/* 2. NUTRIENT STATUS */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0a0a0a] p-8 rounded-[3.5rem] border border-white/5">
            <div className="flex items-center gap-4 text-emerald-400 mb-8">
              <Sprout size={28} />
              <h2 className="text-2xl font-black font-urdu text-white">غذائی اجزاء (Nutrients)</h2>
            </div>

            <div className="space-y-4">
              {nutrients.map((n, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-[2rem] border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-all">
                  <div className="text-left">
                    <p className={`font-black uppercase text-xs ${n.color}`}>{n.level}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{n.advice}</p>
                  </div>
                  <div className="text-right">
                    <h4 className="font-black font-urdu text-xl text-white">{n.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-[3rem] flex items-center gap-6 shadow-2xl">
         <Info className="text-amber-500 shrink-0" size={32} />
         <p className="text-lg font-bold font-urdu text-amber-200/60 leading-relaxed italic">
           "مشورہ: مٹی کا نمونہ ہمیشہ اسپرے کرنے سے پہلے لیں۔ نمونہ زمین سے 6 انچ گہرائی سے لیں۔"
         </p>
      </div>

    </div>
  );
}