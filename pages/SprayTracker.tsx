import React, { useState } from 'react';

const STAGES = ["Dormant Spray", "Silver Tip", "Green Tip", "Pink Bud", "Full Bloom", "Petal Fall", "Fruit Set", "Cover Spray", "Fertilizer (Khaad)"];

export default function SprayTracker() {
  const [stage, setStage] = useState(STAGES[0]);
  const [dueDate, setDueDate] = useState("");
  const puter = (window as any).puter;

  const saveSchedule = async () => {
    if (!dueDate) return alert("Pehle date select karein!");
    
    const newEntry = {
      id: Date.now().toString(),
      stage: stage,
      dueDate: dueDate,
      isDone: false, // Naya kaam shuru mein hamesha pending hoga
      timestamp: new Date().toISOString()
    };

    const res = await puter.kv.get('fck_spray_db');
    const updated = [newEntry, ...JSON.parse(res || "[]")];
    await puter.kv.set('fck_spray_db', JSON.stringify(updated));
    alert("Schedule set ho gaya! Portal par countdown shuru ho jayega.");
  };

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-white text-right" dir="rtl">
      <div className="max-w-xl mx-auto bg-[#1a1a1a] p-8 rounded-[3rem] border border-white/10 shadow-2xl">
        <h2 className="text-2xl font-black font-urdu mb-8 text-emerald-400">Spray/Khaad Schedule</h2>
        
        <div className="space-y-6">
          <div className="space-y-2 text-right">
            <label className="text-xs font-black text-emerald-500/50">Stage Chunain:</label>
            <select 
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full bg-slate-900 border border-white/20 p-4 rounded-2xl text-white font-bold outline-none appearance-none"
              style={{ color: 'white', backgroundColor: '#0f172a' }} // Fixed Dropdown Visibility
            >
              {STAGES.map(s => <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>)}
            </select>
          </div>

          <div className="space-y-2 text-right">
            <label className="text-xs font-black text-emerald-500/50">Date Chunain:</label>
            <input 
              type="date" 
              className="w-full bg-slate-900 border border-white/20 p-4 rounded-2xl text-white font-bold"
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <button onClick={saveSchedule} className="w-full bg-emerald-600 p-5 rounded-2xl font-black text-white hover:bg-emerald-500 shadow-xl shadow-emerald-600/20">
            Schedule Mehfooz Karein
          </button>
        </div>
      </div>
    </div>
  );
}