import React, { useState } from 'react';
import { Rabbit, ShieldCheck, Thermometer, Syringe, MessageCircle, AlertCircle, Bot, Send } from 'lucide-react';
import { askAI } from '../services/puterService';

export default function LivestockAI() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Kashmir Specific Livestock Advice
  const handleAskAI = async () => {
    if (!query) return;
    setLoading(true);
    const prompt = `You are a Veterinary Expert for Kashmiri farmers. Help with this livestock issue in Urdu: ${query}`;
    const res = await askAI(prompt, false);
    setResponse(res || "Bhai, network ka masla hai. Dobara koshish karein.");
    setLoading(false);
  };

  const schedule = [
    { disease: 'FMD (Mun-Khur)', timing: 'March / Sept', status: 'Priority' },
    { disease: 'HS (Gal-Ghotu)', timing: 'May / June', status: 'Essential' },
    { disease: 'Anthrax', timing: 'Pre-Monsoon', status: 'Required' }
  ];

  return (
    <div className="p-4 md:p-10 space-y-10 text-right bg-black min-h-screen text-white pb-32" dir="rtl">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 bg-orange-600/10 p-8 rounded-[3rem] border border-orange-500/20 shadow-2xl">
        <div className="text-right">
          <h1 className="text-4xl font-black font-urdu text-orange-500">لائیو اسٹاک AI</h1>
          <p className="text-[10px] text-orange-500/40 font-black uppercase tracking-widest mt-2 flex items-center justify-end gap-2">
             Maveshi Health & Expert Advice
          </p>
        </div>
        <div className="bg-orange-600 p-4 rounded-3xl text-white shadow-2xl">
          <Rabbit size={48} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 1. AI SYMPTOM CHECKER */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#0a0a0a] p-8 rounded-[3.5rem] border border-white/5 space-y-6">
            <div className="flex items-center gap-4 text-orange-400">
              <Bot size={28} />
              <h2 className="text-2xl font-black font-urdu text-white">بیماری کی تشخیص (AI)</h2>
            </div>
            
            <p className="text-slate-400 font-urdu text-lg leading-relaxed">
              اپنے جانور کی علامات (Symptoms) لکھیں، جیسے "گائے کو بخار ہے" یا "بھیڑ کھانا نہیں کھا رہی"۔
            </p>

            <div className="relative mt-6">
              <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="یہاں لکھیں..."
                className="w-full bg-white/5 border border-white/10 p-6 rounded-[2rem] text-white font-urdu text-xl outline-none focus:border-orange-500/50 min-h-[150px] transition-all"
              />
              <button 
                onClick={handleAskAI}
                disabled={loading}
                className="absolute left-4 bottom-4 bg-orange-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-orange-700 transition-all flex items-center gap-2"
              >
                {loading ? "Checking..." : <><Send size={18}/> پوچھیں</>}
              </button>
            </div>

            {response && (
              <div className="bg-orange-500/5 border border-orange-500/20 p-8 rounded-[2.5rem] mt-6 animate-in fade-in duration-500">
                <p className="text-orange-500 font-black font-urdu mb-2">ماہر کا مشورہ:</p>
                <p className="text-xl font-bold font-urdu text-slate-200 leading-relaxed italic">"{response}"</p>
              </div>
            )}
          </div>
        </div>

        {/* 2. VACCINATION SCHEDULE */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0a0a0a] p-8 rounded-[3.5rem] border border-white/5">
            <div className="flex items-center gap-4 text-emerald-500 mb-8">
              <Syringe size={24} />
              <h2 className="text-2xl font-black font-urdu text-white">ٹیکہ جات (Vaccines)</h2>
            </div>
            
            <div className="space-y-4">
              {schedule.map((item, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">{item.status}</span>
                    <p className="font-black font-urdu text-xl text-white">{item.disease}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{item.timing}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 flex items-center gap-4">
              <ShieldCheck className="text-emerald-500" />
              <p className="text-xs font-bold text-emerald-200 uppercase tracking-tighter">Authorized Vaccination Guide</p>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Note */}
      <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-[3rem] flex items-center gap-6 shadow-2xl">
         <AlertCircle className="text-rose-500 shrink-0" size={32} />
         <p className="text-lg font-bold font-urdu text-rose-200/60 leading-relaxed italic">
           "اہم نوٹس: شدید بیماری کی صورت میں اپنے قریبی سرکاری ویٹرنری ڈاکٹر سے فوری رجوع کریں۔"
         </p>
      </div>

    </div>
  );
}