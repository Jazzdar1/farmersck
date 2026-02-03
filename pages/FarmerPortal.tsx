import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, CloudSun, ScanEye, MessageCircle, 
  MapPinned, Users, Thermometer, Droplets, 
  LogOut, ArrowRight, BookOpen, Activity,
  Store, Sprout, Tractor, LineChart, CheckCircle, Clock, Flame
} from 'lucide-react';

export default function FarmerPortal() {
  const navigate = useNavigate();
  const puter = (window as any).puter;
  const [tasks, setTasks] = useState<any[]>([]);
  const userName = localStorage.getItem('fck_user_name') || 'Kisaan';
  const lang = localStorage.getItem('fck_lang') || 'ur';

  // 1. RESTORED SCHEDULER LOGIC
  const loadSchedules = async () => {
    if (!puter) return;
    const res = await puter.kv.get('fck_spray_db');
    const data = JSON.parse(res || "[]");
    
    const processed = data.map((task: any) => {
      const today = new Date();
      today.setHours(0,0,0,0);
      const due = new Date(task.dueDate);
      const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      let alertStatus = 'normal';
      if (!task.isDone) {
        if (diffDays < 0) alertStatus = 'missed';
        else if (diffDays <= 3) alertStatus = 'upcoming';
      }
      return { ...task, diffDays, alertStatus };
    });
    setTasks(processed);
  };

  const markAsDone = async (id: string) => {
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, isDone: true } : t);
    const saveToCloud = updatedTasks.map(({diffDays, alertStatus, ...rest}) => rest);
    await puter.kv.set('fck_spray_db', JSON.stringify(saveToCloud));
    setTasks(updatedTasks);
  };

  useEffect(() => { loadSchedules(); }, []);

  return (
    <div className={`p-4 md:p-10 min-h-screen bg-[#050505] text-white ${lang === 'ur' ? 'text-right' : 'text-left'}`} dir={lang === 'ur' ? 'rtl' : 'ltr'}>
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 bg-white/5 p-4 rounded-[2rem] border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-xl"><ShieldCheck size={20} className="text-black"/></div>
          <h1 className="text-lg font-black uppercase tracking-widest">Agri-Pro Portal</h1>
        </div>
        <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
          <LogOut size={20}/>
        </button>
      </div>

      {/* GREETING */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-8 rounded-[3rem] mb-10 shadow-2xl relative overflow-hidden">
         <h2 className="text-3xl font-black font-urdu leading-tight">
            {lang === 'ur' ? `السلام علیکم، ${userName}!` : `Welcome, ${userName}!`}
          </h2>
          <p className="text-emerald-100 font-urdu mt-2 opacity-80">آپ کا باغ آپ کی محنت کا پھل ہے۔</p>
          <Sprout className="absolute -right-10 -bottom-10 text-white/10" size={180} />
      </div>

      {/* 2. LIVE SCHEDULER SECTION (Restored) */}
      <div className="mb-12 space-y-6">
        <div className="flex justify-between items-center px-4">
           <h3 className="text-xl font-black font-urdu text-emerald-500">
             {lang === 'ur' ? "آنے والے کام (Alerts)" : "Upcoming Tasks"}
           </h3>
           <button onClick={() => navigate('/add-spray')} className="bg-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
             + Add New
           </button>
        </div>

        {tasks.filter(t => !t.isDone).map(task => (
          <div key={task.id} className={`p-6 rounded-[2.5rem] border-2 transition-all shadow-xl ${
            task.alertStatus === 'missed' ? 'bg-rose-950/40 border-rose-500 animate-pulse' : 
            task.alertStatus === 'upcoming' ? 'bg-amber-500/10 border-amber-500' : 'bg-white/5 border-white/10'
          }`}>
            <div className={`flex justify-between items-center ${lang === 'ur' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={lang === 'ur' ? 'text-right' : 'text-left'}>
                <h3 className="text-xl font-black font-urdu">{task.stage}</h3>
                <p className="text-xs opacity-50 font-mono">Due: {task.dueDate}</p>
                {task.alertStatus === 'missed' && <p className="text-rose-500 font-black text-sm mt-2">{lang === 'ur' ? "الرٹ: اسپرے چھوٹ گیا ہے!" : "Alert: Spray Missed!"}</p>}
                {task.alertStatus === 'upcoming' && <p className="text-amber-500 font-black text-sm mt-2">{task.diffDays} {lang === 'ur' ? "دن باقی ہیں" : "days remaining"}</p>}
              </div>
              <button onClick={() => markAsDone(task.id)} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black hover:scale-105 transition-all shadow-lg">
                {lang === 'ur' ? "مکمل" : "Done"}
              </button>
            </div>
          </div>
        ))}
        {tasks.filter(t => !t.isDone).length === 0 && (
           <p className="text-center py-10 opacity-30 font-urdu">{lang === 'ur' ? "کوئی نیا اسپرے شیڈول نہیں ہے۔" : "No pending schedules."}</p>
        )}
      </div>

      {/* 3. DASHBOARD TILES GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        <DashboardTile icon={ScanEye} title="ڈیزیز اسکینر" bg="bg-blue-600" shadow="shadow-blue-500/20" onClick={() => navigate('/fck-scanner')} />
        <DashboardTile icon={MessageCircle} title="ماہر سے رابطہ" bg="bg-purple-600" shadow="shadow-purple-500/20" onClick={() => navigate('/expert')} />
        <DashboardTile icon={CloudSun} title="موسم" bg="bg-cyan-500" shadow="shadow-cyan-500/20" onClick={() => navigate('/weather')} />
        <DashboardTile icon={Thermometer} title="منڈی ریٹ" bg="bg-amber-500" shadow="shadow-amber-500/20" onClick={() => navigate('/market')} />
        <DashboardTile icon={Droplets} title="مٹی کی صحت" bg="bg-indigo-600" shadow="shadow-indigo-500/20" onClick={() => navigate('/soil')} />
        <DashboardTile icon={Store} title="ڈیلر" bg="bg-orange-600" shadow="shadow-orange-500/20" onClick={() => navigate('/dealers')} />
        <DashboardTile icon={Activity} title="آڈٹ" bg="bg-rose-600" shadow="shadow-rose-500/20" onClick={() => navigate('/audit')} />
        <DashboardTile icon={LineChart} title="کیلکولیٹر" bg="bg-fuchsia-600" shadow="shadow-fuchsia-500/20" onClick={() => navigate('/profit')} />
      </div>

    </div>
  );
}

function DashboardTile({ icon: Icon, title, bg, shadow, onClick }: any) {
  return (
    <div onClick={onClick} className={`${bg} ${shadow} p-6 rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 transition-all active:scale-95 group relative overflow-hidden h-[150px]`}>
      <Icon className="absolute -right-4 -top-4 text-black/10 group-hover:scale-110 transition-transform" size={90} />
      <div className="bg-white/20 p-4 rounded-[1.5rem] mb-2 backdrop-blur-md"><Icon size={24} className="text-white" /></div>
      <h3 className="font-black font-urdu text-sm leading-tight">{title}</h3>
    </div>
  );
}