import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Download, GraduationCap, Newspaper } from 'lucide-react';

export default function KnowledgeHub() {
  const [adminManuals, setAdminManuals] = useState<any[]>([]);
  const puter = (window as any).puter;

  useEffect(() => {
    const fetchLive = async () => {
      if (puter) {
        const res = await puter.kv.get('fck_knowledge_db');
        if (res) setAdminManuals(JSON.parse(res));
      }
    };
    fetchLive();
  }, [puter]);

  return (
    <div className="p-6 md:p-12 min-h-screen bg-slate-950 text-white text-right" dir="rtl">
      <header className="mb-10"><h1 className="text-4xl font-black font-urdu text-emerald-400 tracking-tighter">نالج ہب | Knowledge Hub</h1></header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LIVE ADMIN PDFS */}
        <section className="space-y-6">
          <h2 className="text-xl font-black font-urdu text-emerald-500 flex items-center gap-3"><Newspaper size={20} /> ایڈمن مینوئلز (Admin Manuals)</h2>
          {adminManuals.map((item) => (
            <div key={item.id} className="bg-emerald-950/20 border border-emerald-500/20 p-6 rounded-3xl hover:bg-emerald-950/40 transition-all">
              <h3 className="text-xl font-bold font-urdu text-white">{item.content}</h3>
              {item.url && <a href={item.url} target="_blank" className="mt-4 inline-flex items-center gap-2 text-emerald-400 font-bold hover:underline"><Download size={16} /> ڈاؤن لوڈ (PDF)</a>}
            </div>
          ))}
        </section>

        {/* PERMANENT CORE GUIDES */}
        <section className="space-y-6">
          <h2 className="text-xl font-black font-urdu text-blue-400 flex items-center gap-3"><BookOpen size={20} /> بنیادی رہنمائی (Core Guides)</h2>
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex justify-between items-center">
            <FileText className="text-blue-400" />
            <div className="text-right flex-1 px-6"><h3 className="font-bold font-urdu">سیب کی نئی اقسام کی شجر کاری</h3></div>
            <Download className="text-slate-600" size={20} />
          </div>
        </section>
      </div>
    </div>
  );
}