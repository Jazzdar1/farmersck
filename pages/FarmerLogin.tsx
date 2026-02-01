import React, { useState, useEffect } from 'react';
import { 
  User, ShieldCheck, LogOut, ScanEye, CloudSun, TrendingUp, 
  MessageSquare, BellRing, AlertCircle, CheckCircle2, Clock,
  Plus, Trash2, Syringe, LayoutDashboard, Calendar, Edit3,
  Camera, MapPin, Save, X, Volume2, Settings,
  Rabbit, Sprout, Microscope, FlaskConical // Added missing icons here
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FarmerPortal: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('fck_logged_in') === 'true');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // 1. Profile State
  const [userProfile, setUserProfile] = useState({
    username: 'Kashmiri Farmer',
    location: 'Srinagar, J&K',
    avatar: ''
  });

  // 2. 8-Stage Spray Schedule
  const [sprays, setSprays] = useState<any[]>([
    { id: 1, stage: 'Dormant (HMO)', chemical: 'HMO / Diesel Oil', status: 'completed' },
    { id: 2, stage: 'Green Tip', chemical: 'Captan / Ziram', status: 'completed' },
    { id: 3, stage: 'Pink Bud', chemical: 'Mancozeb', status: 'missed' },
    { id: 4, stage: 'Petal Fall', chemical: 'Dodicine', status: 'pending' },
    { id: 5, stage: 'Fruit Set', chemical: 'Propineb', status: 'pending' },
    { id: 6, stage: 'Fruit Development', chemical: 'Tebuconazole', status: 'pending' },
    { id: 7, stage: 'Pre-Harvest', chemical: 'Carbendazim', status: 'pending' },
    { id: 8, stage: 'Post-Harvest', chemical: 'Urea / Copper', status: 'pending' }
  ]);

  // 3. Urdu Welcome Voice
  useEffect(() => {
    if (isLoggedIn) {
      const msg = `Khush-aamdeed, ${userProfile.username}. FC Kashmir Portal tayyar hai.`;
      const utterance = new SpeechSynthesisUtterance(msg);
      utterance.lang = 'ur-PK';
      window.speechSynthesis.speak(utterance);
    }
  }, [isLoggedIn]);

  const updateStatus = (id: number, newStatus: string) => {
    setSprays(sprays.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  if (!isLoggedIn) return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[3rem] shadow-xl text-center">
      <h2 className="text-2xl font-black font-urdu mb-6">لاگ ان کریں</h2>
      <button onClick={() => {setIsLoggedIn(true); localStorage.setItem('fck_logged_in', 'true');}} className="w-full py-4 bg-emerald-900 text-white rounded-2xl font-black">Continue to Portal</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-40 px-4 text-right" dir="rtl">
      
      {/* Profile Section with Edit */}
      <div className="bg-emerald-900 rounded-[3.5rem] p-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-emerald-800 rounded-full flex items-center justify-center border-4 border-emerald-400/30">
            {userProfile.avatar ? <img src={userProfile.avatar} /> : <User size={40} />}
          </div>
          <div>
            {isEditingProfile ? (
              <div className="flex gap-2">
                <input className="bg-emerald-800 border border-emerald-700 p-2 rounded-xl text-white font-urdu" value={userProfile.username} onChange={e => setUserProfile({...userProfile, username: e.target.value})} />
                <button onClick={() => setIsEditingProfile(false)} className="bg-emerald-500 p-2 rounded-xl"><Save size={16}/></button>
              </div>
            ) : (
              <div className="flex items-center gap-3 justify-end">
                <Edit3 className="w-4 h-4 opacity-50 cursor-pointer" onClick={() => setIsEditingProfile(true)} />
                <h2 className="text-3xl font-black font-urdu">{userProfile.username}</h2>
              </div>
            )}
            <p className="text-emerald-300 text-xs mt-1 flex items-center justify-end gap-2"><MapPin size={12} /> {userProfile.location}</p>
          </div>
        </div>
        <button onClick={() => {setIsLoggedIn(false); localStorage.removeItem('fck_logged_in');}} className="bg-rose-500 px-8 py-3 rounded-2xl font-black text-xs uppercase">Logout</button>
      </div>

      {/* 8-Stage Spray Alerts */}
      <div className="space-y-4">
        <h3 className="text-xl font-black font-urdu text-emerald-900 flex items-center gap-2 justify-end">اہم الرٹس <BellRing className="text-rose-500 animate-bounce" /></h3>
        {sprays.filter(s => s.status === 'missed').map(s => (
          <div key={s.id} className="bg-rose-50 border-r-8 border-rose-500 p-6 rounded-[2.5rem] shadow-sm flex items-center justify-between">
            <div className="text-right">
              <p className="font-black text-rose-800 font-urdu">{s.stage} اسپرے مِس ہو گئی ہے!</p>
              <p className="text-xs text-rose-600 font-bold">Recommended: {s.chemical}</p>
            </div>
            <AlertCircle className="text-rose-500 w-8 h-8 opacity-20" />
          </div>
        ))}
      </div>

      {/* Service Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4" dir="ltr">
        {[
          { path: '/fck-scanner', label: 'Scan', icon: ScanEye, color: 'text-emerald-600 bg-emerald-50' },
          { path: '/weather', label: 'Weather', icon: CloudSun, color: 'text-amber-600 bg-amber-50' },
          { path: '/market', label: 'Mandi', icon: TrendingUp, color: 'text-rose-600 bg-rose-50' },
          { path: '/expert', label: 'AI Chat', icon: MessageSquare, color: 'text-blue-600 bg-blue-50' },
          { path: '/livestock', label: 'Animal', icon: Rabbit, color: 'text-purple-600 bg-purple-50' }, // Rabbit icon fixed
          { path: '/soil', label: 'Soil', icon: Sprout, color: 'text-lime-600 bg-lime-50' },
          { path: '/calendar', label: 'Plan', icon: Calendar, color: 'text-slate-600 bg-slate-50' },
          { path: '/settings', label: 'Admin', icon: Settings, color: 'text-gray-600 bg-gray-50' }
        ].map((item, i) => (
          <div key={i} onClick={() => navigate(item.path)} className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-50 text-center cursor-pointer hover:shadow-lg transition-all">
            <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-2 ${item.color}`}><item.icon size={20} /></div>
            <p className="text-[9px] font-black uppercase text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Spray Schedule Table */}
      <div className="bg-white rounded-[4rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 bg-emerald-950 text-white flex justify-between items-center">
          <h3 className="text-2xl font-black font-urdu">8-مرحلہ اسپرے شیڈول آڈٹ</h3>
          <Syringe className="text-emerald-400" />
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-[10px] font-black uppercase text-slate-300 border-b">
                <th className="pb-4 px-4">مرحلہ (Stage)</th>
                <th className="pb-4 px-4">کیمیکل</th>
                <th className="pb-4 px-4">اسٹیٹس</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sprays.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-all">
                  <td className="py-6 px-4 font-black text-slate-800 font-urdu">{s.stage}</td>
                  <td className="py-6 px-4 text-xs font-bold text-slate-500">{s.chemical}</td>
                  <td className="py-6 px-4">
                    <select value={s.status} onChange={(e) => updateStatus(s.id, e.target.value)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase ${s.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : s.status === 'missed' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="missed">Missed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FarmerPortal;