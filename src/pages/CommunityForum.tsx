import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, ThumbsUp, Image as ImageIcon, Search, 
  Send, Share2, MessageSquare, Flag, Camera, X, Filter 
} from 'lucide-react';

interface Post {
  id: number;
  user: string;
  role: 'Farmer' | 'Expert' | 'Admin';
  content: string;
  image?: string; // Optional Image
  likes: number;
  comments: number;
  time: string;
  category: string;
  isLiked?: boolean;
}

export default function CommunityForum() {
  // Initial Mock Data (Agar local storage khali ho)
  const initialPosts: Post[] = [
    {
      id: 1,
      user: "Gulzar Ahmed",
      role: "Farmer",
      content: "Mere Shopian wale baagh mein scab ki problem aa rahi hai. Kya koi naya fungicide aaya hai?",
      likes: 12,
      comments: 5,
      time: "2 hours ago",
      category: "Disease",
      isLiked: false
    },
    {
      id: 2,
      user: "Dr. Rafiq (SKUAST)",
      role: "Expert",
      content: "⚠️ Weather Alert: Agle 3 din baarish hone ka imkan hai. Kisaan hazraat spray rok dein.",
      likes: 45,
      comments: 12,
      time: "5 hours ago",
      category: "Advisory",
      isLiked: false
    }
  ];

  // State Management
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('fc_forum_posts');
    return saved ? JSON.parse(saved) : initialPosts;
  });
  
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save to LocalStorage whenever posts change
  useEffect(() => {
    localStorage.setItem('fc_forum_posts', JSON.stringify(posts));
  }, [posts]);

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ POST FUNCTION (Jo pehle nahi chal raha tha)
  const handlePost = () => {
    if (!newPostContent.trim() && !selectedImage) return;

    const newPost: Post = {
      id: Date.now(),
      user: "You (Farmer)", // In future, get from Auth
      role: "Farmer",
      content: newPostContent,
      image: selectedImage || undefined,
      likes: 0,
      comments: 0,
      time: "Just now",
      category: selectedCategory,
      isLiked: false
    };

    // Add new post to top of list
    setPosts([newPost, ...posts]);
    
    // Reset Form
    setNewPostContent("");
    setSelectedImage(null);
    setSelectedCategory("General");
  };

  // Like Function
  const toggleLike = (id: number) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  // Filter Logic
  const filteredPosts = filter === "All" ? posts : posts.filter(p => p.category === filter);

  const categories = ["General", "Disease", "Market", "Advisory", "Seeds"];

  return (
    <div className="min-h-screen bg-[#020408] text-white p-4 md:p-6 pb-24 font-sans" dir="rtl">
      
      {/* Header */}
      <div className="bg-[#0a0c10] p-6 rounded-[2.5rem] border border-white/5 mb-6 shadow-2xl flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-black italic tracking-tighter text-white">Community Forum</h1>
           <p className="text-emerald-500 font-bold font-urdu text-xs">کسانوں کی اپنی آواز</p>
        </div>
        <div className="bg-emerald-500/10 p-3 rounded-full">
           <MessageCircle className="text-emerald-500" size={24} />
        </div>
      </div>

      {/* 📝 CREATE POST SECTION (Upgraded) */}
      <div className="bg-[#0a0c10] p-5 rounded-[2rem] border border-white/5 mb-8 shadow-xl animate-in slide-in-from-top-4">
        
        {/* Category Selector */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
                selectedCategory === cat 
                ? 'bg-emerald-600 text-white border-emerald-500' 
                : 'bg-[#020408] text-white/40 border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Text Area */}
        <textarea 
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Apna sawal yahan likhein... (e.g. Scab ki dawa?)" 
          className="w-full bg-[#020408] border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500 transition-all font-urdu min-h-[100px] mb-4 text-right"
        />

        {/* Image Preview */}
        {selectedImage && (
          <div className="relative mb-4 w-fit">
            <img src={selectedImage} alt="Preview" className="h-24 w-24 object-cover rounded-xl border border-white/10" />
            <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full shadow-lg">
              <X size={12} />
            </button>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex justify-between items-center border-t border-white/5 pt-4">
           <div className="flex gap-4">
              <button onClick={() => fileInputRef.current?.click()} className="text-emerald-500 flex items-center gap-2 text-xs font-bold hover:bg-emerald-500/10 px-3 py-2 rounded-xl transition-all">
                 <Camera size={18} /> <span className="hidden md:inline">Add Photo</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
           </div>

           <button 
             onClick={handlePost}
             disabled={!newPostContent && !selectedImage}
             className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all"
           >
             Post Now <Send size={16} />
           </button>
        </div>
      </div>

      {/* 🔍 FILTERS */}
      <div className="flex items-center justify-between mb-4 px-2">
         <h3 className="text-white font-bold text-sm">Recent Discussions</h3>
         <div className="flex gap-2">
            <button onClick={() => setFilter("All")} className={`text-[10px] font-bold px-3 py-1 rounded-lg ${filter === 'All' ? 'bg-white text-black' : 'text-white/40'}`}>All</button>
            <button onClick={() => setFilter("Disease")} className={`text-[10px] font-bold px-3 py-1 rounded-lg ${filter === 'Disease' ? 'bg-white text-black' : 'text-white/40'}`}>Disease</button>
         </div>
      </div>

      {/* 📰 POSTS FEED */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-[#0a0c10] p-5 rounded-[2rem] border border-white/5 hover:border-emerald-500/20 transition-all group animate-in slide-in-from-bottom-2">
             
             {/* Header */}
             <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ${post.role === 'Expert' ? 'bg-purple-600 text-white' : 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white'}`}>
                      {post.user.charAt(0)}
                   </div>
                   <div className="text-right">
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                         {post.user} 
                         {post.role === 'Expert' && <span className="bg-purple-500 text-white text-[8px] px-2 py-0.5 rounded-md uppercase font-black tracking-wider">Expert</span>}
                      </h3>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider">{post.time} • {post.category}</p>
                   </div>
                </div>
                <button className="text-white/20 hover:text-white transition-colors"><Flag size={14} /></button>
             </div>

             {/* Content */}
             <p className="text-white/90 text-sm leading-relaxed font-urdu mb-3 pr-2">
                {post.content}
             </p>

             {/* Post Image */}
             {post.image && (
                <div className="mb-4 rounded-xl overflow-hidden border border-white/10">
                   <img src={post.image} alt="Post Attachment" className="w-full h-48 object-cover" />
                </div>
             )}

             {/* Interaction Bar */}
             <div className="flex items-center gap-4 border-t border-white/5 pt-3 mt-2">
                <button 
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-2 text-xs font-bold transition-all px-3 py-1.5 rounded-lg ${post.isLiked ? 'text-rose-500 bg-rose-500/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                >
                   <ThumbsUp size={16} className={post.isLiked ? "fill-current" : ""} /> {post.likes}
                </button>
                <button className="flex items-center gap-2 text-white/40 hover:text-blue-500 transition-colors text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-500/10">
                   <MessageSquare size={16} /> {post.comments} Reply
                </button>
                <button className="flex items-center gap-2 text-white/40 hover:text-green-500 transition-colors text-xs font-bold ml-auto">
                   <Share2 size={16} />
                </button>
             </div>

          </div>
        ))}

        {filteredPosts.length === 0 && (
           <div className="text-center py-10 opacity-30">
              <Filter size={40} className="mx-auto mb-2" />
              <p className="text-sm">No posts found in this category</p>
           </div>
        )}
      </div>

    </div>
  );
}