import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Youtube, Facebook, Bell, Play, ExternalLink, 
  Loader2, Clock, ThumbsUp, X, Heart
} from 'lucide-react';

// ✅ SETTINGS
const YOUTUBE_CHANNEL_ID = "UCDPruUY9G7IJce7kHfQMYPQ"; // Farmer's Corner Tech
const FACEBOOK_PAGE_URL = "https://www.facebook.com/towseefbashir164"; // Towseef Bashir FB

export default function SocialMedia() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'youtube' | 'facebook'>('youtube');
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newVideoAlert, setNewVideoAlert] = useState(false);
  
  // 🎥 PLAYER & POPUP STATE
  const [playingVideo, setPlayingVideo] = useState<any | null>(null);
  const [showSubscribePopup, setShowSubscribePopup] = useState(false);

  // --- 1. POPUP TIMER (Isolated) ---
  useEffect(() => {
    const timer = setTimeout(() => {
        setShowSubscribePopup(true); // 1.5 sec baad pakka aayega
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // --- 2. AUTO-FETCH YOUTUBE VIDEOS ---
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
        const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;
        
        const res = await fetch(API_URL);
        const data = await res.json();

        if (data.items) {
          const cleanVideos = data.items.map((v: any) => ({
              ...v,
              videoId: v.guid.split(':')[2]
          }));
          setVideos(cleanVideos);
          checkForNewUploads(cleanVideos[0]);
        }
      } catch (err) {
        console.error("YouTube Error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // --- 3. NOTIFICATION LOGIC ---
  const checkForNewUploads = (latestVideo: any) => {
      const lastSeen = localStorage.getItem('last_seen_video');
      if (lastSeen !== latestVideo.guid) {
          setNewVideoAlert(true);
      }
  };

  // --- 4. ACTIONS ---
  const handleYoutubeSubscribe = () => {
      window.open(`https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}?sub_confirmation=1`, '_blank');
  };

  const handleFacebookFollow = () => {
      window.open(FACEBOOK_PAGE_URL, '_blank');
  };

  const openPlayer = (video: any) => {
      setPlayingVideo(video);
      localStorage.setItem('last_seen_video', video.guid);
      setNewVideoAlert(false);
  };

  const closePlayer = () => setPlayingVideo(null);

  return (
    <div className="min-h-screen bg-[#020408] text-white font-sans pb-20 relative flex flex-col">
      
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-[#0a0c10]/95 backdrop-blur-md p-4 border-b border-white/5 flex justify-between items-center shadow-xl shrink-0">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><ArrowLeft size={20}/></button>
            <div>
                <h1 className="text-xl font-black italic">Social Hub</h1>
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Farmer's Corner Tech</p>
            </div>
        </div>
        
        <div className="relative">
            <Bell size={24} className={newVideoAlert ? "text-yellow-400 animate-swing" : "text-white/40"} />
            {newVideoAlert && <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full animate-ping"></span>}
        </div>
      </div>

      {/* TABS */}
      <div className="p-4 sticky top-16 z-30 bg-[#020408]/90 backdrop-blur shrink-0">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
              <button 
                onClick={() => setActiveTab('youtube')} 
                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold uppercase text-xs tracking-widest transition-all ${activeTab==='youtube' ? 'bg-[#FF0000] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                  <Youtube size={18}/> YouTube
              </button>
              <button 
                onClick={() => setActiveTab('facebook')} 
                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold uppercase text-xs tracking-widest transition-all ${activeTab==='facebook' ? 'bg-[#1877F2] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                  <Facebook size={18}/> Facebook
              </button>
          </div>
      </div>

      {/* --- YOUTUBE SECTION --- */}
      {activeTab === 'youtube' && (
          <div className="px-4 space-y-5 animate-in fade-in slide-in-from-bottom-4 flex-1">
              
              {/* 🔴 SUBSCRIBE BUTTON CARD */}
              <div className="bg-[#1a1a1a] p-5 rounded-[2rem] border border-white/10 flex items-center justify-between shadow-lg relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF0000]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center gap-4 relative z-10">
                      <div className="bg-[#FF0000] p-3 rounded-full text-white shadow-lg shadow-red-900/50 animate-pulse"><Heart size={24} fill="white"/></div>
                      <div>
                          <h3 className="font-bold text-white text-lg">Support Channel</h3>
                          <p className="text-xs text-white/50">Get latest farming tips</p>
                      </div>
                  </div>
                  <button onClick={handleYoutubeSubscribe} className="relative z-10 bg-white text-[#FF0000] px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                      Subscribe
                  </button>
              </div>

              {loading ? (
                  <div className="flex flex-col items-center py-20">
                      <Loader2 size={40} className="text-[#FF0000] animate-spin mb-4"/>
                      <p className="text-white/30 text-xs uppercase tracking-widest">Loading Videos...</p>
                  </div>
              ) : (
                  videos.map((video, idx) => (
                      <div key={idx} onClick={() => openPlayer(video)} className="group bg-[#0a0c10] border border-white/5 rounded-[1.5rem] overflow-hidden cursor-pointer hover:border-[#FF0000]/50 transition-all shadow-lg relative">
                          <div className="relative aspect-video w-full overflow-hidden">
                              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                  <div className="w-16 h-16 bg-[#FF0000]/90 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,0,0,0.5)] group-hover:scale-110 transition-transform">
                                      <Play size={28} fill="white" className="ml-1 text-white"/>
                                  </div>
                              </div>
                              {idx === 0 && <span className="absolute top-3 left-3 bg-[#FF0000] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg animate-pulse">New Upload</span>}
                          </div>
                          
                          <div className="p-5">
                              <h3 className="text-white font-bold leading-snug mb-3 line-clamp-2 text-lg group-hover:text-[#FF0000] transition-colors">{video.title}</h3>
                              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                                  <span className="flex items-center gap-1.5 text-white/40 text-xs font-medium"><Clock size={14}/> {new Date(video.pubDate).toLocaleDateString()}</span>
                                  <span className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold"><ThumbsUp size={14}/> Play Video</span>
                              </div>
                          </div>
                      </div>
                  ))
              )}
          </div>
      )}

      {/* --- FACEBOOK SECTION (SCROLLABLE) --- */}
      {activeTab === 'facebook' && (
          <div className="px-4 flex flex-col items-center animate-in fade-in pb-20 w-full">
              
              {/* 🔵 FACEBOOK FOLLOW CARD */}
              <div className="w-full max-w-[500px] mb-6 bg-[#1877F2]/10 p-5 rounded-[2rem] border border-[#1877F2]/30 flex items-center justify-between hover:bg-[#1877F2]/20 transition-all shadow-lg group shrink-0">
                  <div className="flex items-center gap-4">
                      <div className="bg-[#1877F2] p-3 rounded-full text-white shadow-lg shadow-blue-900/50"><Facebook size={24}/></div>
                      <div>
                          <h3 className="font-bold text-blue-100 text-lg">Towseef Bashir</h3>
                          <p className="text-xs text-blue-200/50">Follow on Facebook</p>
                      </div>
                  </div>
                  <button onClick={handleFacebookFollow} className="bg-[#1877F2] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                      Follow
                  </button>
              </div>

              {/* Feed Iframe (Full Height) */}
              <div className="w-full max-w-[500px] bg-white rounded-[1.5rem] overflow-hidden border-4 border-[#1877F2] shadow-2xl h-[1000px]">
                  <iframe 
                    src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(FACEBOOK_PAGE_URL)}&tabs=timeline&width=500&height=1000&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId`}
                    width="100%" 
                    height="100%" 
                    style={{border: 'none', overflow: 'hidden'}} 
                    scrolling="yes" 
                    frameBorder="0" 
                    allowFullScreen={true} 
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  ></iframe>
              </div>
              <p className="mt-4 text-white/30 text-xs uppercase tracking-widest pb-10">Scroll to see more posts</p>
          </div>
      )}

      {/* 🎬 IN-APP VIDEO PLAYER MODAL */}
      {playingVideo && (
          <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div className="w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative flex flex-col">
                  <button onClick={closePlayer} className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full text-white hover:bg-white/20 transition-all">
                      <X size={24} />
                  </button>
                  <div className="relative aspect-video w-full bg-black">
                      <iframe 
                        src={`https://www.youtube.com/embed/${playingVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full border-0"
                      ></iframe>
                  </div>
                  <div className="p-6 bg-[#121212]">
                      <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">{playingVideo.title}</h2>
                      <div className="flex gap-4 mt-4">
                          <button onClick={handleYoutubeSubscribe} className="flex-1 bg-[#FF0000] hover:bg-red-700 text-white py-3 rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-2">
                             <Youtube size={18}/> Subscribe
                          </button>
                          <button onClick={() => window.open(playingVideo.link, '_blank')} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                             <ExternalLink size={18}/> Open in App
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* 🔔 STAY UPDATED POPUP (Forced Z-Index 100) */}
      {showSubscribePopup && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-4 animate-in fade-in duration-500">
              <div className="bg-[#1a1d24] w-full max-w-sm rounded-[2.5rem] p-6 border border-white/10 shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom">
                  {/* Decorative Background */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>

                  <div className="relative z-10 text-center">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                          <Bell size={32} className="text-yellow-400 animate-swing"/>
                      </div>
                      <h2 className="text-2xl font-black text-white mb-2 leading-none">Stay Updated!</h2>
                      <p className="text-white/50 text-xs mb-6 px-4">Subscribe to our channels to get the latest farming news & tips first.</p>
                      
                      <div className="space-y-3">
                          <button onClick={handleYoutubeSubscribe} className="w-full bg-[#FF0000] hover:bg-red-700 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]">
                              <Youtube size={20}/> Subscribe YouTube
                          </button>
                          <button onClick={handleFacebookFollow} className="w-full bg-[#1877F2] hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]">
                              <Facebook size={20}/> Follow Facebook
                          </button>
                      </div>

                      <button onClick={() => setShowSubscribePopup(false)} className="mt-6 text-white/30 text-[10px] uppercase font-bold tracking-widest hover:text-white">
                          Maybe Later
                      </button>
                  </div>
              </div>
          </div>
      )}

      <style>{`
        @keyframes swing { 0%,100%{transform:rotate(0deg)} 20%{transform:rotate(15deg)} 40%{transform:rotate(-10deg)} 60%{transform:rotate(5deg)} 80%{transform:rotate(-5deg)} }
        .animate-swing { animation: swing 1s ease-in-out infinite; }
      `}</style>

    </div>
  );
}