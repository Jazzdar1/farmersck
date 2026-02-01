import React, { useState, useEffect } from 'react';
import { 
  Lock, ShieldCheck, Megaphone, LogOut, Database, 
  Trash2, Wifi, Zap, X, HelpCircle, Mail, Key, AlertCircle
} from 'lucide-react';
import { saveUserData, getUserData } from '../services/puterService';

// MASTER ADMIN EMAIL
const ADMIN_GMAIL = "darajazb@gmail.com".toLowerCase();

const Admin: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('broadcast');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // 1. REFRESHED LOGIN LOGIC
  const handleLogin = async () => {
    setLoading(true);
    try {
      // Pehle purana session clear karna zaroori hai
      await (window as any).puter.auth.signOut();
      
      // Naya Sign-in modal kholna
      const user = await (window as any).puter.auth.signIn();
      
      if (user) {
        // Email ya Username dono ko check karna
        const userEmail = (user.email || user.userName || "").toLowerCase();
        
        if (userEmail === ADMIN_GMAIL) {
          setIsAuthorized(true);
          loadCloudData();
        } else {
          alert(`Access Denied: ${userEmail} is not authorized. This station is restricted to ${ADMIN_GMAIL}.`);
          await (window as any).puter.auth.signOut();
        }
      }
    } catch (err) {
      alert("Login Error: Browser popup settings check karein.");
    } finally {
      setLoading(false);
    }
  };

  const loadCloudData = async () => {
    const key = activeTab === 'broadcast' ? 'fck_broadcasts' : `fck_${activeTab}_db`;
    const res = await getUserData(key) || [];
    setData(res);
  };

  useEffect(() => { if (isAuthorized) loadCloudData(); }, [activeTab, isAuthorized]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black p-6">
        <div className="bg-[#0a0a0a] w-full max-w-md rounded-[3.5rem] border border-white/5 p-12 text-center space-y-10 shadow-2xl animate-in zoom-in-95">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl">
            <Lock className="text-emerald-500" size={40} />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Admin Station</h2>
            <p className="text-[10px] text-emerald-500 font-black tracking-[0.3em] uppercase">{ADMIN_GMAIL}</p>
          </div>

          <div className="space-y-6">
            <button 
              onClick={handleLogin} 
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Authenticating..." : "Login with Puter Gmail"}
            </button>

            {/* FORGET PASSWORD & USERNAME SUPPORT */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
              <button 
                onClick={() => window.open('https://puter.com/forgot-password', '_blank')}
                className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-emerald-400 flex items-center justify-center gap-2 transition-colors"
              >
                <Key size={12} /> Reset Pass
              </button>
              <button 
                onClick={() => setShowHelp(!showHelp)}
                className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-emerald-400 flex items-center justify-center gap-2 transition-colors"
              >
                <HelpCircle size={12} /> Help?
              </button>
            </div>
          </div>

          {showHelp && (
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 animate-in slide-in-from-top-2 text-left space-y-4 shadow-inner">
              <div className="flex items-start gap-3">
                <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[9px] text-slate-400 font-bold uppercase leading-relaxed tracking-tight">
                  Agar aapne password reset kiya hai toh browser restart karein aur confirm karein ke aap <span className="text-emerald-500">{ADMIN_GMAIL}</span> hi use kar rahe hain.
                </p>
              </div>
              <a href="mailto:support@puter.com" className="w-full py-3 bg-white/5 rounded-xl flex items-center justify-center gap-2 text-emerald-500 text-[9px] font-black uppercase border border-white/5"><Mail size={12}/> Contact Support</a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white w-full p-8 md:p-14 overflow-y-auto no-scrollbar">
       {/* Logged in Admin UI... */}
    </div>
  );
};

export default Admin;