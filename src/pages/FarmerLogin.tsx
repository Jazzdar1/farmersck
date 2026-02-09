import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, ArrowLeft, LogIn, Loader2 } from 'lucide-react';

export default function FarmerLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const checkUser = async () => {
        const puter = (window as any).puter;
        if (puter?.auth?.getUser) {
            const user = await puter.auth.getUser();
            if (user) navigate('/'); // Agar pehle se login hai to Dashboard bhej do
        }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async () => {
    setLoading(true);
    try {
        const puter = (window as any).puter;
        // Puter ka Asli Login Popup khulega
        await puter.auth.signIn();
        // Login hone ke baad wapis Dashboard par
        navigate('/');
        window.location.reload(); // Refresh taaki Sidebar update ho jaye
    } catch (err) {
        console.error("Login Failed", err);
        alert("Login failed or cancelled.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-900/20 to-black z-0"></div>
      <Sprout size={300} className="absolute -bottom-20 -right-20 text-emerald-500/5 rotate-12" />

      <div className="relative z-10 w-full max-w-md">
          <button onClick={() => navigate('/')} className="mb-8 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white">
              <ArrowLeft size={16}/> Back to Home
          </button>

          <div className="bg-[#0a0c10] border border-white/5 p-8 rounded-[3rem] shadow-2xl text-center">
              <div className="w-20 h-20 bg-emerald-500 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
                  <Sprout size={40} className="text-black" />
              </div>
              
              <h1 className="text-3xl font-black italic mb-2">Farmer Login</h1>
              <p className="text-emerald-500 font-urdu font-bold text-lg mb-8">کسان دوست پورٹل میں خوش آمدید</p>

              <button 
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-emerald-900/50"
              >
                  {loading ? <Loader2 className="animate-spin"/> : <LogIn size={20}/>}
                  {loading ? "Connecting..." : "Sign In with Puter"}
              </button>

              <p className="mt-6 text-white/30 text-xs text-center leading-relaxed">
                  Secure Login powered by Puter.js <br/>
                  آپ کا ڈیٹا محفوظ ہے۔
              </p>
          </div>
      </div>
    </div>
  );
}