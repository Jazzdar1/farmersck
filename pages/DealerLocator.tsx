import React, { useState } from 'react';
import { MapPin, Navigation2, Loader2, ShieldCheck } from 'lucide-react';
import { askAI } from '../services/puterService';

const DealerLocator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleLocate = async () => {
    setLoading(true);
    try {
      const prompt = `Find 3 verified agriculture dealers in Srinagar. Return JSON: {"dealers": [{"name": "...", "loc": "...", "phone": "..."}]}`;
      const res = await askAI(prompt, false);
      const match = res?.match(/\{.*\}/s);
      if (match) setResults(JSON.parse(match[0]));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 text-center">
      <h2 className="text-3xl font-bold">Verified Dealer Locator</h2>
      <button onClick={handleLocate} className="bg-emerald-800 text-white px-10 py-5 rounded-[2.5rem] font-bold shadow-xl">
        {loading ? <Loader2 className="animate-spin" /> : <Navigation2 />} Locate Dealers
      </button>

      {results && (
        <div className="grid gap-4 mt-8">
          {results.dealers.map((d: any, i: number) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border shadow-sm flex justify-between items-center text-left">
              <div><p className="font-bold text-slate-900">{d.name}</p><p className="text-xs text-slate-400">{d.loc}</p></div>
              <p className="text-emerald-600 font-black">{d.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default DealerLocator;