import React, { useState } from 'react';
import { TrendingUp, Target, Zap, Loader2, Sparkles, MapPin, TreeDeciduous, Info } from 'lucide-react';
import { askAI } from '../services/puterService';

const SmartHarvest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({ landSize: 10, crop: 'Apple (Delicious)', age: 15 });

  const handlePredict = async () => {
    setLoading(true);
    try {
      // AI Prompt tuned for Kashmir
      const prompt = `Predict agriculture yield for a Kashmiri orchard: ${formData.crop}, Land: ${formData.landSize} Kanals, Tree Age: ${formData.age} years. 
      Return JSON in Urdu: {"estimatedYield": "...", "marketValue": "...", "riskFactors": ["risk 1", "risk 2"]}`;
      
      const res = await askAI(prompt, false);
      const match = res?.match(/\{.*\}/s);
      if (match) setResult(JSON.parse(match[0]));
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="p-4 md:p-10 space-y-10 text-right bg-black min-h-screen text-white pb-32" dir="rtl">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 bg-emerald-600/10 p-8 rounded-[3rem] border border-emerald-500/20 shadow-2xl">
        <div className="text-right">
          <h1 className="text-4xl font-black font-urdu text-emerald-500">فصل کا تخمینہ</h1>
          <p className="text-[10px] text-emerald-500/40 font-black uppercase tracking-widest mt-2 flex items-center justify-end gap-2">
             AI Yield & Market Value Predictor
          </p>
        </div>
        <div className="bg-emerald-600 p-4 rounded-3xl text-white">
          <TrendingUp size={48} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Form */}
        <div className="bg-[#0a0a0a] p-10 rounded-[4rem] border border-white/5 space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest flex items-center justify-end gap-2">Zameen (Kanals) <MapPin size={12}/></label>
              <input 
                type="number" 
                value={formData.landSize} 
                onChange={e => setFormData({...formData, landSize: Number(e.target.value)})} 
                className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-2xl font-black outline-none focus:border-emerald-500/50 text-left" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest flex items-center justify-end gap-2">Tree Age (Years) <TreeDeciduous size={12}/></label>
              <input 
                type="number" 
                value={formData.age} 
                onChange={e => setFormData({...formData, age: Number(e.target.value)})} 
                className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-2xl font-black outline-none focus:border-emerald-500/50 text-left" 
              />
            </div>
          </div>

          <button 
            onClick={handlePredict} 
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-6 rounded-[2.5rem] font-black text-xs uppercase shadow-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={20}/> تخمینہ لگائیں (Predict)</>}
          </button>
        </div>

        {/* Prediction Results */}
        {result ? (
          <div className="bg-emerald-950/20 p-10 rounded-[4.5rem] border border-emerald-500/30 text-white space-y-8 shadow-2xl animate-in zoom-in-95 relative overflow-hidden">
            <div className="relative z-10">
              <div className="border-b border-white/10 pb-6">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Estimated Yield</p>
                <h3 className="text-4xl font-black font-urdu">{result.estimatedYield}</h3>
              </div>
              
              <div className="py-6">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Expected Market Value</p>
                <p className="text-3xl font-black text-white">{result.marketValue}</p>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Risk Factors</p>
                <ul className="space-y-3">
                  {result.riskFactors.map((r:any, i:number) => (
                    <li key={i} className="flex items-start gap-3 text-lg font-urdu text-slate-300">
                      <Zap className="text-rose-500 mt-1 shrink-0" size={16} /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Sparkles className="absolute -left-10 -bottom-10 w-64 h-64 text-white/5" />
          </div>
        ) : (
          <div className="bg-white/5 border border-dashed border-white/10 rounded-[4.5rem] flex flex-col items-center justify-center p-10 text-center opacity-30">
             <Target size={64} className="mb-4 text-slate-500" />
             <p className="font-urdu text-xl italic">ڈیٹا درج کریں اور تخمینہ حاصل کریں</p>
          </div>
        )}
      </div>

      {/* Note */}
      <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-[3rem] flex items-center gap-6">
         <Info className="text-amber-500 shrink-0" size={32} />
         <p className="text-lg font-bold font-urdu text-amber-200/60 leading-relaxed italic">
           "توجہ: یہ تخمینہ پچھلے سال کے ڈیٹا اور موجودہ حالات پر مبنی ہے۔ اصل پیداوار مختلف ہو سکتی ہے۔"
         </p>
      </div>

    </div>
  );
};
export default SmartHarvest;