import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, ShieldCheck, Layout, Edit, Trash2, Plus, Save, X, RefreshCw, 
  Megaphone, BookOpen, Video, FileText, Check, AlertTriangle, Loader2 
} from 'lucide-react';
import { ADMIN_USERNAME } from "../config";
import { DashboardTile, DEFAULT_MAIN_TILES, DEFAULT_FARMER_TILES, ICON_MAP } from '../utils/tileHelpers';

// THEMES for Tiles
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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('tiles'); // tiles | news | knowledge
  const [tileTab, setTileTab] = useState<'main' | 'farmer'>('main');

  // --- DATA STATES ---
  const [mainTiles, setMainTiles] = useState<DashboardTile[]>([]);
  const [farmerTiles, setFarmerTiles] = useState<DashboardTile[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [knowledgeList, setKnowledgeList] = useState<any[]>([]);

  // --- EDIT STATES ---
  const [editingTile, setEditingTile] = useState<DashboardTile | null>(null);
  const [isNewTile, setIsNewTile] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('Emerald');
  
  const [editingNews, setEditingNews] = useState<any | null>(null);
  const [isNewNews, setIsNewNews] = useState(false);

  const [editingKnow, setEditingKnow] = useState<any | null>(null);
  const [isNewKnow, setIsNewKnow] = useState(false);


  // --- INITIAL LOAD ---
  useEffect(() => {
    const init = async () => {
      try {
        const puter = (window as any).puter;
        
        // 1. Check Auth
        if (!puter?.auth) {
            navigate('/admin-login'); 
            return;
        }
        
        // 2. Get User
        const pUser = await puter.auth.getUser();
        if (!pUser || pUser.username !== ADMIN_USERNAME) { 
            navigate('/admin-login'); 
            return; 
        }
        setUser(pUser);

        // 3. Load Data
        const savedMain = await puter.kv.get('fck_main_tiles');
        setMainTiles(savedMain ? JSON.parse(savedMain) : DEFAULT_MAIN_TILES);
        
        const savedFarmer = await puter.kv.get('fck_farmer_tiles');
        setFarmerTiles(savedFarmer ? JSON.parse(savedFarmer) : DEFAULT_FARMER_TILES);
        
        const savedNews = await puter.kv.get('fck_flash_news');
        setNewsList(savedNews ? JSON.parse(savedNews) : []);
        
        const savedKnow = await puter.kv.get('fck_knowledge_base');
        setKnowledgeList(savedKnow ? JSON.parse(savedKnow) : []);
        
        setLoading(false);
      } catch (err) { 
          navigate('/admin-login'); 
      }
    };
    init();
  }, [navigate]);


  // --- SAVE HANDLERS ---
  const saveAllData = async () => {
    const puter = (window as any).puter;
    setLoading(true);
    await puter.kv.set('fck_main_tiles', JSON.stringify(mainTiles));
    await puter.kv.set('fck_farmer_tiles', JSON.stringify(farmerTiles));
    await puter.kv.set('fck_flash_news', JSON.stringify(newsList));
    await puter.kv.set('fck_knowledge_base', JSON.stringify(knowledgeList));
    setLoading(false);
    alert("✅ All Changes Saved Online!");
  };

  // --- TILE LOGIC ---
  const handleTileSave = () => {
      if (!editingTile) return;
      const themeData = THEMES[selectedTheme] || THEMES['Emerald'];
      const updatedTile = { ...editingTile, gradient: themeData.gradient, shadow: themeData.shadow, icon: editingTile.icon || 'Layout' };
      
      const currentList = tileTab === 'main' ? mainTiles : farmerTiles;
      const setList = tileTab === 'main' ? setMainTiles : setFarmerTiles;
      
      if (isNewTile) setList([...currentList, { ...updatedTile, id: Date.now().toString() }]);
      else setList(currentList.map(t => t.id === editingTile.id ? updatedTile : t));
      
      setEditingTile(null);
  };

  const handleTileDelete = (id: string) => {
      if(!confirm("Delete Tile?")) return;
      const setList = tileTab === 'main' ? setMainTiles : setFarmerTiles;
      const currentList = tileTab === 'main' ? mainTiles : farmerTiles;
      setList(currentList.filter(t => t.id !== id));
  };


  // --- NEWS LOGIC ---
  const handleNewsSave = () => {
      if (!editingNews) return;
      const updatedNews = { ...editingNews, id: editingNews.id || Date.now().toString(), date: new Date().toISOString().split('T')[0] };
      
      if (isNewNews) setNewsList([updatedNews, ...newsList]);
      else setNewsList(newsList.map(n => n.id === editingNews.id ? updatedNews : n));
      
      setEditingNews(null);
  };

  const handleNewsDelete = (id: string) => {
      if(!confirm("Delete News Item?")) return;
      setNewsList(newsList.filter(n => n.id !== id));
  };


  // --- KNOWLEDGE LOGIC ---
  const handleKnowSave = () => {
      if (!editingKnow) return;
      const updatedKnow = { ...editingKnow, id: editingKnow.id || Date.now().toString() };
      
      if (isNewKnow) setKnowledgeList([updatedKnow, ...knowledgeList]);
      else setKnowledgeList(knowledgeList.map(k => k.id === editingKnow.id ? updatedKnow : k));
      
      setEditingKnow(null);
  };

  const handleKnowDelete = (id: string) => {
      if(!confirm("Delete Article?")) return;
      setKnowledgeList(knowledgeList.filter(k => k.id !== id));
  };


  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-emerald-500 font-black"><Loader2 className="animate-spin mr-2"/> Syncing...</div>;

  return (
    <div className="min-h-screen bg-[#020408] text-white p-6 font-sans" dir="rtl">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-[#0a0c10] p-6 rounded-[2rem] border border-white/5 shadow-2xl gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 p-3 rounded-2xl"><ShieldCheck size={24} /></div>
          <div><h1 className="text-xl font-black italic">FC Admin Center</h1><p className="text-[10px] uppercase tracking-widest text-emerald-500">Online Mode</p></div>
        </div>
        <div className="flex gap-2">
            <button onClick={saveAllData} className="px-6 py-3 bg-emerald-600 rounded-xl font-bold text-xs uppercase hover:bg-emerald-500 flex items-center gap-2 shadow-lg shadow-emerald-900/40"><Save size={16}/> Save Changes</button>
            <button onClick={() => { (window as any).puter.auth.signOut(); navigate('/admin-login'); }} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white"><LogOut size={20} /></button>
        </div>
      </header>

      {/* NAVIGATION TABS */}
      <div className="flex gap-2 mb-8 bg-white/5 p-2 rounded-[2rem]">
          {['tiles', 'news', 'knowledge'].map(tab => (
              <button key={tab} onClick={() => setActiveSection(tab)} className={`flex-1 py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-widest transition-all ${activeSection === tab ? 'bg-emerald-600 text-white shadow-lg' : 'text-white/40 hover:bg-white/5'}`}>
                  {tab === 'tiles' ? 'Dashboard Tiles' : tab === 'news' ? 'Flash News' : 'Knowledge Base'}
              </button>
          ))}
      </div>

      {/* ==================== 1. TILE MANAGER ==================== */}
      {activeSection === 'tiles' && (
          <div className="animate-in fade-in">
              <div className="flex gap-4 mb-6">
                  <button onClick={() => setTileTab('main')} className={`px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest ${tileTab === 'main' ? 'bg-white text-black' : 'bg-white/10'}`}>Main Dashboard</button>
                  <button onClick={() => setTileTab('farmer')} className={`px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest ${tileTab === 'farmer' ? 'bg-white text-black' : 'bg-white/10'}`}>Farmer Portal</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(tileTab === 'main' ? mainTiles : farmerTiles).map(tile => (
                      <div key={tile.id} className={`p-5 rounded-[2.5rem] bg-gradient-to-br ${tile.gradient} relative group min-h-[180px] flex flex-col justify-between`}>
                          <div className="flex justify-between items-start">
                              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">{ICON_MAP[tile.icon] ? React.createElement(ICON_MAP[tile.icon], { size: 24 }) : <Layout size={24} />}</div>
                              <div className="flex gap-1 bg-black/20 p-1 rounded-xl backdrop-blur-md">
                                  <button onClick={() => { setEditingTile(tile); setIsNewTile(false); setSelectedTheme('Emerald'); }} className="p-2 hover:text-emerald-400"><Edit size={16}/></button>
                                  <button onClick={() => handleTileDelete(tile.id)} className="p-2 hover:text-rose-400"><Trash2 size={16}/></button>
                              </div>
                          </div>
                          <div>
                              <h3 className="font-black text-xl font-urdu mb-1 leading-none">{tile.label}</h3>
                              <p className="text-[10px] uppercase font-bold text-white/60 tracking-widest">{tile.sub}</p>
                          </div>
                      </div>
                  ))}
                  <button onClick={() => { setEditingTile({ id: '', label: '', sub: '', link: '/', icon: 'Sprout', gradient: '', shadow: '', isActive: true } as any); setIsNewTile(true); }} className="border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center min-h-[180px] hover:bg-white/5 hover:border-emerald-500/50 transition-all text-white/30 hover:text-emerald-500 gap-2">
                      <Plus size={40}/>
                      <span className="text-xs font-bold uppercase tracking-widest">Add New Tile</span>
                  </button>
              </div>
          </div>
      )}

      {/* ==================== 2. NEWS MANAGER ==================== */}
      {activeSection === 'news' && (
          <div className="animate-in fade-in space-y-4">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Latest Alerts</h3>
                  <button onClick={() => { setEditingNews({ id: '', title: '', message: '', type: 'Info' }); setIsNewNews(true); }} className="px-6 py-3 bg-blue-600 rounded-xl font-bold text-xs uppercase flex items-center gap-2"><Plus size={16}/> Add Alert</button>
              </div>

              {newsList.map(news => (
                  <div key={news.id} className="bg-[#0a0c10] p-6 rounded-[2rem] border border-white/5 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                          <div className={`p-4 rounded-2xl ${news.type === 'Warning' ? 'bg-rose-500/20 text-rose-500' : 'bg-blue-500/20 text-blue-500'}`}>
                              {news.type === 'Warning' ? <AlertTriangle size={24}/> : <Megaphone size={24}/>}
                          </div>
                          <div>
                              <h4 className="font-bold text-lg text-white mb-1">{news.title}</h4>
                              <p className="text-white/50 text-sm font-urdu">{news.message}</p>
                          </div>
                      </div>
                      <div className="flex gap-2">
                          <button onClick={() => { setEditingNews(news); setIsNewNews(false); }} className="p-3 bg-white/5 rounded-xl hover:bg-white/10"><Edit size={18}/></button>
                          <button onClick={() => handleNewsDelete(news.id)} className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white"><Trash2 size={18}/></button>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* ==================== 3. KNOWLEDGE BASE MANAGER ==================== */}
      {activeSection === 'knowledge' && (
          <div className="animate-in fade-in space-y-4">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Articles & Videos</h3>
                  <button onClick={() => { setEditingKnow({ id: '', title: '', category: 'Article', desc: '', link: '' }); setIsNewKnow(true); }} className="px-6 py-3 bg-purple-600 rounded-xl font-bold text-xs uppercase flex items-center gap-2"><Plus size={16}/> Add Item</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {knowledgeList.map(item => (
                      <div key={item.id} className="bg-[#0a0c10] p-6 rounded-[2rem] border border-white/5">
                          <div className="flex justify-between items-start mb-4">
                              <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${item.category === 'Video' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                                  {item.category}
                              </span>
                              <div className="flex gap-2">
                                  <button onClick={() => { setEditingKnow(item); setIsNewKnow(false); }} className="p-2 bg-white/5 rounded-lg hover:text-white"><Edit size={14}/></button>
                                  <button onClick={() => handleKnowDelete(item.id)} className="p-2 bg-white/5 rounded-lg text-rose-500 hover:bg-rose-500 hover:text-white"><Trash2 size={14}/></button>
                              </div>
                          </div>
                          <h4 className="font-bold text-lg text-white mb-2 font-urdu">{item.title}</h4>
                          <p className="text-white/40 text-sm line-clamp-2">{item.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* ==================== MODALS ==================== */}
      
      {/* TILE EDIT MODAL */}
      {editingTile && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
             <div className="bg-[#1a1d24] w-full max-w-lg rounded-[2.5rem] p-8 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
                 <h2 className="text-2xl font-black mb-6">{isNewTile ? 'New Tile' : 'Edit Tile'}</h2>
                 <div className="space-y-4">
                     <div>
                         <label className="text-xs font-bold text-white/40 uppercase mb-1 block">Label (Urdu)</label>
                         <input value={editingTile.label} onChange={e => setEditingTile({...editingTile, label: e.target.value})} className="w-full bg-black/40 p-4 rounded-xl text-white font-urdu text-right border border-white/5 focus:border-emerald-500 outline-none" placeholder="نام لکھیں" />
                     </div>
                     <div>
                         <label className="text-xs font-bold text-white/40 uppercase mb-1 block">Subtext (English)</label>
                         <input value={editingTile.sub} onChange={e => setEditingTile({...editingTile, sub: e.target.value})} className="w-full bg-black/40 p-4 rounded-xl text-white border border-white/5 focus:border-emerald-500 outline-none" placeholder="SUBTITLE" />
                     </div>
                     <div>
                         <label className="text-xs font-bold text-white/40 uppercase mb-1 block">Link Route</label>
                         <input value={editingTile.link} onChange={e => setEditingTile({...editingTile, link: e.target.value})} className="w-full bg-black/40 p-4 rounded-xl text-white border border-white/5 focus:border-emerald-500 outline-none" placeholder="/route" />
                     </div>
                     <div>
                         <label className="text-xs font-bold text-white/40 uppercase mb-1 block">Color Theme</label>
                         <div className="grid grid-cols-6 gap-2">
                             {Object.keys(THEMES).map(t => <button key={t} onClick={() => setSelectedTheme(t)} className={`h-10 rounded-xl bg-gradient-to-br ${THEMES[t].gradient} ${selectedTheme===t?'ring-2 ring-white scale-110':''}`}/>)}
                         </div>
                     </div>
                 </div>
                 <div className="flex gap-3 mt-8">
                     <button onClick={handleTileSave} className="flex-1 bg-emerald-600 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-emerald-500">Save Tile</button>
                     <button onClick={() => setEditingTile(null)} className="flex-1 bg-white/5 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-white/10">Cancel</button>
                 </div>
             </div>
         </div>
      )}

      {/* NEWS EDIT MODAL */}
      {editingNews && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
             <div className="bg-[#1a1d24] w-full max-w-lg rounded-[2.5rem] p-8 border border-white/10">
                 <h2 className="text-2xl font-black mb-6">{isNewNews ? 'New Alert' : 'Edit Alert'}</h2>
                 <div className="space-y-4">
                     <div>
                         <label className="text-xs font-bold text-white/40 uppercase mb-1 block">Title (English)</label>
                         <input value={editingNews.title} onChange={e => setEditingNews({...editingNews, title: e.target.value})} className="w-full bg-black/40 p-4 rounded-xl text-white border border-white/5 focus:border-blue-500 outline-none" />
                     </div>
                     <div>
                         <label className="text-xs font-bold text-white/40 uppercase mb-1 block">Message (Urdu)</label>
                         <textarea value={editingNews.message} onChange={e => setEditingNews({...editingNews, message: e.target.value})} className="w-full bg-black/40 p-4 rounded-xl text-white font-urdu text-right border border-white/5 focus:border-blue-500 outline-none h-32" />
                     </div>
                     <div className="flex gap-4">
                         <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="ntype" checked={editingNews.type === 'Info'} onChange={() => setEditingNews({...editingNews, type: 'Info'})}/> Info</label>
                         <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="ntype" checked={editingNews.type === 'Warning'} onChange={() => setEditingNews({...editingNews, type: 'Warning'})}/> Warning</label>
                     </div>
                 </div>
                 <div className="flex gap-3 mt-8">
                     <button onClick={handleNewsSave} className="flex-1 bg-blue-600 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-blue-500">Post Alert</button>
                     <button onClick={() => setEditingNews(null)} className="flex-1 bg-white/5 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-white/10">Cancel</button>
                 </div>
             </div>
         </div>
      )}

      {/* KNOWLEDGE EDIT MODAL */}
      {editingKnow && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
             <div className="bg-[#1a1d24] w-full max-w-lg rounded-[2.5rem] p-8 border border-white/10">
                 <h2 className="text-2xl font-black mb-6">{isNewKnow ? 'New Article/Video' : 'Edit Item'}</h2>
                 <div className="space-y-4">
                     <div>
                         <label className="text-xs font-bold text-white/40 uppercase mb-1 block">Title (Urdu/Eng)</label>
                         <input value={editingKnow.title} onChange={e => setEditingKnow({...editingKnow, title: e.target.value})} className="w-full bg-black/40 p-4 rounded-xl text-white font-urdu border border-white/5 focus:border-purple-500 outline-none" />
                     </div>
                     <div>
                         <label className="text-xs font-bold text-white/40 uppercase mb-1 block">Description</label>
                         <textarea value={editingKnow.desc} onChange={e => setEditingKnow({...editingKnow, desc: e.target.value})} className="w-full bg-black/40 p-4 rounded-xl text-white border border-white/5 focus:border-purple-500 outline-none h-24" />
                     </div>
                     <div>
                         <label className="text-xs font-bold text-white/40 uppercase mb-1 block">Link / Video URL</label>
                         <input value={editingKnow.link} onChange={e => setEditingKnow({...editingKnow, link: e.target.value})} className="w-full bg-black/40 p-4 rounded-xl text-white border border-white/5 focus:border-purple-500 outline-none" />
                     </div>
                     <div className="flex gap-4">
                         <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="ktype" checked={editingKnow.category === 'Article'} onChange={() => setEditingKnow({...editingKnow, category: 'Article'})}/> Article</label>
                         <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="ktype" checked={editingKnow.category === 'Video'} onChange={() => setEditingKnow({...editingKnow, category: 'Video'})}/> Video</label>
                     </div>
                 </div>
                 <div className="flex gap-3 mt-8">
                     <button onClick={handleKnowSave} className="flex-1 bg-purple-600 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-purple-500">Save Item</button>
                     <button onClick={() => setEditingKnow(null)} className="flex-1 bg-white/5 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-white/10">Cancel</button>
                 </div>
             </div>
         </div>
      )}

    </div>
  );
}