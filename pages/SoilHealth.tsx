import React, { useState } from 'react';
import { FlaskConical, Loader2, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Info } from 'lucide-react';
import { askAI } from '../services/puterService';

const SoilHealth: React.FC = () => {
  const [soilType, setSoilType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const analyzeSoil = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      // Puter AI Prompt for Kashmiri Soil
      const prompt = `Act as a soil scientist for Kashmir. Analyze this: "${description}". Land Type: ${soilType}. 
      Provide: 1. Local Classification (Karewa/Nambal). 2. Nutrient status. 3. Suitable Kashmiri crops. 4. Urdu Summary.`;
      
      const response = await askAI(prompt, false);
      setResult(response || "Analysis failed.");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 p-4">
      <header className="text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center mx-auto text-emerald-600">
          <FlaskConical className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold">Soil Health Pro AI</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] border space-y-4">
          {["Karewa (Plateau)", "Loamy (Valley)", "Nambal (Marshy)"].map(t => (
            <button key={t} onClick={() => setSoilType(t)} className={`w-full p-4 rounded-xl text-sm font-bold border transition-all ${soilType === t ? 'bg-emerald-800 text-white' : 'bg-slate-50'}`}>{t}</button>
          ))}
        </div>

        <div className="md:col-span-2 space-y-6">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your soil..." className="w-full bg-slate-50 border rounded-[2rem] p-6 h-40 outline-none" />
          <button onClick={analyzeSoil} disabled={loading} className="w-full bg-emerald-600 text-white py-5 rounded-[2rem] font-bold shadow-xl flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />} Analyze Soil
          </button>

          {result && (
            <div className="bg-white p-8 rounded-[3rem] border-2 border-emerald-100 shadow-2xl animate-in zoom-in-95">
              <div className="prose prose-emerald max-w-none text-slate-700 whitespace-pre-wrap">{result}</div>
              <button onClick={() => setResult(null)} className="mt-6 w-full text-[10px] font-black uppercase text-slate-400 flex items-center justify-center gap-2"><RefreshCw size={12}/> New Test</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoilHealth;