import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bell, Calendar, CheckCircle2, Clock, 
  Trash2, Plus, AlertTriangle, LayoutDashboard, LogOut, 
  User, Sprout, CloudRain, CloudLightning 
} from 'lucide-react';

export default function FarmerPortal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [tasks, setTasks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  
  // MODAL STATES
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState<'custom' | 'stages'>('custom');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  // --- 🍎 APPLE STAGES DATA (Original Logic) ---
  const APPLE_STAGES = [
    { id: 1, name: "Dormant Stage", ur: "خوابیدہ حالت", spray: "HMO (Oil)", days: 0, warning: "Ensure dry weather for 24hrs", risk: "Low" },
    { id: 2, name: "Green Tip", ur: "سبز نوک", spray: "Captan / Mancozeb", days: 15, warning: "Avoid if rain expected", risk: "Medium" },
    { id: 3, name: "Pink Bud", ur: "گلابی کلی", spray: "Dodine / Zineb", days: 25, warning: "Critical Stage", risk: "High" },
    { id: 4, name: "Bloom", ur: "پھول (بلوم)", spray: "🚫 NO SPRAY", days: 35, warning: "Do NOT Spray! Bees Active", risk: "Critical" },
    { id: 5, name: "Petal Fall", ur: "پھول جھڑنا", spray: "Hexaconazole", days: 45, warning: "Spray after 90% petal fall", risk: "Medium" },
    { id: 6, name: "Fruit Set", ur: "مٹر کے دانے برابر", spray: "Mancozeb + Boron", days: 55, warning: "Check moisture levels", risk: "Low" },
    { id: 7, name: "Walnut Size", ur: "اخروٹ کے برابر", spray: "Scab Specific Spray", days: 70, warning: "Monitor Scab Alerts", risk: "High" },
    { id: 8, name: "Pre-Harvest", ur: "تڑائی سے پہلے", spray: "Calcium Chloride", days: 90, warning: "Avoid spray 15 days before picking", risk: "Medium" },
  ];

  const getDateAfterDays = (start: string, days: number) => {
      const result = new Date(start);
      result.setDate(result.getDate() + days);
      return result.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  // --- SAVE & LOAD ---
  const saveData = (newTasks: any[]) => {
    setTasks(newTasks);
    localStorage.setItem('fck_my_tasks', JSON.stringify(newTasks));
    // Silent Cloud Sync
    try {
        const puter = (window as any).puter;
        if (puter?.auth?.isSignedIn()) puter.kv.set('fck_my_tasks', JSON.stringify(newTasks));
    } catch(e){}
  };

  useEffect(() => {
      // Load Local First (Instant)
      const local = localStorage.getItem('fck_my_tasks');
      if (local) setTasks(JSON.parse(local));

      // Check User
      const puter = (window as any).puter;
      if (puter?.auth) {
          puter.auth.getUser().then((u: any) => setUser(u)).catch(() => {});
      }
      setLoading(false);
  }, []);

  // --- ACTIONS ---
  const handleLogout = async () => {
      if(!confirm("Log Out?")) return;
      const puter = (window as any).puter;
      await puter.auth.signOut();
      window.location.reload(); 
  };

  const markDone = (id: number) => saveData(tasks.map(t => t.id === id ? { ...t, status: 'completed' } : t));
  const deleteTask = (id: number) => { if(confirm("Delete this task?")) saveData(tasks.filter(t => t.id !== id)); };

  const addCustomTask = (e: any) => {
    e.preventDefault();
    const newTask = {
      id: Date.now(),
      title: e.target.title.value,
      titleUr: e.target.titleUr.value || e.target.title.value,
      date: "Today", 
      type: e.target.urgent.checked ? "Urgent" : "Normal", 
      status: "pending"
    };
    saveData([newTask, ...tasks]);
    setShowModal(false);
  };

  const addStageTask = (stage: any) => {
      const scheduledDate = getDateAfterDays(startDate, stage.days);
      const newTask = {
          id: Date.now(),
          title: `Stage: ${stage.name}`,
          titleUr: `${stage.ur}`,
          date: scheduledDate,
          type: stage.risk === 'Critical' ? 'Urgent' : 'Normal',
          status: "pending",
          details: `Spray: ${stage.spray}`,
          warning: stage.warning
      };
      saveData([newTask, ...tasks]);
      setShowModal(false);
  };

  const addFullSchedule = () => {
      if(!confirm("Create full schedule starting from " + startDate + "?")) return;
      const newSchedule = APPLE_STAGES.map((stage, index) => ({
          id: Date.now() + index,
          title: `Stage: ${stage.name}`,
          titleUr: `${stage.ur}`,
          date: getDateAfterDays(startDate, stage.days),
          type: stage.risk === 'Critical' ? 'Urgent' : 'Normal',
          status: "pending",
          details: `Spray: ${stage.spray}`,
          warning: stage.warning
      }));
      saveData([...newSchedule, ...tasks]);
      setShowModal(false);
  };

  const visibleTasks = tasks.filter(t => t.status === activeTab);
  const urgentCount = tasks.filter(t => t.status === 'pending' && t.type === 'Urgent').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#020408] text-white p-6 font-sans relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={() => navigate('/')} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10"><ArrowLeft /></button>
            <div>
                <h1 className="text-2xl font-black italic">My Portal</h1>
                <p className="text-emerald-500 text-xs font-bold font-urdu">شیڈول اور الرٹس</p>
            </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button onClick={() => setShowModal(true)} className="p-3 bg-emerald-600 rounded-xl hover:bg-emerald-500 shadow-lg flex items-center gap-2 text-xs font-black uppercase tracking-widest animate-pulse">
                <Plus size={18} /> Add Task
            </button>
            {user && (
                <button onClick={handleLogout} className="p-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl">
                    <LogOut size={18} />
                </button>
            )}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-5 rounded-[2rem] relative overflow-hidden">
              <LayoutDashboard className="absolute -right-4 -bottom-4 text-white/20" size={60} />
              <h3 className="text-3xl font-black">{pendingCount}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Pending Tasks</p>
          </div>
          <div className="bg-gradient-to-br from-rose-500 to-red-600 p-5 rounded-[2rem] relative overflow-hidden">
              <AlertTriangle className="absolute -right-4 -bottom-4 text-white/20" size={60} />
              <h3 className="text-3xl font-black">{urgentCount}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Urgent Alerts</p>
          </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-6">
          <button onClick={() => setActiveTab('pending')} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'pending' ? 'bg-white text-black shadow-lg' : 'text-white/40'}`}>Pending</button>
          <button onClick={() => setActiveTab('completed')} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'completed' ? 'bg-white text-black shadow-lg' : 'text-white/40'}`}>Completed</button>
      </div>

      {/* TASK LIST */}
      <div className="space-y-4 pb-20">
          {loading ? <p className="text-center text-white/30 mt-10">Loading...</p> : visibleTasks.length === 0 ? (
             <div className="text-center py-20 opacity-30 flex flex-col items-center">
                 <CheckCircle2 size={60} className="mb-4 text-emerald-500"/>
                 <p>No {activeTab} alerts.</p>
             </div>
          ) : (
             visibleTasks.map(task => (
                 <div key={task.id} className={`p-5 rounded-[2rem] border flex flex-col gap-4 group transition-all duration-300 ${task.type === 'Urgent' ? 'bg-rose-500/5 border-rose-500/50 shadow-lg shadow-rose-900/20' : 'bg-[#0a0c10] border-white/5 hover:border-white/20'}`}>
                     <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-lg ${task.type === 'Urgent' ? 'bg-rose-500 text-white' : 'bg-blue-500/20 text-blue-500'}`}>
                                 {task.type === 'Urgent' ? <Bell className="animate-shake" size={20} /> : <Calendar size={20} />}
                             </div>
                             <div>
                                 <h3 className="font-bold text-white text-lg leading-none mb-1 flex items-center gap-2">
                                     {task.title}
                                     {task.type === 'Urgent' && <span className="text-[8px] bg-rose-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Urgent</span>}
                                 </h3>
                                 <p className="font-urdu text-emerald-400 text-sm">{task.titleUr}</p>
                             </div>
                         </div>
                         <div className="text-right">
                             <div className="flex flex-col items-end">
                                 <span className="text-xs font-black text-white">{task.date}</span>
                                 <span className="text-[9px] text-white/30 uppercase">Due</span>
                             </div>
                         </div>
                     </div>

                     {task.warning && (
                         <div className="bg-white/5 p-3 rounded-xl flex items-center gap-3 border-l-2 border-yellow-500">
                             <CloudLightning size={16} className="text-yellow-400 shrink-0"/>
                             <p className="text-xs text-yellow-100/80 leading-tight">
                                 <span className="font-bold text-yellow-400 block text-[9px] uppercase tracking-widest">Weather Warning</span>
                                 {task.warning}
                             </p>
                         </div>
                     )}

                     <div className="flex gap-2 justify-end border-t border-white/5 pt-3 mt-1">
                         {activeTab === 'pending' && (
                             <button onClick={() => markDone(task.id)} className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all text-xs font-bold uppercase flex items-center gap-2"><CheckCircle2 size={14}/> Done</button>
                         )}
                         <button onClick={() => deleteTask(task.id)} className="px-4 py-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all text-xs font-bold uppercase flex items-center gap-2"><Trash2 size={14}/> Delete</button>
                     </div>
                 </div>
             ))
          )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
          <div className="bg-[#121212] w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-2 bg-black/40 flex gap-2 shrink-0">
               <button onClick={() => setModalTab('custom')} className={`flex-1 py-4 rounded-[2rem] text-xs font-bold uppercase tracking-widest ${modalTab==='custom' ? 'bg-emerald-600 text-white' : 'text-white/40 bg-white/5'}`}>Custom Task</button>
               <button onClick={() => setModalTab('stages')} className={`flex-1 py-4 rounded-[2rem] text-xs font-bold uppercase tracking-widest ${modalTab==='stages' ? 'bg-rose-600 text-white' : 'text-white/40 bg-white/5'}`}>8 Stages</button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
               {modalTab === 'custom' && (
                 <form onSubmit={addCustomTask} className="space-y-4">
                    <input name="title" required placeholder="Task Name (Eng)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-emerald-500" />
                    <input name="titleUr" placeholder="کام کا نام (اردو)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-urdu text-right outline-none focus:border-emerald-500" />
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl">
                        <input type="checkbox" name="urgent" id="urgent" className="w-5 h-5 accent-rose-500" />
                        <label htmlFor="urgent" className="font-bold text-sm">Mark Urgent</label>
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 py-4 rounded-2xl font-black uppercase tracking-widest">Add</button>
                 </form>
               )}

               {modalTab === 'stages' && (
                 <div className="space-y-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <label className="block text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">Start Date (Dormant)</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-black border border-white/20 rounded-xl p-3 text-white outline-none focus:border-emerald-500" />
                    </div>
                    <button onClick={addFullSchedule} className="w-full py-3 bg-white/10 hover:bg-emerald-600/20 text-emerald-400 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest border border-dashed border-emerald-500/30 transition-all">+ Add Full Schedule</button>
                    <div className="space-y-2">
                        {APPLE_STAGES.map(stage => (
                            <button key={stage.id} onClick={() => addStageTask(stage)} className="w-full bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 flex justify-between items-center text-left group transition-all">
                                <div>
                                    <h4 className="font-bold text-white group-hover:text-rose-400">{stage.name}</h4>
                                    <p className="text-emerald-500 text-sm font-urdu">{stage.ur}</p>
                                    <div className="flex items-center gap-1 mt-2 text-rose-300/70 text-[10px]"><CloudRain size={10} /><span>{stage.warning}</span></div>
                                </div>
                                <Plus className="text-white/20 group-hover:text-white" size={20}/>
                            </button>
                        ))}
                    </div>
                 </div>
               )}
            </div>
            <button onClick={() => setShowModal(false)} className="w-full py-5 bg-black/40 text-white/40 text-xs font-bold uppercase tracking-widest border-t border-white/5 shrink-0">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}