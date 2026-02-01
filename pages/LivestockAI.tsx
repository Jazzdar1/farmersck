import React, { useState, useRef } from 'react';
import { Camera, Heart, Loader2, Volume2, Rabbit, Syringe, RefreshCw } from 'lucide-react';
import { askAI } from '../services/puterService';

const LivestockAI: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [animal, setAnimal] = useState('Sheep');
  const [analysis, setAnalysis] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (imgBase64: string) => {
    setLoading(true);
    try {
      // Puter AI Prompt for Livestock
      const prompt = `System: You are a Veterinary AI specialized in Kashmiri livestock.
      Task: Analyze this ${animal} health data.
      Output JSON: {"condition": "Name", "severity": "High/Low", "advice": "Treatment", "urduSummary": "Urdu Translation"}`;
      
      const res = await askAI(`${prompt} [Image Data: ${imgBase64.substring(0, 50)}...]`, false);
      const match = res?.match(/\{.*\}/s);
      if (match) setAnalysis(JSON.parse(match[0]));
    } catch (err) {
      console.error("Vet AI Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        processImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 no-scrollbar" dir="rtl">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-right">
          <h2 className="text-3xl font-bold text-slate-900 font-urdu">مویشی پالن اے آئی (Livestock AI)</h2>
          <p className="text-slate-500 font-medium">بھیڑ، بکریوں اور گائے کے لیے طبی امداد۔</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm" dir="ltr">
          {['Sheep', 'Cattle', 'Goat'].map(t => (
            <button key={t} onClick={() => setAnimal(t)} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${animal === t ? 'bg-emerald-900 text-white' : 'text-slate-400'}`}>{t}</button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="relative bg-slate-900 rounded-[3rem] overflow-hidden aspect-square shadow-2xl flex items-center justify-center border-4 border-emerald-900/10">
            {image ? <img src={image} className="w-full h-full object-cover" /> : (
              <div className="text-center p-12 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <Rabbit className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <p className="text-white font-bold">تجزیہ کے لیے تصویر اپ لوڈ کریں</p>
              </div>
            )}
            {loading && <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-md flex flex-col items-center justify-center text-white"><Loader2 className="w-12 h-12 animate-spin mb-4 text-emerald-400" /><span className="font-bold">Analyzing Vitals...</span></div>}
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="w-full bg-emerald-600 text-white py-5 rounded-[2rem] font-bold shadow-xl flex items-center justify-center gap-3"><Camera className="w-6 h-6" /> Scan Now</button>
          <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
        </div>

        <div className="space-y-6">
          {analysis && (
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-2xl space-y-8 animate-in zoom-in-95">
              <div className="flex justify-between items-start">
                <div className="text-right">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${analysis.severity === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{analysis.severity} Risk</span>
                  <h3 className="text-4xl font-bold text-slate-900 mt-2 font-urdu">{analysis.condition}</h3>
                </div>
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><Heart className="w-8 h-8" /></div>
              </div>
              <div className="bg-emerald-950 p-8 rounded-[2.5rem] text-white space-y-4">
                 <h4 className="font-bold flex items-center gap-2 justify-end font-urdu"><Volume2 className="w-5 h-5 text-emerald-400" /> خلاصہ اور مشورہ</h4>
                 <p className="text-2xl font-medium leading-loose text-right font-urdu" dir="rtl">{analysis.urduSummary}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default LivestockAI;