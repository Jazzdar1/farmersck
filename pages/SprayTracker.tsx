import React, { useState, useEffect, useMemo } from 'react';
import { 
  Syringe, CheckCircle2, ShieldCheck, Droplets, Plus, Trash2, 
  FileText, Filter, AlertTriangle, Sprout, Leaf, Snowflake, Sun, Activity, X, Share2
} from 'lucide-react';

// Official SKUAST-K Protocol 2024
const SPRAY_PROTOCOL = [
  { id: 1, title: "Dormant Stage", timing: "Late Feb", chem: "HMO / TSO Oil", desc: "San Jose Scale", icon: Snowflake, activeMonth: 1 },
  { id: 2, title: "Green Tip", timing: "Mid March", chem: "Captan / Dodine", desc: "Primary Scab", icon: Sprout, activeMonth: 2 },
  { id: 3, title: "Pink Bud", timing: "Early April", chem: "Mancozeb / Zineb", desc: "Pre-Bloom Scab", icon: Leaf, activeMonth: 3 },
  { id: 4, title: "Petal Fall", timing: "Late April", chem: "Difenoconazole", desc: "Systemic Scab", icon: Droplets, activeMonth: 3 },
  { id: 5, title: "Fruit Set", timing: "Mid May", chem: "Mancozeb + Boron", desc: "Pea Size Stage", icon: Activity, activeMonth: 4 },
  { id: 6, title: "Fruit Dev I", timing: "June", chem: "Chlorpyrifos + Urea", desc: "Pests Control", icon: Sun, activeMonth: 5 },
  { id: 7, title: "Fruit Dev II", timing: "July", chem: "Propineb / Ziram", desc: "Cover Spray", icon: Sun, activeMonth: 6 },
  { id: 8, title: "Pre-Harvest", timing: "August", chem: "Carbendazim", desc: "Storage Rot", icon: CheckCircle2, activeMonth: 7 }
];

const SprayTracker: React.FC = () => {
  const [logs, setLogs] = useState<any[]>(() => JSON.parse(localStorage.getItem('fck_pesticide_logs') || '[]'));
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentStageId, setCurrentStageId] = useState(3);
  
  const [newLog, setNewLog] = useState<any>({
    date: new Date().toISOString().split('T')[0],
    type: 'Contact',
    chemicalName: '',
    brandName: '',
    stageId: '',
  });

  useEffect(() => {
    localStorage.setItem('fck_pesticide_logs', JSON.stringify(logs));
    const month = new Date().getMonth();
    const stage = SPRAY_PROTOCOL.find(s => s.activeMonth === month);
    if (stage) setCurrentStageId(stage.id);
  }, [logs]);

  const addLog = () => {
    if (!newLog.chemicalName || !newLog.date) return;
    const log = { id: Date.now().toString(), ...newLog };
    setLogs((prev) => [log, ...prev]);
    setShowAddForm(false);
    setNewLog({ date: new Date().toISOString().split('T')[0], type: 'Contact', chemicalName: '', brandName: '', stageId: '' });
  };

  const getStageStatus = (stageId: number) => {
    const isLogged = logs.some(l => l.stageId === stageId.toString());
    if (isLogged) return 'completed';
    if (stageId === currentStageId) return 'active';
    return 'pending';
  };

  return (
    <div className="p-4 md:p-10 space-y-10 text-right bg-black min-h-screen text-white pb-32" dir="rtl">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#0a0a0a] p-8 rounded-[3rem] border border-white/5">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl">
            <Syringe className="text-white" size={40} />
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-black font-urdu text-emerald-400">اسپرے آڈیٹر</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 italic">Official Valley Orchard Protocol</p>
          </div>
        </div>
        <button onClick={() => setShowAddForm(true)} className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase shadow-2xl hover:bg-emerald-700 transition-all flex items-center gap-3">
          <Plus size={20}/> نئی انٹری درج کریں
        </button>
      </header>

      {/* Protocol Visualizer */}
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase text-emerald-500/40 tracking-[0.4em] px-4">SKUAST-K 2024 شیڈول</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SPRAY_PROTOCOL.map((stage) => {
            const status = getStageStatus(stage.id);
            return (
              <div key={stage.id} className={`p-6 rounded-[2.5rem] border transition-all ${
                status === 'active' ? 'bg-emerald-600/20 border-emerald-500 shadow-xl' : 
                status === 'completed' ? 'bg-white/5 border-emerald-900/50 opacity-50' : 
                'bg-white/5 border-white/5'
              }`}>
                <div className="flex justify-between items-start mb-4">
                   <stage.icon size={24} className={status === 'active' ? 'text-emerald-400 animate-pulse' : 'text-slate-500'} />
                   {status === 'completed' && <CheckCircle2 size={16} className="text-emerald-500" />}
                </div>
                <h4 className="font-black font-urdu text-xl text-white">{stage.title}</h4>
                <p className="text-[10px] text-emerald-500/60 font-black mt-1 uppercase">{stage.timing}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Log Form Overlay */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] p-10 rounded-[4rem] border border-white/10 w-full max-w-2xl space-y-8 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
               <h3 className="text-3xl font-black font-urdu text-emerald-400">انٹری شامل کریں</h3>
               <button onClick={() => setShowAddForm(false)} className="p-3 bg-white/5 rounded-2xl"><X size={24}/></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 mr-2">تاریخ</label>
                  <input type="date" value={newLog.date} onChange={e => setNewLog({...newLog, date: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all font-bold" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 mr-2">پروٹوکول اسٹیج</label>
                  <select value={newLog.stageId} onChange={e => setNewLog({...newLog, stageId: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all font-bold">
                    <option value="">دستی انٹری (Manual)</option>
                    {SPRAY_PROTOCOL.map(s => <option key={s.id} value={s.id}>اسٹیج {s.id}: {s.title}</option>)}
                  </select>
               </div>
               <input placeholder="دوائی کا نام (Active Molecule)" value={newLog.chemicalName} onChange={e => setNewLog({...newLog, chemicalName: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-emerald-500 font-urdu text-lg" />
               <input placeholder="برانڈ کا نام (Brand Name)" value={newLog.brandName} onChange={e => setNewLog({...newLog, brandName: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-emerald-500 font-urdu text-lg" />
            </div>

            <button onClick={addLog} className="w-full bg-emerald-600 text-white py-6 rounded-[2.5rem] font-black text-xs uppercase shadow-2xl hover:bg-emerald-700 transition-all">کلاؤڈ میں محفوظ کریں</button>
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="bg-[#0a0a0a] p-10 rounded-[4rem] border border-white/5 shadow-2xl">
        <h3 className="text-2xl font-black font-urdu text-white mb-8 flex items-center gap-3">
          <FileText className="text-emerald-500" /> اسپرے کی تاریخ (History)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-white/5">
                <th className="pb-6">تاریخ</th>
                <th className="pb-6">اسٹیج</th>
                <th className="pb-6">دوائی / برانڈ</th>
                <th className="pb-6 text-left">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map(log => {
                const stage = SPRAY_PROTOCOL.find(s => s.id.toString() === log.stageId);
                return (
                  <tr key={log.id} className="group hover:bg-white/5 transition-all">
                    <td className="py-8 font-bold text-slate-200">{new Date(log.date).toLocaleDateString('ur-PK')}</td>
                    <td className="py-8">
                       <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${stage ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-slate-500'}`}>
                         {stage ? `اسٹیج ${stage.id}` : 'Manual'}
                       </span>
                    </td>
                    <td className="py-8">
                       <p className="font-bold text-white text-lg">{log.chemicalName}</p>
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{log.brandName}</p>
                    </td>
                    <td className="py-8 text-left">
                       <button onClick={() => setLogs(logs.filter(l => l.id !== log.id))} className="p-4 text-rose-500/30 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all">
                         <Trash2 size={20}/>
                       </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safety Alert */}
      <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-[3.5rem] flex items-center gap-6 shadow-2xl">
         <AlertTriangle className="text-amber-500 shrink-0" size={32} />
         <p className="text-xl font-bold font-urdu text-amber-200/60 leading-relaxed italic">
           "احتیاط: اسپرے کے دوران ماسک اور چشمہ پہننا نہ بھولیں، اور بچوں کو باغ سے دور رکھیں۔"
         </p>
      </div>

    </div>
  );
};

export default SprayTracker;