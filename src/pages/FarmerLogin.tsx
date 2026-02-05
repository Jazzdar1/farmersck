import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Sprout, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function FarmerLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. AUTO-CHECK: Kya user pehle se login hai?
  useEffect(() => {
    const checkSession = async () => {
      try {
        const puter = (window as any).puter;
        if (puter && puter.auth) {
          const user = await puter.auth.getUser();
          if (user) {
            console.log("Auto-login:", user.username);
            navigate('/my-portal');
          }
        }
      } catch (err) {
        console.error("Session Check Error:", err);
      }
    };
    checkSession();
  }, [navigate]);

  // 2. LOGIN FUNCTION
  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const puter = (window as any).puter;
      
      if (!puter) {
        throw new Error("System not ready. Please refresh.");
      }

      // Puter Sign In Window
      const user = await puter.auth.signIn();
      
      if (user) {
        navigate('/my-portal');
      } else {
        setError("Login cancelled.");
      }

    } catch (err: any) {
      console.error("Login Failed:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] flex items-center justify-center p-6 relative overflow-hidden">
      
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-6 flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/5 transition-all z-50"
      >
        <ArrowLeft size={18} />
        <span className="text-xs font-black uppercase tracking-widest">Home</span>
      </button>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#0a0c10] border border-white/5 rounded-[3.5rem] p-10 text-center shadow-2xl relative z-10">
        
        <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
          <ShieldCheck className="text-emerald-500" size={48} />
        </div>
        
        <h1 className="text-3xl font-black text-white mb-2 italic tracking-tighter uppercase">Farmer Login</h1>
        <p className="text-emerald-500/80 text-[10px] font-urdu mb-8 uppercase tracking-[0.4em]">اپنے اکاؤنٹ میں لاگ ان کریں</p>

        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-left">
            <AlertCircle className="text-rose-500 shrink-0" size={16} />
            <p className="text-rose-200 text-[10px] font-bold">{error}</p>
          </div>
        )}

        <button 
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-5 bg-white text-black rounded-[2.5rem] font-black uppercase text-xs flex items-center justify-center gap-4 hover:bg-emerald-400 hover:scale-105 transition-all active:scale-95 shadow-xl"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin text-emerald-900" />
          ) : (
            <>
              Login / Sign Up
            </>
          )}
        </button>

        <p className="mt-8 text-[9px] text-white/20 tracking-[0.4em] uppercase">FC Kashmir Secure Auth</p>
      </div>
    </div>
  );
}