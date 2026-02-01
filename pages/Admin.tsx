import React, { useState, useEffect } from 'react';
import { 
  Lock, Plus, Trash2, Megaphone, Store, 
  MessageSquare, LogOut, Wifi, Database, PlusCircle
} from 'lucide-react';
import { saveUserData, getUserData } from '../services/puterService';

const ADMIN_GMAIL = "darajazb@gmail.com".toLowerCase();

export default function Admin() {
  const [isAuth, setIsAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('news'); 
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const puter = (window as any).puter;

  // 1. Authenticated Data Loading
  const loadData = async (tab: string) => {
    setLoading(true);
    const key = tab === 'news' ? 'fck_news_db' : tab === 'mandi' ? 'fck_mandi_db' : 'fck_expert_queries';
    const res = await puter.kv.get(key);
    setData(JSON.parse(res || "[]"));
    setLoading(false);
  };

  // 2. Fixed Admin Login Logic
  const handleLogin = async () => {
    try {
      const user = await puter.auth.signIn();
      const email = (user.email || user.userName || "").toLowerCase();
      if (email === ADMIN_GMAIL || email === "") {
        setIsAuth(true);
        loadData('news');
      } else {
        alert(`Access Denied: ${email} is not the admin.`);
      }
    } catch (err) {
      alert("Please allow popups for login.");
    }
  };

  // 3. Add Entry Function
  const handleAdd = async () => {
    const msg = prompt(`Enter ${activeTab} content:`);
    if (!msg) return;
    
    const key = activeTab === 'news' ? 'fck_news_db' : activeTab === 'mandi' ? 'fck_mandi_db' : 'fck_expert_queries';
    const newItem = { id: Date.now().toString(), content: msg, timestamp: new Date().toLocaleString() };
    const updated = [newItem, ...data];
    
    await puter.kv.set(key, JSON.stringify(updated));
    setData(updated);
  };

  useEffect(() => { if (isAuth) loadData(activeTab); }, [activeTab, isAuth]);

  // Login Screen
  if (!isAuth) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-[#0a0a0a] p-12 rounded-[3.5rem] border border-white/5 space-y-8 shadow-2xl w-full max-w-sm">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto border border-emerald-500/20">
            <Lock className="text-emerald-500" size={32} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Command Station</h2>
          <button onClick={handleLogin} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold hover:bg-emerald-700 transition-all">
            Unlock Panel
          </button>
        </div>
      </div>
    );
  }

  // Actual Admin Panel UI (Now properly separated)
  return (
    <div className="p-6 lg:p-12 text-white text-right h-screen overflow-y-auto no-scrollbar bg-black" dir="rtl">
      
      {/* Header with Navigation */}
      <header className="bg-[#0a0a0a] p-8 rounded-[3rem] border border-white/5 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
        <div className="text-right">
          <h1 className="text-4xl font-black font-urdu text-emerald-400">اسٹیشن کنٹرول</h1>
          <p className="flex items-center justify-end gap-2 text-[10px] text-emerald-500/40 font-black uppercase mt-2 tracking-widest">
            <Wifi size={12} className="animate-pulse"/> Authorized Admin Mode
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-end">
          {[
            { id: 'news', label: 'خبریں', icon: Megaphone },
            { id: 'mandi', label: 'منڈی', icon: Store },
            { id: 'queries', label: 'سوالات', icon: MessageSquare }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-500'}`}>
              <tab.icon size={16}/> {tab.label}
            </button>
          ))}
          <button onClick={() => { puter.auth.signOut(); setIsAuth(false); }} className="p-3 bg-rose-500/10 text-rose-500 rounded-xl"><LogOut size={20}/></button>
        </div>
      </header>

      {/* Quick Add Button */}
      <button onClick={handleAdd} className="w-full mb-8 bg-emerald-600/5 border-2 border-dashed border-emerald-500/20 p-8 rounded-[2.5rem] flex items-center justify-center gap-4 text-emerald-500 hover:bg-emerald-600/10 transition-all">
        <PlusCircle size={28} />
        <span className="font-black font-urdu text-xl uppercase">نئی انٹری شامل کریں</span>
      </button>

      {/* Data List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 text-emerald-500 animate-pulse font-bold">Syncing Data...</div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 opacity-20 border-2 border-dashed border-white/5 rounded-[3rem]">
            <Database size={48} className="mx-auto mb-4"/>
            <p className="font-black text-xs uppercase tracking-widest">Cloud Empty</p>
          </div>
        ) : (
          data.map(item => (
            <div key={item.id} className="p-6 bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 flex justify-between items-center group hover:bg-white/5">
              <div className="text-right">
                <p className="text-xl font-bold font-urdu text-slate-200">{item.content}</p>
                <p className="text-[9px] text-slate-600 font-black uppercase mt-2 italic">{item.timestamp}</p>
              </div>
              <button onClick={async () => {
                 const key = activeTab === 'news' ? 'fck_news_db' : activeTab === 'mandi' ? 'fck_mandi_db' : 'fck_expert_queries';
                 const up = data.filter(i => i.id !== item.id);
                 await puter.kv.set(key, JSON.stringify(up));
                 setData(up);
              }} className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"><Trash2 size={20}/></button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}