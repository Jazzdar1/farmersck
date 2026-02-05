import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Sprout, Save, Trash2, Calendar, 
  Droplets, DollarSign, CloudSun, CheckCircle2,
  FileText, FlaskConical, AlertTriangle, X 
} from 'lucide-react';

export default function SprayTracker() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [newLog, setNewLog] = useState({
    stage: 'Dormant',
    chemical: '',
    dosage: '',
    date: new Date().toISOString().split('T')[0],
    cost: '',
    notes: ''
  });

  // Logs State
  const [logs, setLogs] = useState<any[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  // Stages for Dropdown
  const STAGES = [
    "Dormant (Late Winter)",
    "Silver Tip / Green Tip",
    "Pink Bud",
    "Petal Fall",
    "Fruit Setting (Pea Size)",
    "Fruit Development (Walnut Size)",
    "Pre-Harvest"
  ];

  // === LOAD DATA ===
  useEffect(() => {
    const loadData = async () => {
      const puter = (window as any).puter;
      if (puter?.kv) {
        const savedLogs = await puter.kv.get('fck_spray_logs');
        if (savedLogs) {
           const parsed = JSON.parse(savedLogs);
           setLogs(parsed);
           calculateTotal(parsed);
        }
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // Calculate Total Cost
  const calculateTotal = (data: any[]) => {
    const total = data.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);
    setTotalCost(total);
  };

  // === SAVE LOG ===
  const handleSave = async () => {
    if (!newLog.chemical || !newLog.cost) return alert("Please fill Chemical Name & Cost");

    const entry = { id: Date.now(), ...newLog };
    const updatedLogs = [entry, ...logs];
    
    setLogs(updatedLogs);
    calculateTotal(updatedLogs);
    setNewLog({ stage: 'Dormant', chemical: '', dosage: '', date: new Date().toISOString().split('T')[0], cost: '', notes: '' });
    setShowForm(false);

    // Save to Cloud
    const puter = (window as any).puter;
    if (puter?.kv) {
        await puter.kv.set('fck_spray_logs', JSON.stringify(updatedLogs));
    }

    // Voice Feedback
    const msg = new SpeechSynthesisUtterance(`Spray recorded. Cost added: ${entry.cost} rupees.`);
    window.speechSynthesis.speak(msg);
  };

  // === DELETE LOG ===
  const handleDelete = async (id: number) => {
    if(!confirm("Delete this record?")) return;
    
    const updatedLogs = logs.filter(l => l.id !== id);
    setLogs(updatedLogs);
    calculateTotal(updatedLogs);

    const puter = (window as any).puter;
    if (puter?.kv) {
        await puter.kv.set('fck_spray_logs', JSON.stringify(updatedLogs));
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] text-white p-4 md:p-6 pb-24 font-sans" dir="rtl">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
         <button onClick={() => navigate('/my-portal')} className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl text-white/50 hover:text-white transition-all">
            <ArrowLeft size={20} />
         </button>
         <div className="text-right">
            <h1 className="text-2xl font-black italic tracking-tighter text-white">Spray Diary</h1>
            <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest font-urdu">اسپرے اور خرچے کا حساب</p>
         </div>
      </div>

      {/* 💰 COST SUMMARY CARD */}
      <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 p-8 rounded-[2.5rem] border border-emerald-500/30 mb-8 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[60px] rounded-full"></div>
         <div className="relative z-10 text-center">
            <p className="text-emerald-400 font-bold text-xs uppercase tracking-[0.3em] mb-2">Total Season Cost</p>
            <h2 className="text-5xl font-black text-white mb-2">₹{totalCost.toLocaleString()}</h2>
            <p className="text-white/40 text-[10px] uppercase">Total Sprays: {logs.length}</p>
         </div>
      </div>

      {/* 📝 ADD NEW BUTTON */}
      {!showForm && (
        <button 
          onClick={() => setShowForm(true)}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-3 transition-transform active:scale-95 mb-8"
        >
            <Sprout size={18} /> Log New Spray
        </button>
      )}

      {/* ✍️ NEW ENTRY FORM */}
      {showForm && (
        <div className="bg-[#0a0c10] border border-white/10 p-6 rounded-[2.5rem] mb-8 animate-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
                <h3 className="font-black italic text-white text-lg">New Entry</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-[10px] uppercase font-bold text-white/40 mb-1 block text-right">Stage (مرحلہ)</label>
                    <select 
                        value={newLog.stage} 
                        onChange={(e) => setNewLog({...newLog, stage: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-right focus:border-emerald-500 outline-none"
                    >
                        {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-white/40 mb-1 block text-right">Date</label>
                        <input type="date" value={newLog.date} onChange={(e) => setNewLog({...newLog, date: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-right" />
                    </div>
                    <div>
                         <label className="text-[10px] uppercase font-bold text-white/40 mb-1 block text-right">Cost (₹)</label>
                         <input type="number" placeholder="0" value={newLog.cost} onChange={(e) => setNewLog({...newLog, cost: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-right focus:border-emerald-500 outline-none" />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] uppercase font-bold text-white/40 mb-1 block text-right">Chemical / Fungicide</label>
                    <input type="text" placeholder="e.g. HMO, Captan, Urea..." value={newLog.chemical} onChange={(e) => setNewLog({...newLog, chemical: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-right focus:border-emerald-500 outline-none font-urdu" />
                </div>
                
                <div>
                    <label className="text-[10px] uppercase font-bold text-white/40 mb-1 block text-right">Dosage (Optional)</label>
                    <input type="text" placeholder="e.g. 200ml / 100L" value={newLog.dosage} onChange={(e) => setNewLog({...newLog, dosage: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-right focus:border-emerald-500 outline-none" />
                </div>

                <button 
                  onClick={handleSave}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-black uppercase text-xs tracking-widest mt-4 flex items-center justify-center gap-2"
                >
                    <Save size={16} /> Save Record
                </button>
            </div>
        </div>
      )}

      {/* 📜 HISTORY LIST */}
      <div className="space-y-4">
        <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4 pr-2">Recent History</h3>
        
        {loading ? <p className="text-center text-white/20">Loading...</p> : logs.length === 0 ? (
            <div className="text-center py-10 opacity-30">
                <FileText size={40} className="mx-auto mb-2" />
                <p className="text-xs uppercase">No records found</p>
            </div>
        ) : (
            logs.map((log) => (
                <div key={log.id} className="bg-[#0a0c10] p-5 rounded-[2rem] border border-white/5 hover:border-emerald-500/20 transition-all group animate-in slide-in-from-bottom-2">
                    <div className="flex justify-between items-start mb-2">
                         <button onClick={() => handleDelete(log.id)} className="text-white/20 hover:text-rose-500 p-2"><Trash2 size={16} /></button>
                         <div className="text-right">
                             <h4 className="font-bold text-white text-lg">{log.chemical}</h4>
                             <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-wider">{log.stage}</p>
                         </div>
                    </div>
                    
                    <div className="flex items-center justify-end gap-4 text-white/50 text-xs mt-2 border-t border-white/5 pt-3">
                         <div className="flex items-center gap-1"><FlaskConical size={12} /> {log.dosage || 'N/A'}</div>
                         <div className="flex items-center gap-1"><Calendar size={12} /> {log.date}</div>
                         <div className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded"><DollarSign size={12} /> ₹{log.cost}</div>
                    </div>
                </div>
            ))
        )}
      </div>

    </div>
  );
}