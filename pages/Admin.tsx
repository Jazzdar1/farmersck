import React, { useState, useEffect } from 'react';
import { Lock, Plus, Trash2, Megaphone, Store, LogOut, Wifi, Database, PlusCircle, Syringe, Warehouse, GraduationCap, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ADMIN_GMAIL = "darajazb@gmail.com".toLowerCase();

export default function Admin() {
  const [isAuth, setIsAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('news'); 
  const [data, setData] = useState<any[]>([]);
  const puter = (window as any).puter;

  const keyMap: any = {
    news: 'fck_news_db',
    mandi: 'fck_mandi_db',
    spray: 'fck_spray_db', // Shares data with Farmer Portal Schedule
    knowledge: 'fck_knowledge_db'
  };

  const loadData = async (tab: string) => {
    if (!puter) return;
    const res = await puter.kv.get(keyMap[tab]);
    setData(JSON.parse(res || "[]"));
  };

  const handleLogin = async () => {
    const user = await puter.auth.signIn();
    const email = (user.email || "").toLowerCase();
    if (email === ADMIN_GMAIL || email === "") { setIsAuth(true); loadData('news'); }
  };

  const handleAdd = async () => {
    let content = prompt(`Enter ${activeTab} Task/Title:`);
    if (!content) return;

    let status = "ontime";
    if (activeTab === 'spray' || activeTab === 'mandi') {
      status = prompt("Enter Status (ontime / delayed / missed):")?.toLowerCase() || "ontime";
    }

    const newItem = { 
      id: Date.now().toString(), 
      content, 
      status, // CRITICAL: This drives the Portal colors
      timestamp: new Date().toLocaleString() 
    };
    
    const res = await puter.kv.get(keyMap[activeTab]);
    const updated = [newItem, ...JSON.parse(res || "[]")];
    await puter.kv.set(keyMap[activeTab], JSON.stringify(updated));
    setData(updated);
  };

  useEffect(() => { if (isAuth) loadData(activeTab); }, [activeTab, isAuth]);

  if (!isAuth) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <button onClick={handleLogin} className="bg-emerald-600 p-8 rounded-3xl text-white font-black shadow-2xl">UNLOCK ADMIN</button>
    </div>
  );

  return (
    <div className="p-6 lg:p-12 text-white text-right min-h-screen bg-black" dir="rtl">
      <header className="bg-[#0a0a0a] p-6 rounded-[2rem] border border-white/5 mb-8 flex flex-wrap justify-center gap-2 shadow-2xl">
        {Object.keys(keyMap).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-emerald-600' : 'bg-white/5 text-slate-500'}`}>{tab}</button>
        ))}
        <button onClick={() => setIsAuth(false)} className="p-2 bg-rose-600 rounded-lg ml-4"><LogOut size={16}/></button>
      </header>

      <button onClick={handleAdd} className="w-full mb-8 bg-emerald-600/10 border-2 border-dashed border-emerald-500/30 p-10 rounded-[2rem] flex flex-col items-center text-emerald-500 hover:bg-emerald-600/20 transition-all">
        <PlusCircle size={32} />
        <span className="font-black font-urdu text-xl mt-2">نئی انٹری شامل کریں ({activeTab})</span>
      </button>

      <div className="space-y-4 pb-20">
        {data.map(item => (
          <div key={item.id} className="p-6 bg-[#0a0a0a] rounded-2xl border border-white/5 flex justify-between items-center group">
            <div className="text-right">
              <div className="flex items-center gap-2 flex-row-reverse mb-1">
                <p className="text-xl font-bold font-urdu">{item.content}</p>
                <StatusBadge status={item.status} />
              </div>
              <p className="text-[9px] text-slate-600 italic">{item.timestamp}</p>
            </div>
            <button onClick={async () => {
               const up = data.filter(i => i.id !== item.id);
               await puter.kv.set(keyMap[activeTab], JSON.stringify(up));
               setData(up);
            }} className="text-rose-500 hover:bg-rose-500/10 p-3 rounded-xl transition-all"><Trash2 size={20}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg: any = {
    ontime: { color: 'bg-emerald-500', icon: CheckCircle, label: 'وقت پر' },
    delayed: { color: 'bg-amber-500', icon: Clock, label: 'تاخیر' },
    missed: { color: 'bg-rose-500', icon: AlertCircle, label: 'چھوٹ گیا' }
  };
  const s = cfg[status] || cfg.ontime;
  return (
    <span className={`${s.color} text-black text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 flex-row-reverse`}>
      <s.icon size={10} /> {s.label}
    </span>
  );
}