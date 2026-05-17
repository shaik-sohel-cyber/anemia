import { useState, useEffect } from 'react';
import { Activity, Cpu, Database, Network, ShieldCheck, Zap, Layers } from 'lucide-react';

const AnalysisView = () => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('Initializing GeoProteoNet...');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        
        // Update stage text based on progress
        if (prev === 15) setStage('Parsing Middle Cerebral Artery Waveforms...');
        if (prev === 35) setStage('Extracting PSV & EDV Feature Vectors...');
        if (prev === 55) setStage('Running GeoProteoNet Diagnostic Inference...');
        if (prev === 75) setStage('Calibrating Confidence Scores...');
        if (prev === 90) setStage('Finalizing Clinical Diagnostic Report...');

        return prev + 1;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center animate-in fade-in duration-700">
      <div className="relative mb-16">
        {/* Animated Rings */}
        <div className="absolute inset-0 -m-8 rounded-full border border-brand/20 animate-ping duration-[3s]"></div>
        <div className="absolute inset-0 -m-12 rounded-full border border-brand/10 animate-ping duration-[4s]"></div>
        
        {/* Main Processing Core */}
        <div className="relative w-48 h-48 rounded-full bg-[var(--surface)] border-4 border-brand/30 flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.2)] overflow-hidden">
           <div 
             className="absolute bottom-0 left-0 w-full bg-brand-gradient transition-all duration-300" 
             style={{ height: `${progress}%`, opacity: 0.15 }}
           ></div>
           
           <div className="z-10 flex flex-col items-center">
             <Activity size={64} className="text-brand animate-pulse" />
             <div className="mt-4 flex flex-col items-center">
               <span className="text-3xl font-black font-outfit tracking-tighter">{progress}%</span>
               <span className="text-[10px] font-black text-subtle uppercase tracking-widest">Processing</span>
             </div>
           </div>

           {/* Rotating Scanner Line */}
           <div className="absolute inset-0 border-t-2 border-brand/50 rounded-full animate-spin duration-[2s]"></div>
        </div>
      </div>

      <div className="text-center max-w-lg mx-auto mb-12">
        <h3 className="text-3xl font-black font-outfit mb-3 tracking-tight">AI Diagnostics In Progress</h3>
        <p className="text-subtle font-medium text-lg flex items-center justify-center gap-3">
          <Zap size={18} className="text-brand animate-pulse" /> {stage}
        </p>
      </div>

      {/* Hardware / Engine Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {[
          { icon: <Cpu size={20} />, label: "Engine", value: "GeoProteoNet v3.4" },
          { icon: <Layers size={20} />, label: "Layers", value: "152 Deep Channels" },
          { icon: <ShieldCheck size={20} />, label: "Integrity", value: "Verified Secure" }
        ].map((card, i) => (
          <div key={i} className="stat-card p-6 flex flex-col items-center text-center group hover:border-brand/30 transition-all duration-500">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-subtle group-hover:text-brand group-hover:bg-brand/5 transition-all mb-4">
              {card.icon}
            </div>
            <span className="text-[10px] font-black text-subtle uppercase tracking-widest mb-1">{card.label}</span>
            <span className="font-bold text-sm tracking-tight">{card.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-16 flex items-center gap-2 text-[10px] font-black text-subtle uppercase tracking-[0.3em] opacity-30">
        <Database size={12} /> Syncing with Medical Cluster Alpha-7
      </div>
    </div>
  );
};

export default AnalysisView;
