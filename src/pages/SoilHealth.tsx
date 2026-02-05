import React from 'react';
import { ArrowLeft, FlaskConical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SoilHealth() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#020408] text-white p-6 font-sans text-right" dir="rtl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/')} className="p-3 bg-white/5 rounded-2xl"><ArrowLeft /></button>
        <h1 className="text-2xl font-black italic">Soil Health Lab</h1>
      </div>
      
      <div className="bg-[#0a0c10] p-8 rounded-[3rem] border border-white/5 text-center">
          <div className="bg-indigo-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FlaskConical size={40} className="text-indigo-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Enter N-P-K Values</h2>
          <p className="text-white/40 text-xs mb-8">Apni soil test report ki values dalein.</p>
          
          <div className="space-y-4">
              <input type="number" placeholder="Nitrogen (N)" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white text-right" />
              <input type="number" placeholder="Phosphorus (P)" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white text-right" />
              <input type="number" placeholder="Potassium (K)" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white text-right" />
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-black uppercase text-xs tracking-widest mt-4">Generate Report</button>
          </div>
      </div>
    </div>
  );
}