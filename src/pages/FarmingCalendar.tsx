import React, { useState } from 'react';
import { ArrowLeft, Calendar, CheckCircle2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FarmingCalendar() {
  const navigate = useNavigate();
  const [activeMonth, setActiveMonth] = useState('February');

  const tasks = {
    'February': [
        { title: "Dormant Oil Spray", status: "Critical", desc: "Apply HMO to kill scale eggs." },
        { title: "Pruning Completion", status: "Urgent", desc: "Finish cutting dead wood." },
        { title: "Clean Basins", status: "Normal", desc: "Remove weeds from tree base." }
    ],
    'March': [
        { title: "Green Tip Spray", status: "High", desc: "Captan + Mancozeb mix." },
        { title: "Grafting", status: "Normal", desc: "Best time for grafting." }
    ]
  };

  return (
    <div className="min-h-screen bg-[#020408] text-white p-6 pb-24 font-sans" dir="rtl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/')} className="p-3 bg-white/5 rounded-2xl"><ArrowLeft /></button>
        <h1 className="text-2xl font-black italic">Orchard Calendar</h1>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 mb-6 no-scrollbar">
         {['January', 'February', 'March', 'April', 'May'].map(m => (
             <button 
               key={m} 
               onClick={() => setActiveMonth(m)}
               className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest border ${activeMonth === m ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-[#0a0c10] text-white/40 border-white/5'}`}
             >
                 {m}
             </button>
         ))}
      </div>

      <div className="space-y-4">
         {(tasks as any)[activeMonth]?.map((task: any, idx: number) => (
             <div key={idx} className="bg-[#0a0c10] p-6 rounded-[2rem] border border-white/5 flex items-start justify-between">
                 <div className="bg-white/5 p-3 rounded-full text-white/20"><CheckCircle2 /></div>
                 <div className="text-right flex-1 mr-4">
                     <div className="flex justify-end items-center gap-2 mb-1">
                         <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${task.status === 'Critical' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>{task.status}</span>
                         <h3 className="font-bold text-white text-lg">{task.title}</h3>
                     </div>
                     <p className="text-white/50 text-sm font-urdu">{task.desc}</p>
                 </div>
             </div>
         )) || <p className="text-center text-white/30 mt-10">No tasks listed for this month.</p>}
      </div>
    </div>
  );
}