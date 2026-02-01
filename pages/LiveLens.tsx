import React, { useState, useRef, useEffect } from 'react';
import { Camera, ScanEye, RefreshCw, X, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { askAI } from '../services/puterService';

const LiveLens: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [cameraActive, setCameraActive] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Camera start karne ka function
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Camera Error:", err);
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setLoading(true);
    setResult(null);

    const ctx = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx?.drawImage(videoRef.current, 0, 0);
    
    // Image ko base64 mein convert karna
    const base64 = canvasRef.current.toDataURL('image/jpeg');
    setImage(base64);

    try {
      // Puter AI Prompt - No Google SDK used here
      const prompt = `
        System: You are a Kashmiri Agriculture Expert. 
        Task: Analyze this crop/leaf image.
        Output: Provide JSON ONLY. 
        Format: {"diseaseName": "Name in Urdu/English", "severity": "Low/Medium/High", "treatment": ["Step 1", "Step 2"], "isHealthy": boolean}
      `;
      
      const response = await askAI(`${prompt} [Analyze this image data: ${base64.substring(0, 50)}...]`, false);
      
      if (response) {
        const match = response.match(/\{.*\}/s);
        if (match) {
          setResult(JSON.parse(match[0]));
        }
      }
    } catch (e) {
      console.error("Analysis Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      // Camera stop karna component unmount hone par
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20 p-4">
      <header className="flex items-center gap-4">
        <div className="w-16 h-16 bg-emerald-900 text-white rounded-[2rem] flex items-center justify-center shadow-2xl">
          <ScanEye className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900">FC Scanner Pro</h2>
          <p className="text-slate-500 font-medium tracking-tight uppercase text-[10px]">AI-Powered Disease Detection</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="relative bg-black rounded-[3rem] overflow-hidden aspect-square shadow-2xl border-4 border-emerald-900/10">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className={`w-full h-full object-cover ${image ? 'hidden' : 'block'}`} 
            />
            {image && <img src={image} className="w-full h-full object-cover" />}
            
            {loading && (
              <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-md flex flex-col items-center justify-center text-white">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-emerald-400" />
                <span className="font-black uppercase tracking-[0.2em] text-xs">AI Analyzing...</span>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {image ? (
              <button onClick={() => {setImage(null); setResult(null);}} className="flex-1 bg-slate-900 text-white py-5 rounded-[2rem] font-bold flex items-center justify-center gap-3">
                <RefreshCw className="w-5 h-5" /> Retake
              </button>
            ) : (
              <button onClick={captureAndAnalyze} disabled={loading} className="flex-1 bg-emerald-600 text-white py-5 rounded-[2rem] font-bold shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                <Camera className="w-6 h-6" /> Scan Now
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {result ? (
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-2xl space-y-8 animate-in zoom-in-95">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${result.isHealthy ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {result.isHealthy ? 'Healthy' : `${result.severity} Severity`}
                  </span>
                  <h3 className="text-4xl font-black text-slate-900 mt-2 font-urdu">{result.diseaseName}</h3>
                </div>
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                   <ShieldCheck className="w-8 h-8" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Recommended Treatment</h4>
                <div className="space-y-3">
                  {result.treatment.map((step: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
                      <p className="text-sm font-bold text-slate-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 p-12 rounded-[3.5rem] border border-emerald-100 text-center space-y-6">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                 <ScanEye className="w-10 h-10 text-emerald-600/30" />
              </div>
              <h4 className="text-xl font-black text-emerald-900 uppercase tracking-tighter">AI Analysis Ready</h4>
              <p className="text-emerald-700/60 font-medium leading-relaxed italic text-sm">
                Point your camera at a leaf or crop to identify diseases and get expert treatment advice instantly.
              </p>
            </div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default LiveLens;