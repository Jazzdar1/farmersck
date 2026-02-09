import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { ADMIN_USERNAME } from "../config"; 

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // 1. Puter Login Popup
      const user = await (window as any).puter.auth.signIn();
      
      if (user) {
        // 2. SECURITY CHECK
        if (user.username === ADMIN_USERNAME) {
           navigate("/admin");
        } else {
           alert(`ACCESS DENIED! User '${user.username}' is not an Admin.`);
           await (window as any).puter.auth.signOut(); 
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-sm bg-[#0a0c10] border border-white/10 p-8 rounded-[3rem] shadow-2xl relative z-10 text-center">
        <button 
          onClick={() => navigate('/')} 
          className="absolute top-6 left-6 p-3 bg-white/5 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-rose-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <Lock className="text-red-500" size={40} />
        </div>

        <h1 className="text-3xl font-black text-white mb-2 italic tracking-tighter uppercase">Admin Panel</h1>
        <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] mb-12 font-urdu">صرف انتظامیہ کے لیے</p>

        <button 
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-5 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-[2rem] font-black uppercase text-xs flex items-center justify-center gap-4 hover:scale-[1.02] transition-all active:scale-95 shadow-xl shadow-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin" size={20}/> : <ShieldCheck size={20} />}
          {loading ? "Verifying..." : "Secure Access"}
        </button>

        <div className="mt-8 flex items-center justify-center gap-2 text-white/20">
            <AlertTriangle size={12} />
            <p className="text-[10px] uppercase tracking-widest">Restricted Area</p>
        </div>
      </div>
    </div>
  );
}