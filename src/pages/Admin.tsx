import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, ShieldCheck, Layout, Edit, Trash2, Plus, Save, X, RefreshCw, 
  Megaphone, BookOpen, Video, FileText
} from 'lucide-react';
import { ADMIN_USERNAME } from "../config";
import { DashboardTile, DEFAULT_MAIN_TILES, DEFAULT_FARMER_TILES, ICON_MAP } from '../utils/tileHelpers';

// ... (Theme helpers remain same) ...
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
  const [activeSection, setActiveSection] = useState('tiles');
  const [tileTab, setTileTab] = useState<'main' | 'farmer'>('main');

  // DATA STATES
  const [mainTiles, setMainTiles] = useState<DashboardTile[]>([]);
  const [farmerTiles, setFarmerTiles] = useState<DashboardTile[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [knowledgeList, setKnowledgeList] = useState<any[]>([]);

  // EDIT STATES
  const [editingTile, setEditingTile] = useState<DashboardTile | null>(null);
  const [newNews, setNewNews] = useState({ title: '', message: '', type: 'Info' });
  const [newKnowledge, setNewKnowledge] = useState({ title: '', category: 'Video', desc: '', link: '' });
  const [isNew, setIsNew] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('Emerald');

  useEffect(() => {
    const init = async () => {
      try {
        const puter = (window as any).puter;
        if (!puter?.auth) return;
        let pUser = null;
        try { pUser = await puter.auth.getUser(); } catch (e) { navigate('/admin-login'); return; }

        if (!pUser || pUser.username !== ADMIN_USERNAME) { navigate('/admin-login'); return; }
        setUser(pUser);

        const savedMain = await puter.kv.get('fck_main_tiles');
        setMainTiles(savedMain ? JSON.parse(savedMain) : DEFAULT_MAIN_TILES);
        const savedFarmer = await puter.kv.get('fck_farmer_tiles');
        setFarmerTiles(savedFarmer ? JSON.parse(savedFarmer) : DEFAULT_FARMER_TILES);
        const savedNews = await puter.kv.get('fck_flash_news');
        setNewsList(savedNews ? JSON.parse(savedNews) : []);
        const savedKnow = await puter.kv.get('fck_knowledge_base');
        setKnowledgeList(savedKnow ? JSON.parse(savedKnow) : []);
        
        setLoading(false);
      } catch (err) { navigate('/admin-login'); }
    };
    init();
  }, [navigate]);

  // Save Handlers (Keep logic same, update UI below)
  const saveTiles = async () => {
    const puter = (window as any).puter;
    await puter.kv.set('fck_main_tiles', JSON.stringify(mainTiles));
    await puter.kv.set('fck_farmer_tiles', JSON.stringify(farmerTiles));
    alert("Tiles Saved!");
  };
  const handleTileSave = () => {
      if (!editingTile) return;
      const themeData = THEMES[selectedTheme] || THEMES['Emerald'];
      const updatedTile = { ...editingTile, gradient: themeData.gradient, shadow: themeData.shadow, icon: editingTile.icon || 'Layout' };
      const currentList = tileTab === 'main' ? mainTiles : farmerTiles;
      const setList = tileTab === 'main' ? setMainTiles : setFarmerTiles;
      if (isNew) setList([...currentList, { ...updatedTile, id: Date.now().toString() }]);
      else setList(currentList.map(t => t.id === editingTile.id ? updatedTile : t));
      setEditingTile(null);
  };
  const handleTileDelete = (id: string) => {
      if(!confirm("Delete?")) return;
      const setList = tileTab === 'main' ? setMainTiles : setFarmerTiles;
      const currentList = tileTab === 'main' ? mainTiles : farmerTiles;
      setList(currentList.filter(t => t.id !== id));
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-emerald-500 font-black">Loading Admin...</div>;

  return (
    <div className="min-h-screen bg-[#020408] text-white p-6 font-sans" dir="rtl">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-[#0a0c10] p-6 rounded-[2rem] border border-white/5 shadow-2xl gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 p-3 rounded-2xl"><ShieldCheck size={24} /></div>
          <div><h1 className="text-xl font-black italic">Admin Panel</h1><p className="text-[10px] uppercase tracking-widest">{user?.username}</p></div>
        </div>
        <button onClick={() => { (window as any).puter.auth.signOut(); navigate('/admin-login'); }} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white"><LogOut size={20} /></button>
      </header>

      {/* TABS */}
      <div className="flex gap-2 mb-8 bg-white/5 p-2 rounded-[2rem]">
          {['tiles', 'news', 'knowledge'].map(tab => (
              <button key={tab} onClick={() => setActiveSection(tab)} className={`flex-1 py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-widest ${activeSection === tab ? 'bg-emerald-600 text-white shadow-lg' : 'text-white/40 hover:bg-white/5'}`}>
                  {tab.toUpperCase()}
              </button>
          ))}
      </div>

      {/* TILE MANAGER */}
      {activeSection === 'tiles' && (
          <div className="animate-in fade-in">
              <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                      <button onClick={() => setTileTab('main')} className={`px-4 py-2 rounded-xl text-xs font-bold ${tileTab === 'main' ? 'bg-white text-black' : 'bg-white/10'}`}>Main Dash</button>
                      <button onClick={() => setTileTab('farmer')} className={`px-4 py-2 rounded-xl text-xs font-bold ${tileTab === 'farmer' ? 'bg-white text-black' : 'bg-white/10'}`}>Farmer Portal</button>
                  </div>
                  <button onClick={saveTiles} className="bg-emerald-600 px-6 py-2 rounded-xl font-bold text-xs uppercase flex gap-2 items-center"><Save size={14}/> Save Layout</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(tileTab === 'main' ? mainTiles : farmerTiles).map(tile => (
                      <div key={tile.id} className={`p-4 rounded-[2rem] bg-gradient-to-br ${tile.gradient} relative group opacity-${tile.isActive ? '100':'50'}`}>
                          <div className="flex justify-between mb-2">
                              <div className="bg-white/20 p-2 rounded-xl">{ICON_MAP[tile.icon] ? React.createElement(ICON_MAP[tile.icon], { size: 20 }) : <Layout size={20} />}</div>
                              <div className="flex gap-1">
                                  <button onClick={() => { setEditingTile(tile); setIsNew(false); }} className="p-2 bg-black/20 rounded-lg hover:bg-black/40"><Edit size={14}/></button>
                                  <button onClick={() => handleTileDelete(tile.id)} className="p-2 bg-black/20 rounded-lg hover:bg-rose-600"><Trash2 size={14}/></button>
                              </div>
                          </div>
                          <h3 className="font-bold font-urdu">{tile.label}</h3>
                          <p className="text-[10px] uppercase font-bold text-white/60">{tile.sub}</p>
                      </div>
                  ))}
                  <button onClick={() => { setEditingTile({ id: '', label: '', sub: '', link: '/', icon: 'Sprout', gradient: '', shadow: '', isActive: true } as any); setIsNew(true); }} className="border-2 border-dashed border-white/10 rounded-[2rem] flex items-center justify-center min-h-[150px] hover:bg-white/5"><Plus/></button>
              </div>
          </div>
      )}

      {/* EDIT MODAL */}
      {editingTile && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
             <div className="bg-[#1a1d24] w-full max-w-lg rounded-[2.5rem] p-6">
                 <h2 className="text-xl font-bold mb-4">{isNew ? 'New Tile' : 'Edit Tile'}</h2>
                 
                 {/* BILINGUAL INPUTS */}
                 <label className="text-[10px] uppercase font-bold text-white/40 mb-1 block">Main Label (Urdu)</label>
                 <input value={editingTile.label} onChange={e => setEditingTile({...editingTile, label: e.target.value})} className="w-full bg-black/40 p-3 rounded-xl mb-4 text-white text-right font-urdu" placeholder="موسم کا حال" />
                 
                 <label className="text-[10px] uppercase font-bold text-white/40 mb-1 block">Subtext (English)</label>
                 <input value={editingTile.sub} onChange={e => setEditingTile({...editingTile, sub: e.target.value})} className="w-full bg-black/40 p-3 rounded-xl mb-4 text-white" placeholder="WEATHER FORECAST" />
                 
                 <label className="text-[10px] uppercase font-bold text-white/40 mb-1 block">Route Link</label>
                 <input value={editingTile.link} onChange={e => setEditingTile({...editingTile, link: e.target.value})} className="w-full bg-black/40 p-3 rounded-xl mb-4 text-white" placeholder="/weather" />
                 
                 <div className="grid grid-cols-4 gap-2 mb-4">
                     {Object.keys(THEMES).map(t => <button key={t} onClick={() => setSelectedTheme(t)} className={`h-8 rounded-lg bg-gradient-to-br ${THEMES[t].gradient} ${selectedTheme===t?'ring-2 ring-white':''}`}/>)}
                 </div>
                 <div className="flex gap-2">
                     <button onClick={handleTileSave} className="flex-1 bg-emerald-600 py-3 rounded-xl font-bold">Save</button>
                     <button onClick={() => setEditingTile(null)} className="flex-1 bg-white/10 py-3 rounded-xl">Cancel</button>
                 </div>
             </div>
         </div>
      )}
    </div>
  );
}