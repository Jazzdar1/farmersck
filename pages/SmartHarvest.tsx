import React, { useState } from 'react';
import { TrendingUp, Target, Zap, Loader2, Sparkles } from 'lucide-react';
import { askAI } from '../services/puterService';

const SmartHarvest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({ landSize: 10, crop: 'Apple', age: 15 });

  const handlePredict = async () => {
    setLoading(true);
    try {
      const prompt = `Predict agriculture yield for: ${formData.crop}, Land: ${formData.landSize} Kanals, Tree Age: ${formData.age} yrs in Kashmir. 
      Return JSON: {"estimatedYield": "...", "marketValue": "...", "riskFactors": ["...", "..."]}`;
      
      const res = await askAI(prompt, false);
      const match = res?.match(/\{.*\}/s);
      if (match) setResult(JSON.parse(match[0]));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 p-4">
      <header className="flex items-center gap-4">
        <div className="w-16 h-16 bg-emerald-900 text-white rounded-[2rem] flex items-center justify-center shadow-xl"><TrendingUp /></div>
        <h2 className="text-3xl font-bold">Yield Predictor AI</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] border space-y-6">
          <input type="number" value={formData.landSize} onChange={e => setFormData({...formData, landSize: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" placeholder="Land in Kanals" />
          <button onClick={handlePredict} className="w-full bg-emerald-900 text-white py-5 rounded-[2rem] font-bold shadow-xl">
            {loading ? <Loader2 className="animate-spin" /> : "Predict Harvest"}
          </button>
        </div>

        {result && (
          <div className="bg-emerald-950 p-10 rounded-[3.5rem] text-white space-y-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-bold border-b border-white/10 pb-4">Estimated Yield: {result.estimatedYield}</h3>
            <p className="text-emerald-400 font-bold uppercase text-[10px]">Market Value: {result.marketValue}</p>
            <ul className="text-sm opacity-70 space-y-2">{result.riskFactors.map((r:any, i:number) => <li key={i}>• {r}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
};
export default SmartHarvest;