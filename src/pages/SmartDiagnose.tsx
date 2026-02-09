import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Zap, RefreshCw, Loader2, Leaf, AlertTriangle, 
  Image as ImageIcon, X, Dog, User, Ban, Volume2, Share2, 
  Send, Languages, ScanLine, Camera, Thermometer, Info 
} from 'lucide-react';

export default function SmartDiagnose() {
  const navigate = useNavigate();
  
  // REFS
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // STATE
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [torch, setTorch] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<'en' | 'ur'>('ur');
  
  // CHAT
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [userQuery, setUserQuery] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // COLORS & THEME (Weather Style)
  const getTheme = (cat: string) => {
    switch(cat) {
        case 'Plant': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-500', icon: <Leaf /> };
        case 'Animal': return { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-500', icon: <Dog /> };
        case 'Human': return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-500', icon: <User /> };
        default: return { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-500', icon: <Ban /> };
    }
  };

  // CAMERA LOGIC
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const startCamera = async () => {
    stopCamera();
    setError(null);
    setResult(null);
    setImage(null);
    setChatHistory([]);

    try {
      const constraints = { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.setAttribute('playsinline', 'true'); 
        videoRef.current.play();
      }
    } catch (err) { setError("Camera Access Required"); }
  };

  useEffect(() => { startCamera(); return () => stopCamera(); }, []);

  const toggleTorch = () => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      const newStatus = !torch;
      track.applyConstraints({ advanced: [{ torch: newStatus }] } as any).catch(e => console.log(e));
      setTorch(newStatus);
    }
  };

  const handleCapture = (source: 'camera' | 'upload', event?: any) => {
    if (source === 'camera') {
      if (!videoRef.current || !canvasRef.current) return;
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0);
          const imgData = canvasRef.current.toDataURL('image/jpeg', 0.8);
          setImage(imgData);
          stopCamera();
          analyzeImage(imgData);
      }
    } else if (source === 'upload' && event.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
         if(e.target?.result) {
             setImage(e.target.result as string);
             stopCamera();
             analyzeImage(e.target.result as string);
         }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const analyzeImage = async (base64Image: string) => {
    setAnalyzing(true);
    setError(null);
    try {
      const puter = (window as any).puter;
      const prompt = `
        Role: Agronomist. Identify object and Diagnose if Plant/Animal.
        Output JSON: {
          "category": "Plant"|"Animal"|"Human"|"Other",
          "name": {"en": "Name", "ur": "نام"},
          "diagnosis": {"en": "Condition", "ur": "تشخیص"},
          "cure": {"en": "Remedy", "ur": "علاج"},
          "is_farming": true/false
        }
      `;
      const response = await puter.ai.chat(prompt, base64Image);
      const text = response?.message?.content || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
          const data = JSON.parse(jsonMatch[0]);
          setResult(data);
          speak(lang === 'ur' ? data.name.ur : data.name.en);
      } else { throw new Error("Error"); }
    } catch (err) { setError("Analysis Failed"); } 
    finally { setAnalyzing(false); }
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'ur' ? 'ur-PK' : 'en-US';
    window.speechSynthesis.speak(u);
  };

  const askBot = async () => {
    if (!userQuery.trim()) return;
    const q = userQuery;
    setChatHistory(p => [...p, {role: 'user', text: q}]);
    setUserQuery('');
    setChatLoading(true);
    try {
      const puter = (window as any).puter;
      const prompt = `Context: ${JSON.stringify(result)}. User: "${q}". Answer in ${lang==='ur'?'Urdu':'English'} (Short).`;
      const res = await puter.ai.chat(prompt);
      setChatHistory(p => [...p, {role: 'bot', text: res?.message?.content || "Error"}]);
      chatEndRef.current?.scrollIntoView({behavior: 'smooth'});
    } catch(e) {}
    setChatLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020408] text-white p-6 font-sans">
      
      {/* 1. STANDARD PAGE HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10"><ArrowLeft /></button>
            <div>
                <h1 className="text-2xl font-black italic">Smart Scan</h1>
                <p className="text-emerald-500 text-xs font-bold font-urdu">مصنوعی ذہانت</p>
            </div>
        </div>
        <button 
          onClick={() => setLang(l => l === 'en' ? 'ur' : 'en')}
          className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-xs font-bold uppercase hover:bg-white/10"
        >
            {lang === 'en' ? 'ENG' : 'اردو'}
        </button>
      </div>

      {/* 2. MAIN CAMERA CARD (Like a Weather Widget) */}
      <div className="relative w-full aspect-[4/3] bg-[#0a0c10] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl mb-6 group">
          
          {/* Video Feed */}
          {!image ? (
             <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          ) : (
             <img src={image} className="w-full h-full object-contain bg-black" />
          )}

          {/* Overlay UI (Torch & Loader) */}
          <div className="absolute top-4 right-4 z-10">
              <button onClick={toggleTorch} className={`p-3 rounded-full backdrop-blur-md transition-all ${torch ? 'bg-yellow-400 text-black' : 'bg-black/30 text-white'}`}>
                  <Zap size={20} fill={torch?"currentColor":"none"}/>
              </button>
          </div>

          {analyzing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                  <Loader2 size={50} className="text-emerald-500 animate-spin mb-4" />
                  <p className="text-emerald-500 font-bold uppercase tracking-widest animate-pulse">Scanning...</p>
              </div>
          )}

          {/* Guide Overlay */}
          {!image && !analyzing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                  <ScanLine size={150} className="text-white/20" />
              </div>
          )}
      </div>

      {/* 3. ACTION BUTTONS ROW */}
      {!result && !analyzing && (
          <div className="flex gap-4 mb-8">
              <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-white/5 border border-white/10 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-white/10">
                  <ImageIcon size={20} className="text-blue-400"/> {lang==='ur'?'گیلری':'Upload'}
              </button>
              <button onClick={() => handleCapture('camera')} className="flex-[2] bg-emerald-600 py-4 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest shadow-lg shadow-emerald-900/40 hover:bg-emerald-500">
                  <Camera size={20}/> {lang==='ur'?'اسکین کریں':'Scan Now'}
              </button>
          </div>
      )}

      {/* 4. DIAGNOSIS REPORT CARD (Only if Result) */}
      {result && (
          <div className="animate-in slide-in-from-bottom duration-500 pb-20">
              
              {/* Category Header */}
              <div className={`p-6 rounded-[2rem] border mb-4 relative overflow-hidden ${getTheme(result.category).bg} ${getTheme(result.category).border}`}>
                  <div className="flex justify-between items-start relative z-10">
                      <div>
                           <div className={`p-3 rounded-xl inline-block mb-3 bg-black/20 text-white`}>
                               {getTheme(result.category).icon}
                           </div>
                           <h2 className={`text-3xl font-black text-white leading-none mb-1 ${lang==='ur'?'font-urdu':''}`}>{result.name[lang]}</h2>
                           <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{result.category} Detected</p>
                      </div>
                      <button onClick={() => {setResult(null); startCamera();}} className="p-2 bg-black/20 rounded-full hover:bg-black/30 text-white">
                          <RefreshCw size={18}/>
                      </button>
                  </div>
              </div>

              {/* Status Section */}
              {!result.is_farming ? (
                  <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] text-center mb-4">
                      <Ban className="mx-auto text-rose-500 mb-2" size={30}/>
                      <p className={`text-rose-400 font-bold ${lang==='ur'?'font-urdu':''}`}>{lang==='ur'?'یہ زرعی چیز نہیں ہے':'Not a farming object'}</p>
                  </div>
              ) : (
                  <div className="space-y-4">
                      {/* Diagnosis */}
                      <div className="bg-[#0a0c10] p-5 rounded-[2rem] border border-white/5">
                          <h3 className="text-xs font-bold text-white/40 uppercase mb-2 flex items-center gap-2"><ScanLine size={14}/> {lang==='ur'?'تشخیص':'Diagnosis'}</h3>
                          <p className={`text-lg text-white font-medium ${lang==='ur'?'font-urdu':''}`}>{result.diagnosis[lang]}</p>
                      </div>

                      {/* Cure */}
                      <div className="bg-[#0a0c10] p-5 rounded-[2rem] border border-white/5">
                          <h3 className="text-xs font-bold text-emerald-500 uppercase mb-2 flex items-center gap-2"><Thermometer size={14}/> {lang==='ur'?'علاج':'Treatment'}</h3>
                          <p className={`text-white/80 leading-relaxed ${lang==='ur'?'font-urdu':''}`}>{result.cure[lang]}</p>
                          
                          <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                              <button onClick={() => speak(result.cure[lang])} className="flex-1 bg-white/5 py-3 rounded-xl text-xs font-bold hover:bg-white/10 flex items-center justify-center gap-2">
                                  <Volume2 size={14}/> {lang==='ur'?'سنیں':'Listen'}
                              </button>
                              <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(result.name[lang] + ": " + result.diagnosis[lang])}`, '_blank')} className="flex-1 bg-emerald-500/10 text-emerald-500 py-3 rounded-xl text-xs font-bold hover:bg-emerald-500/20 flex items-center justify-center gap-2">
                                  <Share2 size={14}/> {lang==='ur'?'شیئر':'Share'}
                              </button>
                          </div>
                      </div>

                      {/* AI Chat */}
                      <div className="bg-[#0a0c10] p-5 rounded-[2rem] border border-white/5">
                          <h3 className="text-xs font-bold text-blue-400 uppercase mb-3 flex items-center gap-2"><Info size={14}/> {lang==='ur'?'ماہر سے پوچھیں':'Ask Expert'}</h3>
                          
                          <div className="bg-black/40 rounded-2xl p-4 h-32 overflow-y-auto mb-3 space-y-2">
                              {chatHistory.length === 0 && <p className="text-center text-white/20 text-xs italic">Ask about medicine, dosage etc.</p>}
                              {chatHistory.map((m, i) => (
                                  <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                                      <span className={`px-3 py-2 rounded-xl text-xs max-w-[85%] ${m.role==='user'?'bg-blue-600 text-white':'bg-white/10 text-white'}`}>{m.text}</span>
                                  </div>
                              ))}
                              {chatLoading && <Loader2 size={14} className="animate-spin text-white/30 mx-auto"/>}
                              <div ref={chatEndRef}/>
                          </div>

                          <div className="flex gap-2">
                              <input 
                                value={userQuery} 
                                onChange={e => setUserQuery(e.target.value)}
                                placeholder={lang==='ur'?'سوال لکھیں...':'Ask question...'}
                                className={`flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none ${lang==='ur'?'text-right':''}`}
                              />
                              <button onClick={askBot} className="bg-blue-600 text-white p-3 rounded-xl"><Send size={18}/></button>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      )}

      {/* ERROR MSG */}
      {error && (
          <div className="fixed bottom-10 left-6 right-6 bg-rose-600 text-white p-4 rounded-2xl flex items-center gap-3 shadow-2xl z-50">
              <AlertTriangle size={20}/>
              <p className="text-sm font-bold">{error}</p>
              <button onClick={() => {setError(null); startCamera();}} className="ml-auto bg-black/20 p-2 rounded-full"><RefreshCw size={14}/></button>
          </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
      <input type="file" ref={fileInputRef} onChange={(e) => handleCapture('upload', e)} className="hidden" accept="image/*" />
    </div>
  );
}