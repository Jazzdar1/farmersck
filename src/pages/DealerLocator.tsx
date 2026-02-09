import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPinned, Phone, MapPin, Search, Star, Warehouse, 
  ShoppingBag, ArrowLeft, Loader2, Sparkles, Crosshair, 
  ChevronDown, MessageCircle, Navigation 
} from 'lucide-react';

export default function DealerLocator() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [dealers, setDealers] = useState<any[]>([]);
  const [page, setPage] = useState(1); // Keeping your file's logic

  // ✅ BACKUP DATA (Safety Net)
  const BACKUP_DATA = [
    { name: "Kashmir Agro Center", loc: "Lal Chowk, Srinagar", phone: "9906123456", whatsapp: "9906123456", type: "Pesticides", rating: 4.8 },
    { name: "Bhat Fertilizers", loc: "Anantnag Main Market", phone: "9419012345", whatsapp: "9419012345", type: "Fertilizer", rating: 4.5 },
  ];

  // 🤖 SEARCH LOGIC (As per your attached file structure)
  const searchWithGemini = async (searchQuery: string, isLoadMore: boolean = false) => {
    setLoading(true);
    const targetQuery = searchQuery || "Top Agriculture Dealers in Kashmir";
    
    // Calculate Page based on your logic
    const currentPage = isLoadMore ? page + 1 : 1;
    if (!isLoadMore) setPage(1);

    try {
      const puter = (window as any).puter;
      
      // ✅ UPDATED PROMPT (Requests Ratings & WhatsApp)
      const prompt = `
        Act as a J&K Agriculture Directory. 
        Find 6 UNIQUE shops/godowns for '${targetQuery}' in Jammu and Kashmir.
        Important: Provide results that are different from common ones. Page Number: ${currentPage}.
        
        Return ONLY a JSON array with these fields:
        [{"name":"Shop Name", "loc":"Address", "phone":"Phone", "whatsapp":"Phone", "type":"Category", "rating": 4.5}]
        
        Rules:
        1. Rating should be realistic (4.0 - 5.0).
        2. WhatsApp number should be same as phone if not available.
      `;
      
      // Direct Call (Replaces askAI to ensure it works)
      const res = await puter.ai.chat(prompt);
      const text = res?.message?.content || "";
      const match = text.match(/\[.*\]/s); 
      
      if (match) {
        const newResults = JSON.parse(match[0]);
        
        if (isLoadMore) {
          setDealers(prev => [...prev, ...newResults]);
          setPage(currentPage); // Update page state
        } else {
          setDealers(newResults);
          setPage(1);
        }
      } else {
        if(!isLoadMore) setDealers(BACKUP_DATA);
      }

    } catch (error) {
      console.error("Search Error:", error);
      if(!isLoadMore) setDealers(BACKUP_DATA);
    } finally {
      setLoading(false);
    }
  };

  // GPS LOGIC
  const handleGPS = () => {
    if (!navigator.geolocation) return alert("Location not supported");
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
            const puter = (window as any).puter;
            const res = await puter.ai.chat(`Identify city name for Lat: ${pos.coords.latitude}, Lon: ${pos.coords.longitude}. Only return name.`);
            const city = res?.message?.content?.trim() || "Nearby";
            setQuery(city);
            searchWithGemini(city);
        } catch (e) {
            searchWithGemini("Nearby");
        }
    }, () => setLoading(false));
  };

  // Initial Load
  useEffect(() => { searchWithGemini("Srinagar"); }, []);

  return (
    <div className="min-h-screen bg-[#020408] text-white p-6 pb-32 font-sans" dir="rtl">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/')} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10"><ArrowLeft /></button>
        <div className="text-right">
             <h1 className="text-2xl font-black italic">Dealer Locator</h1>
             <p className="text-cyan-500 text-xs font-bold font-urdu">ڈیلرز تلاش کریں (Page {page})</p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative mb-6 bg-[#0a0c10] p-2 rounded-[2rem] border border-white/10 flex items-center shadow-2xl">
        <button onClick={handleGPS} className="p-4 bg-cyan-600/20 text-cyan-400 rounded-2xl hover:bg-cyan-600 hover:text-white transition-all mr-2">
            <Crosshair size={20} />
        </button>
        
        <input 
          type="text"
          placeholder="شہر تلاش کریں..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchWithGemini(query)}
          className="flex-1 bg-transparent text-right text-white font-urdu text-lg outline-none px-4 placeholder-white/30"
        />
        
        <button onClick={() => searchWithGemini(query)} className="p-4 bg-cyan-600 text-white rounded-[1.5rem] hover:bg-cyan-500 shadow-lg ml-1">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
        </button>
      </div>

      {/* DEALER LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {dealers.map((dealer, i) => (
          <div key={i} className="bg-[#0a0c10] p-6 rounded-[2.5rem] border border-white/5 hover:border-cyan-500/30 transition-all group hover:-translate-y-1 duration-300 relative overflow-hidden">
            
            {/* Header: Type & Rating */}
            <div className="flex justify-between items-start mb-4 relative z-10">
               <div className={`p-3 rounded-2xl ${dealer.type?.includes('Machinery') ? 'bg-orange-500/10 text-orange-500' : 'bg-cyan-500/10 text-cyan-500'}`}>
                   {dealer.type?.includes('Machinery') ? <Warehouse size={20}/> : <ShoppingBag size={20}/>}
               </div>
               <div className="text-right">
                   <div className="flex items-center justify-end gap-1 text-yellow-400 mb-1 bg-yellow-400/10 px-2 py-1 rounded-lg">
                       <span className="text-xs font-black">{dealer.rating || 4.5}</span>
                       <Star size={12} fill="currentColor"/>
                   </div>
                   <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{dealer.type}</span>
               </div>
            </div>

            {/* Name & Address */}
            <div className="mb-6 relative z-10">
                <h3 className="text-xl font-black text-white mb-1 leading-tight">{dealer.name}</h3>
                <p className="text-white/50 text-sm flex items-center gap-1 justify-end font-urdu">
                {dealer.loc} <MapPin size={12} className="text-cyan-500"/>
                </p>
            </div>

            {/* ✅ ACTION BUTTONS (WhatsApp, Map, Call) */}
            <div className="grid grid-cols-3 gap-2 relative z-10">
                {/* 1. CALL */}
                <a 
                  href={`tel:${dealer.phone}`} 
                  className="bg-cyan-600/10 text-cyan-400 hover:bg-cyan-600 hover:text-white py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all group/btn"
                >
                  <Phone size={18} className="group-hover/btn:scale-110 transition-transform"/>
                  <span className="text-[8px] font-black uppercase tracking-widest">Call</span>
                </a>

                {/* 2. WHATSAPP */}
                <a 
                  href={`https://wa.me/91${dealer.whatsapp?.replace(/\D/g,'') || dealer.phone?.replace(/\D/g,'')}`} 
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600 hover:text-white py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all group/btn"
                >
                  <MessageCircle size={18} className="group-hover/btn:scale-110 transition-transform"/>
                  <span className="text-[8px] font-black uppercase tracking-widest">Chat</span>
                </a>

                {/* 3. MAP LOCATION */}
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dealer.name + " " + dealer.loc)}`}
                  target="_blank"
                  rel="noreferrer" 
                  className="bg-orange-600/10 text-orange-400 hover:bg-orange-600 hover:text-white py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all group/btn"
                >
                  <Navigation size={18} className="group-hover/btn:scale-110 transition-transform"/>
                  <span className="text-[8px] font-black uppercase tracking-widest">Map</span>
                </a>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none"></div>
          </div>
        ))}
      </div>
      
      {/* SHOW MORE BUTTON */}
      <div className="flex justify-center pb-10">
          <button 
            onClick={() => searchWithGemini(query, true)}
            disabled={loading}
            className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-[2rem] font-bold uppercase text-xs tracking-widest flex items-center gap-3 transition-all disabled:opacity-50 border border-white/10 hover:border-cyan-500/50 shadow-lg"
          >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <ChevronDown size={18} />}
              {loading ? "Searching..." : "Show More Results"}
          </button>
      </div>

    </div>
  );
}