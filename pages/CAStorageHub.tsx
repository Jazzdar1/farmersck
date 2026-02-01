import React, { useState } from 'react';
import { Warehouse, Thermometer, Wind, Box, Clock, ShieldCheck, AlertCircle, Info } from 'lucide-react';

export default function CAStorage() {
  const [temp, setTemp] = useState(0.5); // Ideal temp for apples in CA
  const [oxygen, setOxygen] = useState(1.5); // Ideal O2 level
  
  // Storage Room Status
  const storageRooms = [
    { id: 'Room A', capacity: '2000 Boxes', occupied: 1500, variety: 'Delicious' },
    { id: 'Room B', capacity: '1500 Boxes', occupied: 1500, variety: 'Kullu Apple' },
    { id: 'Room C', capacity: '2500 Boxes', occupied: 0, variety: 'Empty' }
  ];

  return (
    <div className="p-4 md:p-10 space-y-10 text-right bg-black min-h-screen text-white pb-32" dir="rtl">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 bg-indigo-600/10 p-8 rounded-[3rem] border border-indigo-500/20 shadow-2xl">
        <div className="text-right">
          <h1 className="text-4xl font-black font-urdu text-indigo-400">CA اسٹوریج کنٹرول</h1>
          <p className="text-[10px] text-indigo-500/40 font-black uppercase tracking-widest mt-2 flex items-center justify-end gap-2">
             Controlled Atmosphere Monitoring
          </p>
        </div>
        <div className="bg-indigo-600 p-4 rounded-3xl text-white">
          <Warehouse size={48} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 1. ATMOSPHERE MONITORING */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0a0a0a] p-8 rounded-[3.5rem] border border-white/5 space-y-8">
            <div className="flex items-center gap-4 text-indigo-400">
              <Wind size={28} />
              <h2 className="text-2xl font-black font-urdu text-white">ماحولیاتی نگرانی</h2>
            </div>
            
            <div className="space-y-10">
              {/* Temperature Control */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">
                    <span>Target: 0°C - 2°C</span>
                    <span className="flex items-center gap-2"><Thermometer size={12}/> Temperature</span>
                 </div>
                 <div className="bg-white/5 p-6 rounded-3xl text-center border border-white/5">
                    <p className="text-5xl font-black text-white">{temp}°C</p>
                 </div>
              </div>

              {/* Oxygen Control */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">
                    <span>Target: 1.5% - 2%</span>
                    <span className="flex items-center gap-2"><Wind size={12}/> Oxygen (O2)</span>
                 </div>
                 <div className="bg-white/5 p-6 rounded-3xl text-center border border-white/5">
                    <p className="text-5xl font-black text-indigo-400">{oxygen}%</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. INVENTORY STATUS */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0a0a0a] p-8 rounded-[3.5rem] border border-white/5">
            <div className="flex items-center gap-4 text-indigo-400 mb-8">
              <Box size={28} />
              <h2 className="text-2xl font-black font-urdu text-white">اسٹاک کی تفصیلات</h2>
            </div>

            <div className="space-y-4">
              {storageRooms.map((room, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-[2.5rem] border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-all">
                  <div className="text-left">
                    <p className="font-black text-emerald-500 text-xs uppercase">{room.occupied > 0 ? 'Occupied' : 'Available'}</p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">{room.occupied} / {room.capacity}</p>
                  </div>
                  <div className="text-right">
                    <h4 className="font-black font-urdu text-xl text-white">{room.id}</h4>
                    <p className="text-[10px] text-indigo-400 font-black uppercase mt-1 italic">{room.variety}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Storage Tip */}
      <div className="bg-indigo-500/10 border border-indigo-500/20 p-8 rounded-[3rem] flex items-center gap-6 shadow-2xl">
         <Info className="text-indigo-400 shrink-0" size={32} />
         <p className="text-lg font-bold font-urdu text-indigo-100/60 leading-relaxed italic">
           "ماہرانہ مشورہ: سیب کو اسٹور کرنے سے پہلے ان کی گریڈنگ اور ہائی کولنگ (Pre-cooling) لازمی کریں تاکہ تازگی برقرار رہے۔"
         </p>
      </div>

    </div>
  );
}