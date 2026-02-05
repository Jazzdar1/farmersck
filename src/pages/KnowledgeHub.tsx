import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Play, FileText, ExternalLink, Youtube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function KnowledgeHub() {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const loadKnowledge = async () => {
          const puter = (window as any).puter;
          if (puter?.kv) {
              const data = await puter.kv.get('fck_knowledge_base');
              if (data) setItems(JSON.parse(data));
          }
          setLoading(false);
      };
      loadKnowledge();
  }, []);

  return (
    <div className="min-h-screen bg-[#020408] text-white p-6 font-sans" dir="rtl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/')} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10"><ArrowLeft /></button>
        <div className="text-right">
             <h1 className="text-2xl font-black italic">Knowledge Hub</h1>
             <p className="text-sky-500 text-xs font-bold uppercase tracking-widest">Expert Guides & Videos</p>
        </div>
      </div>

      {loading ? (
          <p className="text-center text-white/30">Loading Library...</p>
      ) : items.length === 0 ? (
          <div className="text-center py-20 opacity-40">
              <BookOpen size={60} className="mx-auto mb-4"/>
              <p>No content added yet by Admin.</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(item => (
                  <div key={item.id} className="bg-[#0a0c10] p-5 rounded-[2.5rem] border border-white/5 hover:border-sky-500/30 transition-all group flex flex-col justify-between min-h-[250px] relative overflow-hidden">
                      {/* Decoration */}
                      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[50px] opacity-20 ${item.category === 'Video' ? 'bg-rose-500' : 'bg-blue-500'}`}></div>

                      <div>
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${item.category === 'Video' ? 'bg-rose-500/20 text-rose-500' : 'bg-blue-500/20 text-blue-500'}`}>
                              {item.category === 'Video' ? <Youtube size={24}/> : <FileText size={24}/>}
                          </div>
                          <h3 className="font-black text-xl text-white mb-2 leading-tight">{item.title}</h3>
                          <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                      </div>

                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="mt-6 w-full py-4 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 hover:text-sky-400 transition-all"
                      >
                          {item.category === 'Video' ? 'Watch Video' : 'Read Article'} <ExternalLink size={14}/>
                      </a>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
}