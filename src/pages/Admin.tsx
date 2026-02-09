import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, ShieldCheck, Layout, Edit, Trash2, Plus, Save, Globe, AlertTriangle, Megaphone, 
  BookOpen, Video, FileText, Check, X, RefreshCw, Loader2 
} from 'lucide-react';
import { ADMIN_USERNAME } from "../config";
import { DashboardTile, DEFAULT_MAIN_TILES, DEFAULT_FARMER_TILES, ICON_MAP } from '../utils/tileHelpers';

// THEMES
const THEMES: any = {
  'Emerald': { gradient: 'from-emerald-500 to-teal-700', shadow: 'shadow-emerald-500/40' },
  'Blue': { gradient: 'from-blue-500 to-indigo-700', shadow: 'shadow-blue-500/40' },
  'Purple': { gradient: 'from-violet-500 to-purple-700', shadow: 'shadow-purple-500/40' },
  'Rose': { gradient: 'from-rose-500 to-red-700', shadow: 'shadow-rose-500/40' },
  'Amber': { gradient: 'from-amber-400 to-orange-600', shadow: 'shadow-orange-500/40' },
  'Sky': { gradient: 'from-sky-400 to-blue-600', shadow: 'shadow-sky-500/40' },
};

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("Connecting to System..."); // Live status text
  const [activeSection, setActiveSection] = useState('news'); 
  const [tileTab, setTileTab] = useState<'main' | 'farmer'>('main');

  // DATA STATES
  const [newsList, setNewsList] = useState<any[]>([]);
  const [mainTiles, setMainTiles] = useState<DashboardTile[]>([]);
  const [farmerTiles, setFarmerTiles] = useState<DashboardTile[]>([]);
  const [knowledgeList, setKnowledgeList] = useState<any[]>([]);

  // EDIT STATES
  const [editingNews, setEditingNews] = useState<any | null>(null);
  const [isNewNews, setIsNewNews] = useState(false);
  const [editingTile, setEditingTile] = useState<DashboardTile | null>(null);
  const [isNewTile, setIsNewTile] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('Emerald');
  const [editingKnow, setEditingKnow] = useState<any | null>(null);
  const [isNewKnow, setIsNewKnow] = useState(false);

  // 🔒 SMART SECURITY CHECK (Waits for Puter)
  useEffect(() => {
    let attempts = 0;

    const initSequence = async () => {
      // 1. Wait for Puter Object (Retry Loop)
      const waitForPuter = () => new Promise<any>((resolve, reject) => {
        const check = () => {
            const p = (window as any).puter;
            if (p) resolve(p);
            else if (attempts++ > 20) reject("System Timeout"); // 10 seconds max
            else setTimeout(check, 500);
        };
        check();
      });

      try {
        setStatusMsg("Initializing System...");
        const puter = await waitForPuter();

        setStatusMsg("Verifying Identity...");
        // 2. Check Login Status
        if (!puter.auth.isSignedIn()) {
             window.location.href = '/admin-login'; // Force Redirect
             return;
        }

        // 3. Verify Username (Case Insensitive Fix)
        const user = await puter.auth.getUser();
        if (!user || user.username.toLowerCase() !== ADMIN_USERNAME.toLowerCase()) {
            await puter.auth.signOut();
            alert(`⛔ ACCESS DENIED.\nYou are logged in as: ${user?.username}\nRequired: ${ADMIN_USERNAME}`);
            window.location.href = '/admin-login';
            return;
        }

        setStatusMsg("Loading Admin Data...");
        // 4. Load Data
        const localNews = localStorage.getItem('fck_flash_news');
        if (localNews) setNewsList(JSON.parse(localNews));
        
        const localMain = localStorage.getItem('fck_main_tiles');
        if (localMain) setMainTiles(JSON.parse(localMain));
        else setMainTiles(DEFAULT_MAIN_TILES);

        const localFarmer = localStorage.getItem('fck_farmer_tiles');
        if (localFarmer) setFarmerTiles(JSON.parse(localFarmer));
        else setFarmerTiles(DEFAULT_FARMER_TILES);

        const localKnow = localStorage.getItem('fck_knowledge_base');
        if (localKnow) setKnowledgeList(JSON.parse(localKnow));

        // ✅ Done
        setLoading(false);

      } catch (err: any) {
        console.error(err);
        if (err === "System Timeout") {
             alert("⚠️ System not responding. Please refresh.");
        } else {
             window.location.href = '/admin-login';
        }
      }
    };

    initSequence();
  }, []);

  // 🚪 HARD LOGOUT
  const handleLogout = async () => {
      setStatusMsg("Logging Out...");
      setLoading(true);
      const puter = (window as any).puter;
      if (puter) await puter.auth.signOut();
      window.location.href = '/admin-login'; 
  };

  // 🔥 PUBLISH FUNCTION
  const broadcastAlerts = async () => {
    setLoading(true);
    setStatusMsg("Publishing Live...");
    const puter = (window as any).puter;
    
    // Local Save
    localStorage.setItem('fck_flash_news', JSON.stringify(newsList));
    localStorage.setItem('fck_main_tiles', JSON.stringify(mainTiles));
    localStorage.setItem('fck_farmer_tiles', JSON.stringify(farmerTiles));
    localStorage.setItem('fck_knowledge_base', JSON.stringify(knowledgeList));
    window.dispatchEvent(new Event('storage'));

    try {
        if (!puter.auth.isSignedIn()) await puter.auth.signIn();
        const user = await puter.auth.getUser();

        // Strict Check
        if (user.username.toLowerCase() !== ADMIN_USERNAME.toLowerCase()) {
             throw new Error("Unauthorized Admin Account");
        }

        // Folder Check
        let folderExists = false;
        try { await puter.fs.stat('www'); folderExists = true; } catch (e) {}
        if (!folderExists) await puter.fs.mkdir('www');

        // Write
        await puter.fs.write('www/alerts.json', JSON.stringify(newsList));

        // Generate Link (Hyphenated)
        const cleanUser = user.username.toLowerCase().replace(/_/g, '-');
        const link = `https://${cleanUser}.puter.site/alerts.json`;
        
        if(confirm(`✅ PUBLISHED!\n\nLink:\n${link}\n\nClick OK to verify.`)) {
             window.open(link, '_blank');
        }
        
    } catch (error: any) {
        alert(`⚠️ Action Failed: ${error.message}`);
    }
    setLoading(false);
  };

  // --- HANDLERS ---
  const handleNewsSave = () => {
      if (!editingNews) return;
      const updated = { ...editingNews, id: editingNews.id || Date.now().toString() };
      if (isNewNews) setNewsList([updated, ...newsList]);
      else setNewsList(newsList.map(n => n.id === editingNews.id ? updated : n));
      setEditingNews(null);
  };

  const handleTileSave = () => {
      if (!editingTile) return;
      const themeData = THEMES[selectedTheme] || THEMES['Emerald'];
      const updated = { ...editingTile, gradient: themeData.gradient, shadow: themeData.shadow, icon: editingTile.icon || 'Layout' };
      const list = tileTab === 'main' ? mainTiles : farmerTiles;
      const setList = tileTab === 'main' ? setMainTiles : setFarmerTiles;
      if (isNewTile) setList([...list, { ...updated, id: Date.now().toString() }]);
      else setList(list.map(t => t.id === editingTile.id ? updated : t));
      setEditingTile(null);
  };

  const handleTileDelete = (id: string) => {
      if(!confirm("Delete Tile?")) return;
      const list = tileTab === 'main' ? mainTiles : farmerTiles;
      const setList = tileTab === 'main' ? setMainTiles : setFarmerTiles;
      setList(list.filter(t => t.id !== id));
  };

  const handleKnowSave = () => {
      if (!editingKnow) return;
      const updated = { ...editingKnow, id: editingKnow.id || Date.now().toString() };
      if (isNewKnow) setKnowledgeList([updated, ...knowledgeList]);
      else setKnowledgeList(knowledgeList.map(k => k.id === editingKnow.id ? updated : k));
      setEditingKnow(null);
  };

  const handleKnowDelete = (id: string) => {
      if(!confirm("Delete Item?")) return;
      setKnowledgeList(knowledgeList.filter(k => k.id !== id));
  };

  if (loading) return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-emerald-500 font-bold gap-6">
          <div className="flex items-center gap-3 text-xl">
              <Loader2 className="animate-spin" size={30} />
              <span>{statusMsg}</span>
          </div>
          <button 
              onClick={() => { window.location.href = '/admin-login'; }}
              className="px-6 py-3 bg-white/5 rounded-full text-xs text-white/50 hover:bg-red-500/20 hover:text-red-500 transition-all border border-white/5"
          >
              Stuck? Click to Retry Login
          </button>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#020408] text-white p-6 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-[#0a0c10] p-6 rounded-[2rem] border border-white/5 gap-4">
        <div><h1 className="text-xl font-black italic">Admin Center</h1><p className="text-xs text-emerald-500">Master Control</p></div>
        <div className="flex gap-2">
            <button onClick={broadcastAlerts} className="px-6 py-3 bg-red-600 rounded-xl font-bold text-xs uppercase hover:bg-red-500 flex items-center gap-2 shadow-lg animate-pulse"><Globe size={16}/> PUBLISH LIVE</button>
            <button onClick={handleLogout} className="px-4 py-3 bg-white/10 hover:bg-red-500/20 text-white hover:text-red-500 rounded-xl border border-white/5 transition-all flex items-center gap-2 text-xs font-bold uppercase"><LogOut size={16} /> Logout</button>
        </div>
      </header>

      <div className="flex gap-2 mb-8 bg-white/5 p-2 rounded-[2rem] overflow-x-auto">
          {['news', 'tiles', 'knowledge'].map(tab => (
              <button key={tab} onClick={() => setActiveSection(tab)} className={`flex-1 py-4 px-6 rounded-[1.5rem] font-black uppercase text-xs tracking-widest transition-all whitespace-nowrap ${activeSection === tab ? 'bg-emerald-600 text-white shadow-lg' : 'text-white/40 hover:bg-white/5'}`}>
                  {tab === 'news' ? 'Flash Alerts' : tab === 'tiles' ? 'Tiles Edit' : 'Knowledge'}
              </button>
          ))}
      </div>

      {/* SECTIONS */}
      {activeSection === 'news' && (
          <div className="space-y-4 animate-in fade-in">
              <button onClick={() => { setEditingNews({ id: '', title: '', message: '', type: 'Info' }); setIsNewNews(true); }} className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-white/40 font-bold hover:border-emerald-500 transition-colors">+ Add Alert</button>
              {newsList.map(news => (
                  <div key={news.id} className="bg-[#0a0c10] p-6 rounded-[2rem] border border-white/5 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${news.type==='Warning'?'bg-rose-500 text-white':'bg-blue-500 text-white'}`}>{news.type === 'Warning' ? <AlertTriangle size={20}/> : <Megaphone size={20}/>}</div>
                          <div><h4 className="font-bold">{news.title}</h4><p className="text-sm text-white/50">{news.message}</p></div>
                      </div>
                      <div className="flex gap-2">
                          <button onClick={() => {setEditingNews(news); setIsNewNews(false);}} className="p-2 bg-white/10 rounded-lg"><Edit size={16}/></button>
                          <button onClick={() => {if(confirm("Delete?")) setNewsList(newsList.filter(n => n.id !== news.id))}} className="p-2 bg-rose-500/20 text-rose-500 rounded-lg"><Trash2 size={16}/></button>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {activeSection === 'tiles' && (
          <div className="animate-in fade-in">
              <div className="flex gap-4 mb-6">
                  <button onClick={() => setTileTab('main')} className={`px-6 py-3 rounded-2xl text-xs font-bold uppercase ${tileTab==='main'?'bg-white text-black':'bg-white/10'}`}>Main Dashboard</button>
                  <button onClick={() => setTileTab('farmer')} className={`px-6 py-3 rounded-2xl text-xs font-bold uppercase ${tileTab==='farmer'?'bg-white text-black':'bg-white/10'}`}>Farmer Portal</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(tileTab === 'main' ? mainTiles : farmerTiles).map(tile => (
                      <div key={tile.id} className={`p-5 rounded-[2.5rem] bg-gradient-to-br ${tile.gradient} relative group min-h-[180px] flex flex-col justify-between`}>
                          <div className="flex justify-between items-start">
                              <div className="bg-white/20 p-3 rounded-2xl">{ICON_MAP[tile.icon] ? React.createElement(ICON_MAP[tile.icon], {size:20}) : <Layout size={20}/>}</div>
                              <div className="flex gap-1 bg-black/20 p-1 rounded-xl backdrop-blur-md">
                                  <button onClick={() => {setEditingTile(tile); setIsNewTile(false); setSelectedTheme('Emerald');}} className="p-2 hover:text-white"><Edit size={16}/></button>
                                  <button onClick={() => handleTileDelete(tile.id)} className="p-2 hover:text-rose-400"><Trash2 size={16}/></button>
                              </div>
                          </div>
                          <div><h3 className="font-black text-xl leading-none">{tile.label}</h3><p className="text-[10px] uppercase opacity-70 mt-1">{tile.sub}</p></div>
                      </div>
                  ))}
                  <button onClick={() => { setEditingTile({ id: '', label: '', sub: '', link: '/', icon: 'Sprout', gradient: '', shadow: '', isActive: true } as any); setIsNewTile(true); }} className="border-2 border-dashed border-white/10 rounded-[2.5rem] flex items-center justify-center min-h-[180px] hover:border-emerald-500 text-white/30 hover:text-emerald-500 transition-colors"><Plus size={30}/></button>
              </div>
          </div>
      )}

      {activeSection === 'knowledge' && (
          <div className="space-y-4 animate-in fade-in">
              <button onClick={() => { setEditingKnow({ id: '', title: '', category: 'Article', desc: '', link: '' }); setIsNewKnow(true); }} className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-white/40 font-bold hover:border-emerald-500 transition-colors">+ Add Item</button>
              {knowledgeList.map(item => (
                  <div key={item.id} className="bg-[#0a0c10] p-6 rounded-[2rem] border border-white/5 flex justify-between items-center">
                      <div>
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-white/10 mb-1 inline-block`}>{item.category}</span>
                          <h4 className="font-bold text-lg">{item.title}</h4>
                      </div>
                      <div className="flex gap-2">
                          <button onClick={() => {setEditingKnow(item); setIsNewKnow(false);}} className="p-2 bg-white/10 rounded-lg"><Edit size={16}/></button>
                          <button onClick={() => handleKnowDelete(item.id)} className="p-2 bg-rose-500/20 text-rose-500 rounded-lg"><Trash2 size={16}/></button>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* MODALS */}
      {editingNews && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
             <div className="bg-[#1a1d24] w-full max-w-lg rounded-[2.5rem] p-8 border border-white/10">
                 <h2 className="text-2xl font-black mb-6">Edit Alert</h2>
                 <input value={editingNews.title} onChange={e => setEditingNews({...editingNews, title: e.target.value})} className="w-full bg-black/40 p-4 rounded-xl mb-4 text-white outline-none" placeholder="Title" />
                 <textarea value={editingNews.message} onChange={e => setEditingNews({...editingNews, message: e.target.value})} className="w-full bg-black/40 p-4 rounded-xl mb-4 text-white font-urdu text-right outline-none" placeholder="Message" />
                 <div className="flex gap-2"><button onClick={handleNewsSave} className="flex-1 bg-emerald-600 py-4 rounded-xl font-bold uppercase">Save</button><button onClick={() => setEditingNews(null)} className="flex-1 bg-white/5 py-4 rounded-xl font-bold uppercase">Cancel</button></div>
             </div>
         </div>
      )}
      
      {editingTile && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
             <div className="bg-[#1a1d24] w-full max-w-lg rounded-[2.5rem] p-8 border border-white/10">
                 <h2 className="text-2xl font-black mb-6">Edit Tile</h2>
                 <div className="space-y-4 mb-8">
                     <input value={editingTile.label} onChange={e => setEditingTile({...editingTile, label: e.target.value})} className="w-full bg-black/40 p-4 rounded-xl text-white font-urdu text-right" placeholder="Label (Urdu)" />
                     <input value={editingTile.sub} onChange={e => setEditingTile({...editingTile, sub: e.target.value})} className="w-full bg-black/40 p-4 rounded-xl text-white" placeholder="Subtext (Eng)" />
                     <input value={editingTile.link} onChange={e => setEditingTile({...editingTile, link: e.target.value})} className="w-full bg-black/40 p-4 rounded-xl text-white" placeholder="Route Link" />
                     <div className="grid grid-cols-6 gap-2">{Object.keys(THEMES).map(t => <button key={t} onClick={() => setSelectedTheme(t)} className={`h-10 rounded-xl bg-gradient-to-br ${THEMES[t].gradient} ring-2 ring-offset-2 ring-offset-black ${selectedTheme===t ? 'ring-white' : 'ring-transparent'}`}/>)}</div>
                 </div>
                 <div className="flex gap-2"><button onClick={handleTileSave} className="flex-1 bg-emerald-600 py-4 rounded-xl font-bold uppercase">Save</button><button onClick={() => setEditingTile(null)} className="flex-1 bg-white/5 py-4 rounded-xl font-bold uppercase">Cancel</button></div>
             </div>
         </div>
      )}

      {editingKnow && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
             <div className="bg-[#1a1d24] w-full max-w-lg rounded-[2.5rem] p-8 border border-white/10">
                 <h2 className="text-2xl font-black mb-6">Edit Item</h2>
                 <input value={editingKnow.title} onChange={e => setEditingKnow({...editingKnow, title: e.target.value})} className="w-full bg-black/40 p-4 rounded-xl mb-4 text-white" placeholder="Title" />
                 <textarea value={editingKnow.desc} onChange={e => setEditingKnow({...editingKnow, desc: e.target.value})} className="w-full bg-black/40 p-4 rounded-xl mb-4 text-white" placeholder="Description" />
                 <input value={editingKnow.link} onChange={e => setEditingKnow({...editingKnow, link: e.target.value})} className="w-full bg-black/40 p-4 rounded-xl mb-4 text-white" placeholder="URL" />
                 <div className="flex gap-4 mb-8">
                     <label className="flex items-center gap-2 cursor-pointer bg-white/5 p-3 rounded-xl flex-1"><input type="radio" name="ktype" checked={editingKnow.category === 'Article'} onChange={() => setEditingKnow({...editingKnow, category: 'Article'})}/> Article</label>
                     <label className="flex items-center gap-2 cursor-pointer bg-white/5 p-3 rounded-xl flex-1"><input type="radio" name="ktype" checked={editingKnow.category === 'Video'} onChange={() => setEditingKnow({...editingKnow, category: 'Video'})}/> Video</label>
                 </div>
                 <div className="flex gap-2"><button onClick={handleKnowSave} className="flex-1 bg-emerald-600 py-4 rounded-xl font-bold uppercase">Save</button><button onClick={() => setEditingKnow(null)} className="flex-1 bg-white/5 py-4 rounded-xl font-bold uppercase">Cancel</button></div>
             </div>
         </div>
      )}
    </div>
  );
}