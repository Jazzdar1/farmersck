import React, { useState, useEffect } from 'react';
import { 
  MapPinned, Phone, MapPin, Search, Star, Warehouse, 
  ShoppingBag, Dog, Sprout, Loader2, Sparkles, Globe, PlusCircle 
} from 'lucide-react';
import { askAI } from '../services/puterService';

export default function DealerLocator() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [dealers, setDealers] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  // Gemini AI Search with Pagination Logic
  const searchWithGemini = async (searchType: string, isLoadMore: boolean = false) => {
    setLoading(true);
    const currentQuery = searchType || "Top Pesticide and Pet shops in J&K";
    
    try {
      // Prompt optimized to find 'NEW' results
      const prompt = `Act as a J&K Agriculture Directory. Find 10 UNIQUE shops/godowns for '${currentQuery}' in Jammu and Kashmir. 
      Important: Provide results that are different from common ones. Page Number: ${isLoadMore ? page + 1 : 1}.
      Return ONLY a JSON array: [{"name":"...", "loc":"...", "phone":"...", "type":"..."}]`;
      
      const res = await askAI(prompt, false);
      const match = res?.match(/\[.*\]/s); 
      
      if (match) {
        const newResults = JSON.parse(match[0]);
        if (isLoadMore) {
          setDealers(prev => [...prev, ...newResults]); // Purane results mein naye add karna
          setPage(prev => prev + 1);
        } else {
          setDealers(newResults);
          setPage(1);
        }
      }
    } catch (err) {
      console.error("AI Search Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { searchWithGemini("", false); }, []);

  return (
    <div className="p-4 md:p-10 space-y-8 text-right bg-black min-h-screen text-white pb-32" dir="rtl">
      
      {/* Header */}
      <header className="bg-cyan-600/10 p-8 rounded-[3.5rem] border border-cyan-500/20 flex justify-between items-center shadow-2xl">
        <div className="text-right">
          <h1 className="text-4xl font-black font-urdu text-cyan-400">جے اینڈ کے لائیو ڈائریکٹری</h1>
          <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-2 flex items-center justify-end gap-2">
             <Sparkles size={12} className="animate-pulse"/> Gemini Smart Search Active
          </p>
        </div>
        <MapPinned size={48} className="text-cyan-500" />
      </header>

      {/* Search Bar */}
      <div className="relative mx-2">
        <input 
          type="text"
          placeholder="کلگام، سرینگر یا جموں میں دکانیں تلاش کریں..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl text-xl font-urdu text-white outline-none focus:border-cyan-500/50 shadow-inner"
        />
        <button onClick={() => searchWithGemini(query, false)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-cyan-600 p-3 rounded-2xl hover:bg-cyan-500 transition-all">
          <Search size={24} />
        </button>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
        {dealers.map((dealer, i) => (
          <div key={i} className="bg-[#0a0a0a] p-8 rounded-[3rem] border border-white/5 hover:border-cyan-500/20 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-cyan-500/10 text-cyan-500 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{dealer.type || 'Verified'}</span>
              <Globe className="text-slate-800 group-hover:text-cyan-500" size={20} />
            </div>
            <h3 className="text-2xl font-black font-urdu text-white mb-2 leading-tight">{dealer.name}</h3>
            <p className="text-slate-400 font-urdu text-lg flex items-center justify-end gap-2 mb-8">
               {dealer.loc} <MapPin size={16} className="text-cyan-500" />
            </p>
            <a href={`tel:${dealer.phone}`} className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2">
              <Phone size={16} /> Contact Dealer
            </a>
          </div>
        ))}
      </div>

      {/* MAZEED SEARCH BUTTON (Load More) */}
      {dealers.length > 0 && (
        <div className="py-10 flex justify-center px-4">
          <button 
            onClick={() => searchWithGemini(query, true)}
            disabled={loading}
            className="w-full md:w-auto px-12 py-5 bg-white/5 border border-dashed border-cyan-500/30 rounded-[2.5rem] text-cyan-500 font-black font-urdu text-xl flex items-center justify-center gap-4 hover:bg-cyan-600/10 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>مزید تلاش کریں <PlusCircle size={24} /></>
            )}
          </button>
        </div>
      )}

    </div>
  );
}