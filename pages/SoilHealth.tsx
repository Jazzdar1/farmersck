import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FlaskConical, ArrowRight, Save, TrendingUp, 
  Beaker, CalendarCheck, Info
} from 'lucide-react';

export default function SoilHealth() {
  const navigate = useNavigate();
  const puter = (window as any).puter;
  
  // State for lab results
  const [report, setReport] = useState({
    ph: "6.5", nitrogen: "Medium", phosphorus: "Low", potassium: "High"
  });

  // AI Logic: Determines what fertilizer is needed based on report
  const getRecommendation = () => {
    if (report.phosphorus === "Low") return { item: "DAP Fertilizer", reason: "Fosforus ki kami ko poora karne ke liye" };
    if (report.nitrogen === "Low") return { item: "Urea Application", reason: "Nitrogen badhane ke liye" };
    if (parseFloat(report.ph) < 5.5) return { item: "Lime Treatment", reason: "Mitti ki acidity kam karne ke liye" };
    return { item: "MOP / Potassium", reason: "Phal ki chamak ke liye" };
  };

  const syncToSchedule = async () => {
    const rec = getRecommendation();
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newEntry = {
      id: "soil-" + Date.now().toString(),
      stage: `Khaad: ${rec.item}`,
      dueDate: nextWeek,
      isDone: false,
      description: `Soil Analysis Suggestion: ${rec.reason}`,
      timestamp: new Date().toISOString()
    };

    const res = await puter.kv.get('fck_spray_db');
    const existing = JSON.parse(res || "[]");
    await puter.kv.set('fck_spray_db', JSON.stringify([newEntry, ...existing]));
    
    alert(`Zabardast! ${rec.item} ka schedule set ho gaya hai.`);
    navigate('/my-portal');
  };

  return (
    <div className="p-4 md:p-10 min-h-screen bg-slate-950 text-white text-right font-urdu" dir="rtl">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 bg-white/5 p-6 rounded-[2.5rem] border border-white/10">
        <button onClick={() => navigate('/my-portal')} className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl"><ArrowRight /></button>
        <div className="flex items-center gap-3">
          <FlaskConical className="text-emerald-500" />
          <h1 className="text-2xl font-black">مٹی کا تجزیہ اور منصوبہ بندی</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* INPUT BOX */}
        <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 shadow-2xl">
          <h2 className="text-xl font-black text-emerald-400 mb-6">لیب کی رپورٹ یہاں درج کریں</h2>
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase opacity-40">Phosphorus Level</label>
              <select 
                value={report.phosphorus} 
                onChange={(e) => setReport({...report, phosphorus: e.target.value})}
                className="bg-slate-900 border border-white/10 p-4 rounded-xl text-white outline-none"
              >
                <option value="Low">Low (کم)</option>
                <option value="Medium">Medium (درمیانہ)</option>
                <option value="High">High (زیادہ)</option>
              </select>
            </div>
            {/* Additional inputs for pH and Nitrogen follow same pattern */}
          </div>
        </div>

        {/* AI ACTION CARD */}
        <div className="space-y-6">
          <div className="bg-emerald-950/20 border-2 border-emerald-500/30 p-8 rounded-[3rem] relative overflow-hidden">
            <TrendingUp className="absolute -left-4 -top-4 text-emerald-500/5" size={150} />
            <h3 className="text-2xl font-black text-emerald-400 mb-4 flex items-center gap-2 flex-row-reverse">
              <Beaker /> خودکار مشورہ (AI)
            </h3>
            <p className="text-xl leading-relaxed text-slate-200">
              آپ کی رپورٹ کے مطابق مٹی میں **{report.phosphorus === 'Low' ? 'فاسفورس' : 'نائٹروجن'}** کی کمی ہے۔ اس کو پورا کرنے کے لیے اسپرے شیڈول میں تبدیلی ضروری ہے۔
            </p>

            <button 
              onClick={syncToSchedule}
              className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 p-6 rounded-[2rem] font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-600/20"
            >
              <CalendarCheck /> اس مشورے کو شیڈول میں شامل کریں
            </button>
          </div>

          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 flex items-start gap-4 flex-row-reverse">
            <Info className="text-cyan-400 shrink-0" />
            <p className="text-sm opacity-60">نیچے دیے گئے بٹن کو دبانے سے آپ کے مین پورٹل پر خود بخود اس کھاد کا الرٹ بن جائے گا۔</p>
          </div>
        </div>
      </div>
    </div>
  );
}