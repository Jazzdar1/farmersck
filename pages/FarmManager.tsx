import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Beaker, Wallet, PieChart, LayoutGrid, 
  TrendingUp, TrendingDown, ArrowRight, 
  ShoppingBag, Landmark, ArrowUpRight, ArrowDownRight, Trash2, X, Check
} from 'lucide-react';

export default function FarmManager() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const puter = (window as any).puter;

  // Real Data State
  const [expenses, setExpenses] = useState<any[]>([]);
  const [income, setIncome] = useState<any[]>([]);

  // Form States
  const [formData, setFormData] = useState({ title: '', amount: '', type: 'expense', category: 'pesticide' });

  // 1. Load Data from Puter KV on Start
  useEffect(() => {
    const loadData = async () => {
      if (!puter) return;
      const res = await puter.kv.get('fck_farm_finance');
      if (res) {
        const parsed = JSON.parse(res);
        setExpenses(parsed.expenses || []);
        setIncome(parsed.income || []);
      }
    };
    loadData();
  }, [puter]);

  // 2. Save Data to Puter KV
  const saveData = async (newExpenses: any[], newIncome: any[]) => {
    if (!puter) return;
    await puter.kv.set('fck_farm_finance', JSON.stringify({ expenses: newExpenses, income: newIncome }));
  };

  // 3. Add Entry Logic
  const handleAddEntry = () => {
    if (!formData.title || !formData.amount) return;

    const newEntry = {
      id: Date.now(),
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    };

    let updatedExpenses = [...expenses];
    let updatedIncome = [...income];

    if (formData.type === 'expense') {
      updatedExpenses = [newEntry, ...expenses];
      setExpenses(updatedExpenses);
    } else {
      updatedIncome = [newEntry, ...income];
      setIncome(updatedIncome);
    }

    saveData(updatedExpenses, updatedIncome);
    setShowModal(false);
    setFormData({ title: '', amount: '', type: 'expense', category: 'pesticide' });
  };

  // 4. Delete Entry Logic
  const deleteEntry = (id: number, type: 'expense' | 'income') => {
    let updatedExpenses = [...expenses];
    let updatedIncome = [...income];

    if (type === 'expense') {
      updatedExpenses = expenses.filter(e => e.id !== id);
      setExpenses(updatedExpenses);
    } else {
      updatedIncome = income.filter(i => i.id !== id);
      setIncome(updatedIncome);
    }
    saveData(updatedExpenses, updatedIncome);
  };

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalIncome = income.reduce((acc, curr) => acc + curr.amount, 0);
  const profit = totalIncome - totalExpense;
  const isProfitable = profit >= 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-4 pb-28" dir="rtl">
      
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8 pt-4 px-2">
        <button onClick={() => navigate('/my-portal')} className="p-4 bg-white/5 rounded-3xl border border-white/10 active:scale-95 transition-all">
          <ArrowRight className="rotate-180 text-[#FFC107]" size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">Farm Analytics</h1>
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">Financial Command Center</p>
        </div>
        <div className="w-12 h-12 bg-white/5 rounded-3xl flex items-center justify-center text-[#FFC107] border border-white/10 shadow-2xl">
          <Landmark size={24} />
        </div>
      </header>

      {/* PROFIT & LOSS CARD */}
      <div className={`relative p-10 rounded-[4rem] border-2 overflow-hidden mb-8 shadow-2xl transition-all duration-700 ${isProfitable ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Net Balance</h4>
            <div className="flex items-center gap-3" dir="ltr">
               <span className="text-5xl font-black tracking-tighter">₹{Math.abs(profit).toLocaleString()}</span>
               {isProfitable ? <ArrowUpRight className="text-emerald-500" size={32}/> : <ArrowDownRight className="text-rose-500" size={32}/>}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
          <div dir="ltr"><p className="text-[8px] font-black text-white/30 uppercase mb-1">Income</p><p className="text-xl font-black text-emerald-400">₹{totalIncome.toLocaleString()}</p></div>
          <div dir="ltr"><p className="text-[8px] font-black text-white/30 uppercase mb-1">Expense</p><p className="text-xl font-black text-rose-400">₹{totalExpense.toLocaleString()}</p></div>
        </div>
      </div>

      {/* ADD BUTTONS */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button onClick={() => { setFormData({...formData, type: 'income'}); setShowModal(true); }} className="bg-emerald-500/10 p-6 rounded-[2.5rem] border border-emerald-500/20 flex flex-col items-center gap-2 hover:bg-emerald-500 hover:text-black transition-all group">
          <ShoppingBag size={24}/><span className="text-[10px] font-black uppercase">Add Sale (بیچیں)</span>
        </button>
        <button onClick={() => { setFormData({...formData, type: 'expense'}); setShowModal(true); }} className="bg-rose-500/10 p-6 rounded-[2.5rem] border border-rose-500/20 flex flex-col items-center gap-2 hover:bg-rose-500 transition-all group">
          <Beaker size={24}/><span className="text-[10px] font-black uppercase">Add Expense (خرچہ)</span>
        </button>
      </div>

      {/* HISTORY LIST */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4 px-2">History</h3>
        
        {/* Sales List */}
        {income.map(item => (
          <div key={item.id} className="bg-emerald-500/5 p-6 rounded-[2.5rem] border border-emerald-500/10 flex justify-between items-center group">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-emerald-500 rounded-2xl text-black"><Check size={18}/></div>
               <div><h4 className="text-lg font-black leading-none mb-1">{item.title}</h4><p className="text-[9px] font-black opacity-30">{item.date}</p></div>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-xl font-black text-emerald-400" dir="ltr">+₹{item.amount}</span>
               <button onClick={() => deleteEntry(item.id, 'income')} className="text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}

        {/* Expenses List */}
        {expenses.map(item => (
          <div key={item.id} className="bg-rose-500/5 p-6 rounded-[2.5rem] border border-rose-500/10 flex justify-between items-center group">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-rose-500 rounded-2xl text-white"><TrendingDown size={18}/></div>
               <div><h4 className="text-lg font-black leading-none mb-1">{item.title}</h4><p className="text-[9px] font-black opacity-30">{item.date} | {item.category}</p></div>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-xl font-black text-rose-400" dir="ltr">-₹{item.amount}</span>
               <button onClick={() => deleteEntry(item.id, 'expense')} className="text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>

      {/* ENTRY MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in">
          <div className="bg-[#111] w-full max-w-md rounded-[3.5rem] border border-white/10 p-8">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-black uppercase tracking-tighter">New {formData.type}</h2>
               <button onClick={() => setShowModal(false)} className="p-2 bg-white/5 rounded-full"><X/></button>
            </div>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase opacity-30 px-2">Description / تفصیل</p>
                  <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Urea, Labour, Apple Box..." className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-[#FFC107] text-[#FFC107] font-bold" />
               </div>
               <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase opacity-30 px-2">Amount / رقم</p>
                  <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0.00" className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-[#FFC107] text-[#FFC107] font-black text-2xl" dir="ltr" />
               </div>
               
               {formData.type === 'expense' && (
                 <div className="grid grid-cols-2 gap-2">
                    {['pesticide', 'fertilizer', 'labour', 'pruning'].map(c => (
                      <button key={c} onClick={() => setFormData({...formData, category: c})} className={`p-3 rounded-xl border text-[10px] font-black uppercase ${formData.category === c ? 'bg-[#FFC107] text-black border-[#FFC107]' : 'bg-white/5 border-white/10 text-white/40'}`}>{c}</button>
                    ))}
                 </div>
               )}

               <button onClick={handleAddEntry} className="w-full py-6 bg-[#FFC107] text-black rounded-[2.5rem] font-black uppercase text-xs shadow-xl active:scale-95 transition-all">Save Entry (محفوظ کریں)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}