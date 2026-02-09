import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, ShieldCheck, Layout, Edit, Trash2, Plus, Save, Globe, AlertTriangle, Megaphone 
} from 'lucide-react';
import { ADMIN_USERNAME } from "../config";
import { DashboardTile, DEFAULT_MAIN_TILES, DEFAULT_FARMER_TILES, ICON_MAP } from '../utils/tileHelpers';

// THEMES
const THEMES: any = {
  'Emerald': { gradient: 'from-emerald-500 to-teal-700', shadow: 'shadow-emerald-500/40' },
  'Blue': { gradient: 'from-blue-500 to-indigo-700', shadow: 'shadow-blue-500/40' },
  'Rose': { gradient: 'from-rose-500 to-red-700', shadow: 'shadow-rose-500/40' },
  'Amber': { gradient: 'from-amber-400 to-orange-600', shadow: 'shadow-orange-500/40' },
};

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('news'); 
  
  // DATA
  const [newsList, setNewsList] = useState<any[]>([]);
  const [mainTiles, setMainTiles] = useState<DashboardTile[]>([]);
  
  // EDIT
  const [editingNews, setEditingNews] = useState<any | null>(null);
  const [isNewNews, setIsNewNews] = useState(false);

  useEffect(() => {
    const init = async () => {
      // 1. Load LocalStorage (Instant)
      const localNews = localStorage.getItem('fck_flash_news');
      if (localNews) setNewsList(JSON.parse(localNews));
      setLoading(false);
    };
    init();
  }, []);

  // 🔥 ROBUST BROADCAST FUNCTION
  const broadcastAlerts = async () => {
    setLoading(true);
    const puter = (window as any).puter;
    
    // 1. INSTANT LOCAL SAVE (Guaranteed)
    localStorage.setItem('fck_flash_news', JSON.stringify(newsList));
    window.dispatchEvent(new Event('storage'));

    // 2. CLOUD SAVE WITH AUTO-LOGIN
    try {
        // Step A: Check Login
        if (!puter.auth.isSignedIn()) {
            await puter.auth.signIn(); // Force Login if needed
        }

        // Step B: Double Check User
        const user = await puter.auth.getUser();
        if (!user) throw new Error("User Login Failed");

        // Step C: Write Public File
        // We use a try-catch on mkdir because it throws if folder exists
        try { await puter.fs.mkdir('www'); } catch (e) {} 
        
        await puter.fs.write('www/alerts.json', JSON.stringify(newsList));
        
        alert(`✅ SUCCESS! Alerts are Live.\nPublic Link: https://${user.username}.puter.site/alerts.json`);
        
    } catch (error: any) {
        console.error(error);
        // Show exact error to help debugging
        alert(`⚠️ Saved Locally, but Cloud Failed.\nError: ${error.message || error}`);
    }
    setLoading(false);
  };

  const handleNewsSave = () => {
      if (!editingNews) return;
      const updated = { ...editingNews, id: editingNews.id || Date.now().toString() };
      if (isNewNews) setNewsList([updated, ...newsList]);
      else setNewsList(newsList.map(n => n.id === editingNews.id ? updated : n));
      setEditingNews(null);
  };

  const deleteNews = (id: string) => {
      if(confirm("Delete this alert?")) setNewsList(newsList.filter(n => n.id !== id));
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-emerald-500 font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#020408] text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-8 bg-[#0a0c10] p-6 rounded-[2rem] border border-white/5">
        <div><h1 className="text-xl font-black italic">Admin Center</h1><p className="text-xs text-emerald-500">Master Control</p></div>
        <div className="flex gap-2">
            <button onClick={broadcastAlerts} className="px-6 py-3 bg-red-600 rounded-xl font-bold text-xs uppercase hover:bg-red-500 flex items-center gap-2 shadow-lg animate-pulse"><Globe size={16}/> PUBLISH ALERTS</button>
            <button onClick={() => navigate('/')} className="p-3 bg-white/10 rounded-xl"><LogOut size={20} /></button>
        </div>
      </header>

      {/* MANAGER */}
      <div className="space-y-4">
          <button onClick={() => { setEditingNews({ id: '', title: '', message: '', type: 'Info' }); setIsNewNews(true); }} className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-white/40 font-bold hover:border-emerald-500">+ Add Alert</button>
          
          {newsList.length === 0 && (
              <p className="text-center text-white/30 py-10">No alerts active. Add one to see it on Dashboard.</p>
          )}

          {newsList.map(news => (
              <div key={news.id} className="bg-[#0a0c10] p-6 rounded-[2rem] border border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${news.type==='Warning'?'bg-rose-500 text-white':'bg-blue-500 text-white'}`}>{news.type === 'Warning' ? <AlertTriangle size={20}/> : <Megaphone size={20}/>}</div>
                      <div><h4 className="font-bold">{news.title}</h4><p className="text-sm text-white/50">{news.message}</p></div>
                  </div>
                  <div className="flex gap-2">
                      <button onClick={() => {setEditingNews(news); setIsNewNews(false);}} className="p-2 bg-white/10 rounded-lg"><Edit size={16}/></button>
                      <button onClick={() => deleteNews(news.id)} className="p-2 bg-rose-500/20 text-rose-500 rounded-lg"><Trash2 size={16}/></button>
                  </div>
              </div>
          ))}
      </div>

      {/* MODAL */}
      {editingNews && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
             <div className="bg-[#1a1d24] w-full max-w-lg rounded-[2.5rem] p-8 border border-white/10">
                 <h2 className="text-2xl font-black mb-6">Edit Alert</h2>
                 <input value={editingNews.title} onChange={e => setEditingNews({...editingNews, title: e.target.value})} className="w-full bg-black/40 p-4 rounded-xl mb-4 text-white outline-none" placeholder="Title" />
                 <textarea value={editingNews.message} onChange={e => setEditingNews({...editingNews, message: e.target.value})} className="w-full bg-black/40 p-4 rounded-xl mb-4 text-white font-urdu text-right outline-none" placeholder="Message (Urdu)" />
                 <div className="flex gap-4 mb-8">
                     <label className="flex items-center gap-2 bg-white/5 p-3 rounded-xl flex-1 cursor-pointer"><input type="radio" name="ntype" checked={editingNews.type === 'Info'} onChange={() => setEditingNews({...editingNews, type: 'Info'})}/> 🔵 Info</label>
                     <label className="flex items-center gap-2 bg-white/5 p-3 rounded-xl flex-1 cursor-pointer"><input type="radio" name="ntype" checked={editingNews.type === 'Warning'} onChange={() => setEditingNews({...editingNews, type: 'Warning'})}/> 🔴 Warning</label>
                 </div>
                 <div className="flex gap-2">
                     <button onClick={handleNewsSave} className="flex-1 bg-emerald-600 py-4 rounded-xl font-bold">Save Draft</button>
                     <button onClick={() => setEditingNews(null)} className="flex-1 bg-white/5 py-4 rounded-xl font-bold">Cancel</button>
                 </div>
             </div>
         </div>
      )}
    </div>
  );
}