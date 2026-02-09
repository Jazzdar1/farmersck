import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Users, MessageSquare, Heart, Share2, 
  Image as ImageIcon, Send, Search, Globe, MoreHorizontal 
} from 'lucide-react';

export default function CommunityForum() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'ur' | 'en'>('ur');
  const [newPost, setNewPost] = useState('');
  
  // Mock Posts
  const [posts, setPosts] = useState([
    { id: 1, user: "Gulzar Ahmad", role: "Orchardist", time: "2h ago", content: "Is saal scab ki bimari bohot zyada hai. Koi acchi fungicide suggest karein?", contentEn: "Scab disease is very severe this year. Can anyone suggest a good fungicide?", likes: 12, comments: 4 },
    { id: 2, user: "Tariq Bhat", role: "Expert", time: "5h ago", content: "Barish ke foran baad urea ka istemal na karein.", contentEn: "Do not apply urea immediately after rain.", likes: 45, comments: 10 }
  ]);

  const content = {
    ur: {
      title: "کسان فورم",
      subtitle: "کمیونٹی",
      createPlaceholder: "یہاں کچھ لکھیں یا سوال پوچھیں...",
      postBtn: "پوسٹ کریں",
      searchPlaceholder: "تلاش کریں...",
      filters: ["تازہ ترین", "مشہور", "میرے سوالات"],
      like: "پسند",
      comment: "تبصرہ",
      share: "شیئر"
    },
    en: {
      title: "Community Forum",
      subtitle: "Community",
      createPlaceholder: "Write something or ask a question...",
      postBtn: "Post",
      searchPlaceholder: "Search topics...",
      filters: ["Recent", "Trending", "My Posts"],
      like: "Like",
      comment: "Comment",
      share: "Share"
    }
  };

  const t = content[language];

  const handlePost = () => {
    if(!newPost) return;
    const post = {
      id: Date.now(),
      user: "You",
      role: "Farmer",
      time: "Just now",
      content: newPost,
      contentEn: newPost,
      likes: 0,
      comments: 0
    };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  return (
    <div className="min-h-screen bg-[#020408] text-white p-6 pb-24 font-sans transition-all duration-300" dir={language === 'ur' ? 'rtl' : 'ltr'}>
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                <ArrowLeft size={20} className={language === 'ur' ? '' : 'rotate-180'} />
            </button>
            <div>
                <h1 className={`text-2xl font-black italic ${language === 'ur' ? 'font-urdu' : ''}`}>{t.title}</h1>
                <p className="text-pink-500 text-xs font-bold uppercase tracking-widest">{t.subtitle}</p>
            </div>
        </div>
        
        {/* Language Toggle */}
        <button 
           onClick={() => setLanguage(language === 'ur' ? 'en' : 'ur')}
           className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all"
        >
             <Globe size={16} className="text-pink-400" />
             <span className="text-xs font-bold uppercase">{language === 'ur' ? 'English' : 'اردو'}</span>
        </button>
      </div>

      {/* CREATE POST INPUT */}
      <div className="bg-[#0a0c10] p-6 rounded-[2.5rem] border border-white/5 mb-8 shadow-xl">
          <div className="flex gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-pink-500/20">U</div>
              <textarea 
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder={t.createPlaceholder}
                className={`flex-1 bg-transparent border-none outline-none text-lg resize-none placeholder-white/30 h-20 ${language === 'ur' ? 'font-urdu' : ''}`}
              />
          </div>
          <div className="flex justify-between items-center border-t border-white/5 pt-4">
              <button className="text-white/40 hover:text-white transition-colors flex items-center gap-2 p-2 rounded-xl hover:bg-white/5">
                  <ImageIcon size={20} /> <span className="text-xs font-bold uppercase hidden md:inline">Photo</span>
              </button>
              <button 
                onClick={handlePost}
                disabled={!newPost}
                className="bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center gap-2 shadow-lg shadow-pink-900/40 transition-all active:scale-95"
              >
                  {t.postBtn} <Send size={16} className={language === 'ur' ? 'rotate-180' : ''} />
              </button>
          </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 sticky top-4 z-10">
          <div className={`flex-1 relative ${language === 'ur' ? 'md:order-2' : ''}`}>
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                className={`w-full bg-[#1a1d24]/80 backdrop-blur-md border border-white/10 rounded-2xl py-4 px-12 text-white focus:border-pink-500 outline-none ${language === 'ur' ? 'font-urdu' : ''}`}
              />
              <Search className={`absolute top-1/2 -translate-y-1/2 text-white/30 ${language === 'ur' ? 'right-4' : 'left-4'}`} size={20} />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {t.filters.map((filter, i) => (
                  <button key={i} className={`px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${i === 0 ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/40' : 'bg-[#1a1d24] text-white/40 hover:bg-white/10'}`}>
                      {filter}
                  </button>
              ))}
          </div>
      </div>

      {/* POSTS FEED */}
      <div className="space-y-6">
          {posts.map(post => (
              <div key={post.id} className="bg-[#0a0c10] p-6 rounded-[2.5rem] border border-white/5 hover:border-pink-500/20 transition-all group animate-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3">
                          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold text-white/50">{post.user[0]}</div>
                          <div>
                              <h3 className="font-bold text-white leading-tight">{post.user}</h3>
                              <p className="text-white/30 text-[10px] uppercase font-bold tracking-wider">{post.role} • {post.time}</p>
                          </div>
                      </div>
                      <button className="text-white/20 hover:text-white"><MoreHorizontal size={20} /></button>
                  </div>
                  
                  <p className={`text-white/90 text-lg leading-relaxed mb-6 ${language === 'ur' ? 'font-urdu' : ''}`}>
                      {language === 'ur' ? (post as any).content : (post as any).contentEn || post.content}
                  </p>

                  <div className="flex items-center gap-2 border-t border-white/5 pt-4">
                      <ActionButton icon={Heart} label={t.like} count={post.likes} />
                      <ActionButton icon={MessageSquare} label={t.comment} count={post.comments} />
                      <div className="flex-1"></div>
                      <ActionButton icon={Share2} label={t.share} />
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, count }: any) {
    return (
        <button className="flex items-center gap-2 py-2 px-4 rounded-xl hover:bg-white/5 text-white/40 hover:text-pink-400 transition-all group">
            <Icon size={18} className="group-hover:scale-110 transition-transform" />
            {count !== undefined && <span className="font-bold text-sm">{count}</span>}
            <span className="text-[10px] font-bold uppercase hidden md:inline">{label}</span>
        </button>
    );
}