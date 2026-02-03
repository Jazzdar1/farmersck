import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, FastForward } from 'lucide-react';

export default function FarmerLogin() {
  const navigate = useNavigate();
  const puter = (window as any).puter;
  const [view, setView] = useState<'signin' | 'signup'>('signin');
  const [formData, setFormData] = useState({ name: '', identifier: '', password: '' });

  const handleAuth = async (type: 'auth' | 'skip') => {
    if (type === 'skip') {
      localStorage.setItem('fck_access_mode', 'public');
      localStorage.removeItem('fck_user_token');
      navigate('/'); 
      return;
    }

    try {
      if (!puter) return;
      const userKey = `fck_user_${formData.identifier}`;
      const existingData = await puter.kv.get(userKey);

      if (view === 'signin') {
        if (existingData) {
          const profile = JSON.parse(existingData);
          if (profile.password === formData.password) {
            localStorage.setItem('fck_user_token', userKey);
            localStorage.setItem('fck_user_name', profile.name);
            localStorage.setItem('fck_access_mode', 'full');
            navigate('/my-portal');
          } else { alert("Incorrect Password"); }
        } else { alert("User not found"); }
      } else {
        await puter.kv.set(userKey, JSON.stringify({...formData, access: 'full'}));
        localStorage.setItem('fck_user_token', userKey);
        localStorage.setItem('fck_user_name', formData.name);
        localStorage.setItem('fck_access_mode', 'full');
        navigate('/my-portal');
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[3rem] p-10 shadow-2xl">
        <h1 className="text-3xl font-black font-urdu text-emerald-400 text-center mb-8 uppercase tracking-tighter">
          {view === 'signup' ? 'نیا اکاؤنٹ | Signup' : 'لاگ ان | Signin'}
        </h1>
        <div className="space-y-4">
          {view === 'signup' && <input type="text" placeholder="Full Name" className="w-full bg-black p-4 rounded-2xl text-white border border-white/10" onChange={(e) => setFormData({...formData, name: e.target.value})} />}
          <input type="text" placeholder="Phone or Email" className="w-full bg-black p-4 rounded-2xl text-white border border-white/10" onChange={(e) => setFormData({...formData, identifier: e.target.value})} />
          <input type="password" placeholder="Password" className="w-full bg-black p-4 rounded-2xl text-white border border-white/10" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <button onClick={() => handleAuth('auth')} className="w-full bg-emerald-600 text-white p-4 rounded-2xl font-black uppercase tracking-widest shadow-lg">
            {view === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
        <div className="mt-6 flex flex-col items-center gap-4">
          <button onClick={() => setView(view === 'signin' ? 'signup' : 'signin')} className="text-[10px] font-black uppercase text-emerald-500/60 tracking-widest hover:text-emerald-500">{view === 'signin' ? "Need an account? Signup" : "Already have an account? Signin"}</button>
          <button onClick={() => handleAuth('skip')} className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em] flex items-center gap-2 hover:text-white transition-all"><FastForward size={14}/> Skip to Guest Mode</button>
        </div>
      </div>
    </div>
  );
}