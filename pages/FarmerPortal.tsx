import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, LogOut, BellRing, Calendar, Quote, Volume2, 
  Microscope, Syringe, MapPinned, ScanEye, CloudRain, Thermometer 
} from 'lucide-react';

export default function FarmerPortal() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('fck_user_name') || 'Farmer';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="space-y-8 text-right min-h-screen" dir="rtl">
      
      {/* 1. TOP BAR: WEATHER & LOGOUT */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch gap-4">
        
        {/* Farm Weather Alert Widget */}
        <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[2.5rem] flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="bg-emerald-500 p-3 rounded-2xl text-black shadow-lg shadow-emerald-500/20">
               <CloudRain size={24} />
             </div>
             <div className="text-right">
               <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Weather Alert | موسم</p>
               <h3 className="text-lg font-bold text-white leading-none">Light Rain Expected | ہلکی بارش کا امکان</h3>
             </div>
           </div>
           <div className="text-left border-l border-white/10 pl-4">
              <div className="flex items-center gap-1 text-emerald-400 font-black">
                <Thermometer size={14} /> 12°C
              </div>
              <p className="text-[9px] text-white/40 uppercase">Kulgam Node</p>
           </div>
        </div>

        {/* Quick Logout */}
        <button onClick={handleLogout} className="bg-rose-500 text-white px-8 py-4 rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg flex items-center justify-center gap-2">
          <LogOut size={16} /> Logout | لاگ آؤٹ
        </button>
      </div>

      {/* 2. USER PROFILE HEADER */}
      <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 flex items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-6 text-right">
          <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-black font-black text-3xl shadow-xl">
            {userName.charAt(0)}
          </div>
          <div>
            <h2 className="text-3xl font-black font-urdu text-emerald-400 leading-tight">Welcome | خوش آمدید، {userName}</h2>
            <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.3em] mt-1 italic">Verified Orchard Manager Profile</p>
          </div>
        </div>
        <div className="hidden md:block bg-emerald-500/5 px-6 py-2 rounded-full border border-emerald-500/20">
          <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">ID: FCK-KUL-2026</span>
        </div>
      </div>

      {/* 3. BILINGUAL WISDOM CARD */}
      <div className="bg-emerald-950/30 p-10 rounded-[3.5rem] border border-emerald-500/20 shadow-2xl relative overflow-hidden">
        <Quote className="absolute -left-5 -top-5 text-emerald-500/10" size={150} />
        <p className="text-2xl md:text-4xl font-urdu font-bold text-white/90 italic leading-relaxed relative z-10">"ذرا نم ہو تو یہ مٹی بڑی زرخیز ہے ساقی"</p>
        <p className="text-[10px] uppercase font-black text-emerald-500/40 tracking-[0.3em] mt-4 font-urdu">Wisdom of the Day | آج کی حکمت</p>
      </div>

      {/* 4. TOOLS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <PortalIcon onClick={() => navigate('/fck-scanner')} icon={ScanEye} label="Scanner Pro | اسکینر" color="text-blue-400" />
        <PortalIcon onClick={() => navigate('/spray-track')} icon={Syringe} label="Spray Auditor | اسپرے" color="text-rose-400" />
        <PortalIcon onClick={() => navigate('/soil')} icon={Microscope} label="Soil Health | مٹی" color="text-emerald-400" />
        <PortalIcon onClick={() => navigate('/dealers')} icon={MapPinned} label="Dealers | ڈیلرز" color="text-cyan-400" />
      </div>
    </div>
  );
}

function PortalIcon({ icon: Icon, label, color, onClick }: any) {
  return (
    <div onClick={onClick} className="bg-white/5 p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group shadow-inner">
      <Icon className={`${color} group-hover:scale-125 transition-transform`} size={28} />
      <span className="text-[10px] font-black uppercase text-white/50 tracking-widest font-urdu">{label}</span>
    </div>
  );
}