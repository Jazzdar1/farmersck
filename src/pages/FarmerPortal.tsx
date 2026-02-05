import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Volume2, VolumeX, XCircle, FileText, Lightbulb,
  AlertTriangle, BellRing, Trash2, RefreshCw, 
  CloudRain, Sun, Cloud, Wind, CheckCircle2, Layout, Calendar as CalendarIcon, Clock
} from 'lucide-react';
import { DashboardTile, DEFAULT_FARMER_TILES, ICON_MAP } from '../utils/tileHelpers';

// Types
interface LogItem {
  id: number;
  title: string;
  date: string;
  status: string;
  type: string;
}

export default function FarmerPortal() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [tiles, setTiles] = useState<DashboardTile[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  // === ALERTS STATE ===
  const [missedAlert, setMissedAlert] = useState<any>({
    active: true,
    title: "MISSED: Dormant Oil Spray",
    subtitle: "Critical for San Jose Scale Control",
    action: "Apply HMO immediately",
    severity: "critical",
    id: "missed-1" // Unique ID for key
  });

  const [upcomingAlert, setUpcomingAlert] = useState<any>({
    active: true,
    title: "UPCOMING: Pre-Bloom Fungicide",
    subtitle: "Prevent Early Scab Infection",
    date: "Due in 3 Days",
    severity: "soft",
    id: "upcoming-1" // Unique ID for key
  });

  // === LOGS & MODAL STATE ===
  const [showLogs, setShowLogs] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  
  // Target tracking
  const [rescheduleTarget, setRescheduleTarget] = useState<'missed' | 'upcoming' | LogItem | null>(null);
  
  const [logs, setLogs] = useState<LogItem[]>([
    { id: 1, title: "Dormant Spray", date: "Feb 10", status: "Missed", type: "Spray" },
    { id: 2, title: "Urea Application", date: "Feb 05", status: "Completed", type: "Fertilizer" },
    { id: 3, title: "Pruning", date: "Jan 20", status: "Completed", type: "Task" }
  ]);

  // === 7-DAY WEATHER FORECAST ===
  const getNext7Days = () => {
    const weathers = [
      { type: 'Rain', icon: CloudRain, color: 'text-blue-400', status: 'Avoid', risk: 'High Risk' },
      { type: 'Sunny', icon: Sun, color: 'text-yellow-400', status: 'Perfect', risk: 'Safe' },
      { type: 'Cloudy', icon: Cloud, color: 'text-gray-400', status: 'Good', risk: 'Low Risk' },
      { type: 'Windy', icon: Wind, color: 'text-cyan-400', status: 'Risky', risk: 'Drift Risk' },
      { type: 'Sunny', icon: Sun, color: 'text-yellow-400', status: 'Perfect', risk: 'Safe' },
      { type: 'Sunny', icon: Sun, color: 'text-yellow-400', status: 'Perfect', risk: 'Safe' },
      { type: 'Rain', icon: CloudRain, color: 'text-blue-400', status: 'Avoid', risk: 'High Risk' },
    ];

    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i + 1);
      const dayName = nextDate.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const w = weathers[i % weathers.length];
      return { 
        ...w, 
        dayName, 
        dateStr, 
        fullDate: `${dayName}, ${dateStr}`, // e.g. "Fri, Feb 12"
        isoDate: nextDate.toISOString().split('T')[0]
      };
    });
  };

  const forecast = getNext7Days();
  const [selectedDate, setSelectedDate] = useState<any>(null);

  // === INIT & AUTH ===
  useEffect(() => {
    const init = async () => {
      const puter = (window as any).puter;
      if (puter?.auth) {
         const pUser = await puter.auth.getUser();
         if (!pUser) navigate('/farmer-login');
         else setUser(pUser);
      }
      let data = DEFAULT_FARMER_TILES;
      if (puter?.kv) {
         const saved = await puter.kv.get('fck_farmer_tiles');
         if (saved) data = JSON.parse(saved);
      }
      setTiles(data.filter(t => t.isActive));
    };
    init();
  }, [navigate]);

  // === AUTO-VOICE LOGIC ===
  useEffect(() => {
    if (isMuted) return;
    const playVoiceSequence = () => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        if (missedAlert?.active) {
            const msg1 = new SpeechSynthesisUtterance(`Critical Alert! Missed ${missedAlert.title}.`);
            window.speechSynthesis.speak(msg1);
        }
    };
    const timer = setTimeout(playVoiceSequence, 1000);
    return () => clearTimeout(timer);
  }, [missedAlert, upcomingAlert, isMuted]);

  // === ACTIONS ===
  const handleDeleteLog = (id: number) => {
    if(confirm("Delete this activity log?")) {
      setLogs(logs.filter(l => l.id !== id));
    }
  };

  const triggerReschedule = (target: 'missed' | 'upcoming' | LogItem) => {
    setRescheduleTarget(target);
    setSelectedDate(null); // Reset date
    setShowLogs(false); 
    setShowReschedule(true);
  };

  const confirmReschedule = () => {
    if (!selectedDate || !rescheduleTarget) return;

    const newDateString = selectedDate.fullDate;

    // 1. If Rescheduling Missed Alert
    if (rescheduleTarget === 'missed') {
        setMissedAlert(null); // Remove missed alert
        setUpcomingAlert({
            active: true,
            title: missedAlert.title + " (Rescheduled)",
            subtitle: "Rescheduled from missed task",
            date: newDateString, 
            severity: "soft",
            id: Date.now() // Force re-render
        });
        setLogs(prev => [{ id: Date.now(), title: missedAlert.title, date: newDateString, status: "Rescheduled", type: "Spray" }, ...prev]);
    } 
    
    // 2. If Rescheduling Upcoming Alert
    else if (rescheduleTarget === 'upcoming') {
        setUpcomingAlert({
            ...upcomingAlert,
            date: `New: ${newDateString}`,
            subtitle: "Updated via Weather Planner",
            id: Date.now() // Force re-render
        });
        setLogs(prev => [{ id: Date.now(), title: upcomingAlert.title, date: newDateString, status: "Updated", type: "Spray" }, ...prev]);
    } 
    
    // 3. If Rescheduling Log Item
    else {
        const log = rescheduleTarget as LogItem;
        setLogs(prevLogs => prevLogs.map(l => {
            if (l.id === log.id) return { ...l, status: "Rescheduled", date: newDateString };
            return l;
        }));
    }
    
    setShowReschedule(false);
    
    // Success Voice
    const msg = new SpeechSynthesisUtterance(`Updated to ${selectedDate.dayName}.`);
    window.speechSynthesis.speak(msg);
  };

  return (
    <div className="min-h-screen bg-[#020408] text-white p-4 md:p-8 pb-32 text-right font-sans" dir="rtl">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 bg-[#0a0c10] p-5 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="flex items-center gap-4">
            <button onClick={() => { (window as any).puter.auth.signOut(); navigate('/farmer-login'); }} className="p-4 bg-rose-500/10 text-rose-500 rounded-[1.5rem] hover:bg-rose-500 hover:text-white transition-all">
                <LogOut size={22} />
            </button>
            <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-[1.5rem] transition-all ${isMuted ? 'bg-white/5 text-gray-500' : 'bg-emerald-500/20 text-emerald-500 animate-pulse'}`}>
                {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
            </button>
        </div>
        <div className="text-right">
            <h1 className="text-2xl font-black italic tracking-tighter text-white">{user?.username || 'Farmer'}</h1>
            <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest font-urdu">FC KASHMIR PORTAL</p>
        </div>
      </div>

      {/* === 🔴 MISSED ALERT === */}
      {missedAlert?.active && (
        <div key={missedAlert.id} className="mb-8 animate-in zoom-in-95 duration-500">
          <div className="bg-gradient-to-r from-rose-900 to-[#0a0c10] rounded-[3rem] border-2 border-rose-500/50 p-8 relative overflow-hidden shadow-[0_0_50px_rgba(225,29,72,0.3)]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="flex gap-3 w-full md:w-auto justify-center md:justify-start order-2 md:order-1">
                    <button onClick={() => triggerReschedule('missed')} className="bg-white text-rose-900 hover:bg-rose-100 py-4 px-8 rounded-[2rem] text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-xl transition-transform active:scale-95">
                        <RefreshCw size={18} /> Reschedule
                    </button>
                    <button onClick={() => setShowLogs(true)} className="bg-rose-950/50 text-rose-200 hover:bg-rose-900/50 py-4 px-6 rounded-[2rem] border border-rose-500/30 text-xs font-bold uppercase tracking-widest">Logs</button>
                </div>
                <div className="text-center md:text-right flex-1 order-1 md:order-2">
                    <div className="flex items-center justify-center md:justify-end gap-3 mb-2">
                         <span className="bg-rose-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Action Required</span>
                         <AlertTriangle size={28} className="text-rose-500 fill-rose-500/20" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 leading-tight drop-shadow-md">{missedAlert.title}</h2>
                    <p className="text-rose-200 text-sm font-medium opacity-80">{missedAlert.subtitle}</p>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* === 🟡 UPCOMING ALERT === */}
      {upcomingAlert?.active && (
        <div key={upcomingAlert.id} className="mb-10 animate-in slide-in-from-bottom-4 duration-700">
          <div className="bg-[#0f1216] rounded-[2.5rem] border-r-8 border-amber-400 p-6 relative overflow-hidden shadow-2xl hover:bg-[#15181e] transition-colors">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex gap-3 w-full md:w-auto justify-center md:justify-start order-2 md:order-1">
                    <button onClick={() => triggerReschedule('upcoming')} className="bg-amber-400/10 hover:bg-amber-400 hover:text-black text-amber-400 py-3 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-amber-400/20 flex items-center gap-2">
                        <Clock size={16} /> Change Date
                    </button>
                </div>
                <div className="text-center md:text-right flex-1 order-1 md:order-2">
                    <div className="flex items-center justify-center md:justify-end gap-2 mb-1">
                         <span className="text-amber-400 font-bold text-[10px] uppercase tracking-widest">System Reminder</span>
                         <BellRing size={20} className="text-amber-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{upcomingAlert.title}</h3>
                    <p className="text-white/60 text-xs font-medium uppercase tracking-wide flex items-center justify-center md:justify-end gap-2">
                       <span className="text-emerald-400 font-black bg-emerald-500/10 px-2 py-1 rounded">{upcomingAlert.date}</span>
                       <span>• {upcomingAlert.subtitle}</span>
                    </p>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* DAILY TIP */}
      <div className="mb-10 bg-[#0a0c10] rounded-[2.5rem] border border-emerald-500/10 p-6 flex items-center gap-6 shadow-xl relative overflow-hidden">
         <div className="hidden md:flex bg-emerald-500/10 p-4 rounded-[1.5rem]"><Lightbulb className="text-emerald-400" size={32} /></div>
         <div className="text-right flex-1">
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Daily Insight</p>
            <p className="text-white/90 text-sm leading-relaxed font-urdu">"Ensure proper drainage in orchards to prevent root rot during melting snow."</p>
         </div>
      </div>

      {/* TILES GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {tiles.map(tile => {
            const IconComp = ICON_MAP[tile.icon] || Layout;
            return (
                <div key={tile.id} onClick={() => navigate(tile.link)} className="bg-[#0a0c10] p-6 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center h-[180px] cursor-pointer hover:border-emerald-500/40 group hover:bg-[#0f1216] transition-all hover:-translate-y-1">
                  <div className={`${tile.color} p-4 rounded-[1.5rem] mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-black/40`}>
                    <IconComp size={28} className="text-white" />
                  </div>
                  <p className="text-white/40 font-black text-[9px] uppercase tracking-[0.25em] mb-1">{tile.sub}</p>
                  <h3 className="text-white font-black font-urdu text-sm leading-tight">{tile.label}</h3>
                </div>
            );
        })}
      </div>

      {/* ==================================== */}
      {/* 📜 MODAL 1: LOGS MANAGER            */}
      {/* ==================================== */}
      {showLogs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#0a0c10] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-6 shadow-2xl animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => setShowLogs(false)} className="bg-white/5 hover:bg-white/10 p-2 rounded-full"><XCircle size={20} /></button>
                    <h2 className="text-xl font-black italic text-white">Logs</h2>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar">
                    {logs.map((log) => (
                        <div key={log.id} className="bg-white/5 p-4 rounded-[1.5rem] flex items-center justify-between border border-white/5">
                            <div className="flex gap-2">
                                <button onClick={() => handleDeleteLog(log.id)} className="p-2 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white"><Trash2 size={16} /></button>
                                <button onClick={() => triggerReschedule(log)} className="p-2 bg-amber-500/10 text-amber-500 rounded-xl hover:bg-amber-500 hover:text-black"><CalendarIcon size={16} /></button>
                            </div>
                            <div className="text-right">
                                <p className="text-white font-bold text-sm mb-1">{log.title}</p>
                                <p className={`text-[10px] uppercase font-bold ${log.status === 'Missed' ? 'text-rose-400' : 'text-emerald-400'}`}>{log.date} • {log.status}</p>
                            </div>
                        </div>
                    ))}
                    {logs.length === 0 && <p className="text-center text-white/30 text-xs">No logs</p>}
                </div>
            </div>
        </div>
      )}

      {/* ==================================== */}
      {/* 📅 MODAL 2: COMPACT WEATHER RESCHEDULER */}
      {/* ==================================== */}
      {showReschedule && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            {/* Reduced max-w-sm for smaller size */}
            <div className="bg-[#1a1d24] border border-white/10 w-[95%] max-w-sm rounded-[2rem] p-5 shadow-2xl animate-in zoom-in-95">
                
                {/* Compact Header */}
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => { setShowReschedule(false); }} className="text-white/40 hover:text-white"><XCircle size={20} /></button>
                    <div className="text-right">
                        <h2 className="text-lg font-black italic text-white">Select Date</h2>
                    </div>
                </div>

                {/* Compact List */}
                <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto no-scrollbar">
                    {forecast.map((day, idx) => (
                        <div 
                           key={idx}
                           onClick={() => setSelectedDate(day)}
                           className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                               selectedDate?.fullDate === day.fullDate
                               ? 'bg-emerald-600/20 border-emerald-500 shadow-lg' 
                               : 'bg-black/30 border-white/5 hover:bg-white/5'
                           }`}
                        >
                            <div className="flex items-center gap-3">
                                <day.icon size={18} className={day.color} />
                                <div>
                                    <p className={`text-[10px] font-black uppercase ${day.status === 'Avoid' ? 'text-rose-400' : 'text-emerald-400'}`}>{day.status}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-white text-xs">{day.dayName}</p>
                                <p className="text-white/40 text-[10px]">{day.dateStr}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Status Text */}
                <p className={`text-center text-xs font-bold mb-4 ${selectedDate ? 'text-emerald-400' : 'text-white/30'}`}>
                    {selectedDate ? `Selected: ${selectedDate.fullDate}` : "Pick a valid date"}
                </p>

                {/* Active Button */}
                <button 
                  onClick={confirmReschedule}
                  disabled={!selectedDate}
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                    selectedDate 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-emerald-900/50 scale-100' 
                    : 'bg-white/5 text-white/20 cursor-not-allowed'
                  }`}
                >
                    <CheckCircle2 size={16} /> Confirm
                </button>
            </div>
        </div>
      )}

    </div>
  );
}