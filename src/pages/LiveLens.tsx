import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ScanEye, RefreshCw, Loader2, Microscope, Beaker, Upload, Zap, Activity, ArrowRight, XCircle } from 'lucide-react';

export default function LiveLens() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false); // Controls the Auto-Loop
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const puter = (window as any).puter;

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: 640, height: 640 } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { alert("Camera Error: Please enable permissions."); }
  };

  useEffect(() => {
    startCamera();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  // 1. FAIL-SAFE IMAGE PROCESSOR
  const processFrame = (source: HTMLVideoElement | HTMLImageElement) => {
    if (!canvasRef.current) return null;
    const ctx = canvasRef.current.getContext('2d');
    canvasRef.current.width = 512;
    canvasRef.current.height = 512;
    ctx?.drawImage(source, 0, 0, 512, 512);
    return canvasRef.current.toDataURL('image/jpeg', 0.5); // Low quality = High speed
  };

  // 2. THE DETECTION ENGINE
  const runAnalysis = async (imgBase64: string) => {
    setLoading(true);
    try {
      const response = await puter.ai.chat(
        `SYSTEM: Use Gemini-1.5-Flash. Act as a Pathologist. Analyze image. 
         Return ONLY JSON: {"disease": "Urdu", "scientific": "English", "cure": "Medicine", "status": "Critical/Stable"}`,
        imgBase64
      );
      const cleanJson = response.toString().match(/\{.*\}/s);
      if (cleanJson) {
        setResult(JSON.parse(cleanJson[0]));
        setIsScanning(false); // Stop loop if disease found
      }
    } catch (err) {
      // 3. REMOVE FAILED UPLOAD
      setImage(null);
      setResult(null);
      console.error("Upload Failed - Cleaning state.");
    } finally {
      setLoading(false);
    }
  };

  // 4. LIVE DETECTION LOOP
  useEffect(() => {
    let interval: any;
    if (isScanning && !loading) {
      interval = setInterval(() => {
        if (videoRef.current) {
          const frame = processFrame(videoRef.current);
          if (frame) runAnalysis(frame);
        }
      }, 4000); // Scan every 4 seconds
    }
    return () => clearInterval(interval);
  }, [isScanning, loading]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = new Image();
      img.onload = () => {
        const base64 = processFrame(img);
        if (base64) { setImage(base64); runAnalysis(base64); }
      };
      img.src = URL.createObjectURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col overflow-hidden font-sans" dir="rtl">
      
      {/* PRO HEADER */}
      <header className="h-[65px] bg-[#1A1A1A] px-4 flex justify-between items-center shrink-0 border-b border-white/5 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="p-2 bg-white/5 rounded-xl"><ArrowRight size={20} className="rotate-180" /></button>
          <h1 className="text-lg font-black text-[#FFC107]">SCANNER PRO</h1>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <Zap size={10} className="text-emerald-500 animate-pulse" fill="currentColor" />
          <span className="text-[8px] font-black text-emerald-500 uppercase">{isScanning ? 'Live Scanning' : 'System Ready'}</span>
        </div>
      </header>

      {/* VIEWPORT */}
      <div className="flex-1 relative bg-[#0A0A0A] overflow-hidden">
        <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${image ? 'hidden' : 'block'}`} />
        {image && <img src={image} className="w-full h-full object-cover" />}
        
        {/* Animated Gold Scan Grid */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none z-20">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#FFC107] shadow-[0_0_20px_#FFC107] animate-scan" />
            <div className="absolute inset-0 border-[2px] border-[#FFC107]/20 m-10 rounded-[2rem] border-dashed animate-pulse" />
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-50">
            <Loader2 className="w-10 h-10 animate-spin text-[#FFC107]" />
            <p className="mt-4 text-[9px] font-black tracking-widest text-[#FFC107] uppercase">Gemini Flash Analysis...</p>
          </div>
        )}

        {/* RESULTS OVERLAY */}
        {result && (
          <div className="absolute bottom-6 left-6 right-6 bg-[#1A1A1A] p-6 rounded-[2.5rem] border border-[#FFC107]/30 shadow-2xl z-[60] animate-in slide-in-from-bottom">
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="text-3xl font-black font-urdu text-white">{result.disease}</h3>
                <p className="text-[10px] font-bold text-[#FFC107] uppercase tracking-tighter">{result.scientific}</p>
              </div>
              <button onClick={() => {setResult(null); setImage(null); setIsScanning(true);}} className="p-2 bg-white/5 rounded-full"><XCircle size={24} className="text-white/20"/></button>
            </div>
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
               <p className="text-[8px] font-black text-emerald-500 uppercase mb-1">Prescription | علاج</p>
               <p className="text-xs font-urdu font-bold">{result.cure}</p>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM CONTROLS */}
      {!result && (
        <div className="bg-[#1A1A1A] h-[110px] flex items-center justify-around px-10 shrink-0 border-t border-white/5 pb-4">
           <button onClick={() => fileInputRef.current?.click()} className="p-4 bg-white/5 rounded-full text-[#FFC107]"><Upload size={24} /></button>
           
           <button 
             onClick={() => setIsScanning(!isScanning)} 
             className={`w-20 h-20 rounded-full border-[6px] border-black shadow-2xl transition-all flex items-center justify-center ${isScanning ? 'bg-rose-600 animate-pulse' : 'bg-[#FFC107]'}`}
           >
             {isScanning ? <RefreshCw className="animate-spin text-white" /> : <ScanEye size={32} className="text-black" />}
           </button>

           <button onClick={() => window.location.reload()} className="p-4 bg-white/5 rounded-full text-[#FFC107]"><RefreshCw size={24} /></button>
        </div>
      )}

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
      <canvas ref={canvasRef} className="hidden" />
      <style>{`
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
}