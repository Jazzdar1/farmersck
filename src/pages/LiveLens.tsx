import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Zap, RefreshCw, Loader2, ScanLine, 
  Leaf, AlertTriangle, CheckCircle2, Image as ImageIcon, X, 
  Thermometer, HelpCircle, Dog, User, Ban 
} from 'lucide-react';

export default function LiveLens() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [torch, setTorch] = useState(false);

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

    try {
      const constraints = { 
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.setAttribute('playsinline', 'true'); 
        videoRef.current.play();
      }
    } catch (err) {
      setError("Camera permission denied.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const toggleTorch = () => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      const newStatus = !torch;
      track.applyConstraints({ advanced: [{ torch: newStatus }] } as any).catch(e => console.log(e));
      setTorch(newStatus);
    }
  };

  // CAPTURE & UPLOAD
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imgData = canvasRef.current.toDataURL('image/jpeg', 0.9);
        setImage(imgData);
        stopCamera();
        analyzeImage(imgData);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgData = event.target?.result as string;
        setImage(imgData);
        stopCamera();
        analyzeImage(imgData);
      };
      reader.readAsDataURL(file);
    }
  };

  // 🧠 INTELLIGENT DETECTION ENGINE
  const analyzeImage = async (base64Image: string) => {
    setAnalyzing(true);
    setError(null);

    try {
      const puter = (window as any).puter;
      
      // 🔥 STRICT VISUAL ANALYSIS PROMPT
      const prompt = `
        You are a Vision AI. Look at the image strictly.
        Step 1: IDENTIFY what is in the image.
        
        CRITICAL RULES:
        - If it is a HUMAN (Person, Face, Hand), return category: "Human".
        - If it is an ANIMAL (Cat, Dog, Cow), return category: "Animal".
        - If it is a PLANT (Crop, Leaf, Fruit), return category: "Plant".
        - If it is an OBJECT (Car, Table, Building), return category: "Other".

        Step 2: DIAGNOSE ONLY IF IT IS A PLANT OR FARM ANIMAL.
        - Do NOT diagnose Humans, Cats, Dogs, or Cars. 
        - For Humans/Other, say "Not a farming subject".

        Return JSON ONLY:
        {
          "category": "Plant" | "Animal" | "Human" | "Other",
          "detected_name_ur": "Name in Urdu (e.g. انسان, سیب کا پتہ, بلی)",
          "detected_name_en": "Name in English",
          "diagnosis_ur": "Diagnosis in Urdu (or 'N/A' if not farm related)",
          "diagnosis_en": "Diagnosis in English",
          "cure_ur": "Remedy in Urdu (Only for sick Plant/Livestock)",
          "confidence": 95
        }
      `;

      const response = await puter.ai.chat(prompt, base64Image);
      const text = response?.message?.content || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
          const data = JSON.parse(jsonMatch[0]);
          setResult(data);
      } else {
          throw new Error("Invalid AI Response");
      }

    } catch (err) {
      setError("AI Analysis Failed. Internet check karein.");
    } finally {
      setAnalyzing(false);
    }
  };

  const resetScanner = () => {
    setResult(null);
    setImage(null);
    setError(null);
    startCamera();
  };

  // UI HELPERS
  const getIcon = (category: string) => {
      if (category === 'Human') return <User size={40} className="text-blue-400" />;
      if (category === 'Plant') return <Leaf size={40} className="text-emerald-500" />;
      if (category === 'Animal') return <Dog size={40} className="text-orange-500" />;
      return <Ban size={40} className="text-rose-500" />;
  };

  return (
    <div className="fixed inset-0 bg-black text-white font-sans flex flex-col z-50">
      
      {/* HEADER */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/90 to-transparent">
        <button onClick={() => navigate('/')} className="p-3 bg-white/10 backdrop-blur-md rounded-full"><ArrowLeft size={20} /></button>
        <div className="flex flex-col items-center">
            <span className="text-[#FFC107] font-black uppercase tracking-widest text-xs">LiveLens AI</span>
            <span className="text-[9px] text-emerald-400 font-bold">Smart Recognition</span>
        </div>
        <button onClick={toggleTorch} className={`p-3 rounded-full backdrop-blur-md transition-all ${torch ? 'bg-[#FFC107] text-black' : 'bg-white/10 text-white'}`}>
            <Zap size={20} fill={torch ? "currentColor" : "none"} />
        </button>
      </div>

      {/* VIEWFINDER */}
      <div className="relative flex-1 bg-gray-900 overflow-hidden flex items-center justify-center">
        {!image && <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />}
        {image && <img src={image} className="w-full h-full object-cover" />}

        {!image && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-72 border-2 border-white/30 rounded-3xl relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#FFC107]"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#FFC107]"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#FFC107]"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#FFC107]"></div>
                </div>
            </div>
        )}

        {analyzing && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                <Loader2 size={50} className="text-[#FFC107] animate-spin mb-4" />
                <p className="text-[#FFC107] font-black uppercase tracking-widest animate-pulse">Analyzing...</p>
                <p className="text-white/50 text-xs mt-1">Checking Object Type...</p>
            </div>
        )}
      </div>

      {/* CONTROLS */}
      {!result && !analyzing && (
        <div className="h-32 bg-[#050505] flex items-center justify-around pb-6 pt-4 border-t border-white/10">
            <button onClick={() => fileInputRef.current?.click()} className="p-4 bg-white/10 rounded-full hover:bg-white/20">
                <ImageIcon size={24} className="text-white/70" />
            </button>
            {image ? (
                <button onClick={resetScanner} className="w-20 h-20 rounded-full bg-white flex items-center justify-center animate-in zoom-in">
                    <RefreshCw size={30} className="text-black" />
                </button>
            ) : (
                <button onClick={captureImage} className="w-20 h-20 rounded-full border-[6px] border-white/20 flex items-center justify-center relative active:scale-95 transition-transform group">
                    <div className="w-16 h-16 bg-[#FFC107] rounded-full group-hover:scale-90 transition-all shadow-[0_0_30px_#FFC107]"></div>
                </button>
            )}
            <div className="w-14"></div>
        </div>
      )}

      {/* 🛑 RESULT CARD (Smart Logic) */}
      {result && (
        <div className="absolute bottom-0 w-full bg-[#121212] rounded-t-[2.5rem] p-6 border-t border-[#FFC107]/20 shadow-2xl z-40 animate-in slide-in-from-bottom duration-500 max-h-[75vh] overflow-y-auto">
           
           <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6"></div>
           
           {/* DETECTED OBJECT HEADER */}
           <div className="flex flex-col items-center mb-6">
              <div className="mb-4 animate-in zoom-in duration-500">
                  {getIcon(result.category)}
              </div>
              <h2 className="text-3xl font-black font-urdu text-white mb-1 text-center">{result.detected_name_ur}</h2>
              <p className="text-white/50 text-sm font-bold uppercase tracking-widest">{result.detected_name_en}</p>
           </div>

           {/* 🚫 NON-FARMING OBJECTS (Human, Car, Furniture) */}
           {(result.category === 'Human' || result.category === 'Other') && (
               <div className="bg-white/5 p-6 rounded-2xl border-l-4 border-rose-500 mb-6 text-center">
                   <p className="text-white/90 font-urdu text-lg font-bold mb-2">یہ زرعی چیز نہیں ہے۔</p>
                   <p className="text-white/50 text-sm">This is not a farming object. Please scan crops or livestock.</p>
               </div>
           )}

           {/* 🐈 PETS (Cat/Dog - Just Identify, Don't treat unless asked) */}
           {result.category === 'Animal' && (
               <div className="bg-white/5 p-6 rounded-2xl border-l-4 border-orange-500 mb-6 text-center">
                   <p className="text-white/90 font-urdu text-lg font-bold mb-2">جانور کی شناخت ہو گئی ہے۔</p>
                   {result.diagnosis_ur !== 'N/A' ? (
                       <p className="text-orange-400 font-bold mt-2">{result.diagnosis_ur}</p>
                   ) : (
                       <p className="text-white/50 text-sm">Animal Identified. Looks Healthy.</p>
                   )}
               </div>
           )}

           {/* 🌱 PLANTS (Full Diagnosis) */}
           {result.category === 'Plant' && (
               <div className="space-y-3 mb-6">
                   <div className="bg-white/5 p-4 rounded-2xl border-l-4 border-emerald-500">
                       <h4 className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-1 flex items-center gap-2"><ScanLine size={12}/> Condition</h4>
                       <p className="font-urdu text-xl font-black leading-relaxed text-white">{result.diagnosis_ur}</p>
                       <p className="text-white/50 text-sm">{result.diagnosis_en}</p>
                   </div>
                   
                   {result.cure_ur && result.cure_ur !== 'N/A' && (
                       <div className="bg-white/5 p-4 rounded-2xl border-l-4 border-cyan-500 animate-pulse">
                           <h4 className="text-[10px] font-black uppercase text-cyan-500 tracking-widest mb-1 flex items-center gap-2"><Thermometer size={12}/> Treatment</h4>
                           <p className="font-urdu text-lg text-white/90">{result.cure_ur}</p>
                       </div>
                   )}
               </div>
           )}

           <button onClick={resetScanner} className="w-full bg-[#FFC107] text-black py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-transform">
               <RefreshCw size={20}/> Scan Again
           </button>
        </div>
      )}

      {/* ERROR TOAST */}
      {error && (
          <div className="absolute bottom-40 left-6 right-6 bg-rose-600/90 backdrop-blur-md text-white p-4 rounded-2xl flex items-center gap-3 shadow-xl animate-in fade-in">
              <AlertTriangle size={24}/>
              <p className="text-sm font-bold leading-tight">{error}</p>
              <button onClick={resetScanner} className="ml-auto bg-black/20 p-2 rounded-full hover:bg-black/40"><X size={16}/></button>
          </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
      <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
    </div>
  );
}