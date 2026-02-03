import React, { useState } from 'react';
import { MessageSquare, Users, TrendingUp, Plus, Search } from 'lucide-react';

export default function CommunityForum() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-emerald-600 p-6 md:p-10 rounded-[2.5rem] text-white shadow-xl">
        <h1 className="text-3xl md:text-4xl font-black font-urdu mb-2">کسان چوپال</h1>
        <p className="text-emerald-100 text-xs md:text-sm uppercase tracking-widest font-bold">Community Discussion Hub</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed - 2/3 width on desktop, full on mobile */}
        <div className="lg:col-span-2 space-y-4">
          {/* Post Input */}
          <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-[2rem]">
            <textarea 
              placeholder="اپنی بات یہاں لکھیں..." 
              className="w-full bg-transparent border-none text-white font-urdu text-lg focus:ring-0 no-scrollbar resize-none"
              rows={3}
            />
            <div className="flex justify-between items-center mt-4 border-t border-white/5 pt-4">
              <button className="bg-emerald-500 text-black px-6 py-2 rounded-full font-bold text-xs flex items-center gap-2">
                <Plus size={16}/> Post
              </button>
              <p className="text-[10px] text-white/40 uppercase font-black">Share with Farmers</p>
            </div>
          </div>

          {/* Sample Post */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 font-bold">A</div>
              <div>
                <p className="text-white font-bold text-sm">Anzar Manzoor</p>
                <p className="text-[10px] text-emerald-500/50 uppercase font-black">Kulgam Node</p>
              </div>
            </div>
            <p className="text-white/80 font-urdu text-xl leading-relaxed">اس سال سیب کی فصل کے لیے بہترین کھاد کونسی رہے گی؟</p>
            <div className="flex gap-4 pt-2">
              <button className="text-emerald-500 flex items-center gap-1 text-xs font-bold"><MessageSquare size={14}/> 12 Comments</button>
            </div>
          </div>
        </div>

        {/* Sidebar - Stacks below on mobile */}
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem]">
            <h3 className="text-emerald-500 font-black uppercase text-[10px] tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp size={14}/> Trending Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Apple Scab', 'Mandi Rates', 'Weather Alert', 'Subsidies'].map(tag => (
                <span key={tag} className="bg-white/5 px-4 py-2 rounded-xl text-[10px] text-white/60 font-bold hover:bg-emerald-500/20 hover:text-emerald-500 cursor-pointer transition-all">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}