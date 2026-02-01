import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, Share2, Image as ImageIcon, Send, User, MessageCircle, MoreVertical } from 'lucide-react';

export default function CommunityForum() { // Isay 'CommunityPage' se badal kar 'CommunityForum' kar dein
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const puter = (window as any).puter;

  // Fetching Community Posts
  const fetchPosts = async () => {
    const res = await puter.kv.get('fck_community_posts');
    if (res) setPosts(JSON.parse(res));
    else {
      // Sample Initial Posts for Kashmir
      setPosts([
        { id: 1, user: 'Gulzar Ahmad', location: 'Kulgam', text: 'Bhaiyo, is baar Scab ka hamla kam hai ya zyada?', likes: 12, comments: 4, time: '2h ago' },
        { id: 2, user: 'Shabir Dar', location: 'Sopore', text: 'Mandi mein Delicious ka rate aaj behtar hai.', likes: 25, comments: 8, time: '5h ago' }
      ]);
    }
  };

  const handlePost = async () => {
    if (!newPost) return;
    const post = {
      id: Date.now(),
      user: 'Me (Aap)', // User profile integration
      location: 'Kulgam', 
      text: newPost,
      likes: 0,
      comments: 0,
      time: 'Just now'
    };
    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    await puter.kv.set('fck_community_posts', JSON.stringify(updatedPosts));
    setNewPost('');
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div className="p-4 md:p-10 space-y-8 text-right bg-black min-h-screen text-white pb-32" dir="rtl">
      
      {/* Header */}
      <header className="bg-indigo-600/10 p-8 rounded-[3rem] border border-indigo-500/20 flex justify-between items-center shadow-2xl">
        <div className="text-right">
          <h1 className="text-4xl font-black font-urdu text-indigo-400">کسان برادری (Community)</h1>
          <p className="text-[10px] text-indigo-500/40 font-black uppercase tracking-widest mt-2 flex items-center justify-end gap-2 italic">
             <MessageCircle size={12}/> Connect with Farmers across J&K
          </p>
        </div>
        <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-xl">
           <MessageSquare size={40} />
        </div>
      </header>

      {/* Create Post Box */}
      <div className="bg-[#0a0a0a] p-8 rounded-[3.5rem] border border-white/10 shadow-inner">
         <div className="flex gap-4 mb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0"><User size={24}/></div>
            <textarea 
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="آج آپ کے باغ میں کیا ہو رہا ہے؟"
              className="w-full bg-transparent border-none text-xl font-urdu text-white outline-none resize-none"
              rows={2}
            />
         </div>
         <div className="flex justify-between items-center border-t border-white/5 pt-6">
            <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-all font-urdu">
               <ImageIcon size={20}/> تصویر شامل کریں
            </button>
            <button 
              onClick={handlePost}
              className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg"
            >
               پوسٹ کریں <Send size={16}/>
            </button>
         </div>
      </div>

      {/* Community Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-[#0a0a0a] p-8 rounded-[3.5rem] border border-white/5 hover:border-indigo-500/20 transition-all shadow-xl">
            <div className="flex justify-between items-start mb-6">
               <button className="text-slate-700"><MoreVertical size={20}/></button>
               <div className="flex items-center gap-4">
                  <div className="text-right">
                     <h4 className="font-black font-urdu text-xl text-white">{post.user}</h4>
                     <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">{post.location} • {post.time}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-indigo-400">
                     <User size={24}/>
                  </div>
               </div>
            </div>

            <p className="text-2xl font-urdu text-slate-200 leading-relaxed mb-8 pr-2">
               {post.text}
            </p>

            <div className="flex items-center gap-8 border-t border-white/5 pt-6 pr-2">
               <button className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-all group">
                  <Heart size={20} className="group-hover:fill-rose-500"/> <span className="text-sm font-black">{post.likes}</span>
               </button>
               <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-all">
                  <MessageCircle size={20}/> <span className="text-sm font-black">{post.comments}</span>
               </button>
               <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-all">
                  <Share2 size={20}/>
               </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}