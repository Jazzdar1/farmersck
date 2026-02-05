import React, { useState, useEffect } from 'react';
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, Plus, Save, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FarmManager() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [form, setForm] = useState({ type: 'Expense', amount: '', category: '', desc: '' });

  useEffect(() => {
    const loadData = async () => {
       const puter = (window as any).puter;
       if(puter?.kv) {
          const data = await puter.kv.get('fck_finance');
          if(data) setTransactions(JSON.parse(data));
       }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    if(!form.amount || !form.desc) return;
    const newTx = { id: Date.now(), ...form, date: new Date().toISOString().split('T')[0] };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    setForm({ type: 'Expense', amount: '', category: '', desc: '' });
    
    const puter = (window as any).puter;
    if(puter?.kv) await puter.kv.set('fck_finance', JSON.stringify(updated));
  };

  const income = transactions.filter(t => t.type === 'Income').reduce((acc, t) => acc + Number(t.amount), 0);
  const expense = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + Number(t.amount), 0);

  return (
    <div className="min-h-screen bg-[#020408] text-white p-6 pb-24 font-sans" dir="rtl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/')} className="p-3 bg-white/5 rounded-2xl"><ArrowLeft /></button>
        <h1 className="text-2xl font-black italic">Farm Manager</h1>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-emerald-900/20 p-6 rounded-[2rem] border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2 text-emerald-400"><TrendingUp size={20} /><span className="text-xs font-bold uppercase">Income</span></div>
            <h2 className="text-3xl font-black text-white">₹{income.toLocaleString()}</h2>
        </div>
        <div className="bg-rose-900/20 p-6 rounded-[2rem] border border-rose-500/20">
            <div className="flex items-center gap-2 mb-2 text-rose-400"><TrendingDown size={20} /><span className="text-xs font-bold uppercase">Expense</span></div>
            <h2 className="text-3xl font-black text-white">₹{expense.toLocaleString()}</h2>
        </div>
      </div>

      {/* Form */}
      <div className="bg-[#0a0c10] p-6 rounded-[2rem] border border-white/5 mb-8">
         <div className="grid grid-cols-2 gap-4 mb-4">
             <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="bg-black/40 border border-white/10 p-3 rounded-xl text-white">
                 <option value="Expense">Kharcha (Expense)</option>
                 <option value="Income">Aamdani (Income)</option>
             </select>
             <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="bg-black/40 border border-white/10 p-3 rounded-xl text-white" />
         </div>
         <input type="text" placeholder="Description (e.g. Urea Bags)" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white mb-4" />
         <button onClick={handleSave} className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-bold uppercase tracking-widest text-xs">Add Record</button>
      </div>

      {/* List */}
      <div className="space-y-3">
         {transactions.map(t => (
             <div key={t.id} className="bg-[#0a0c10] p-4 rounded-2xl flex justify-between items-center border border-white/5">
                 <div className="text-right">
                     <p className="font-bold text-white">{t.desc}</p>
                     <p className="text-[10px] text-white/40">{t.date}</p>
                 </div>
                 <p className={`font-black ${t.type === 'Income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                     {t.type === 'Income' ? '+' : '-'} ₹{t.amount}
                 </p>
             </div>
         ))}
      </div>
    </div>
  );
}