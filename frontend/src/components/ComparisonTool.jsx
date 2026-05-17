import { Activity, ArrowRight, TrendingUp, Calendar, AlertCircle, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ComparisonTool = () => {
  const scanData1 = [
    { time: '0.0s', velocity: 10 }, { time: '0.1s', velocity: 45 }, { time: '0.2s', velocity: 68 },
    { time: '0.3s', velocity: 30 }, { time: '0.4s', velocity: 15 }, { time: '0.5s', velocity: 12 },
  ];
  
  const scanData2 = [
    { time: '0.0s', velocity: 12 }, { time: '0.1s', velocity: 55 }, { time: '0.2s', velocity: 82 },
    { time: '0.3s', velocity: 40 }, { time: '0.4s', velocity: 20 }, { time: '0.5s', velocity: 15 },
  ];

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-3xl font-black font-outfit tracking-tight">Longitudinal Analysis</h3>
          <p className="text-subtle text-sm flex items-center gap-2">
            <TrendingUp size={16} className="text-brand" /> Differential Trend Monitoring (Scan A vs Scan B)
          </p>
        </div>
        <div className="flex gap-3">
           <button className="btn btn-secondary h-11 px-6 rounded-xl text-xs font-bold">Select Baseline</button>
           <button className="btn btn-primary h-11 px-6 rounded-xl text-xs font-bold shadow-brand">Compare New</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Baseline Scan */}
        <div className="stat-card group hover:border-emerald-500/30 transition-all duration-500">
          <div className="flex justify-between items-start mb-6 border-b border-[var(--border)] pb-6">
            <div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest mb-2 inline-block">Baseline Scan</span>
              <h4 className="text-xl font-bold">28w 1d Gestation</h4>
              <p className="text-xs text-subtle font-medium flex items-center gap-1 mt-1">
                <Calendar size={12} /> Captured: Oct 01, 2026
              </p>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
               <CheckCircle2 size={20} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-[var(--surface-alt)] rounded-2xl border border-[var(--border)]">
              <p className="text-[10px] font-black text-subtle uppercase tracking-widest mb-1">PSV Median</p>
              <p className="text-2xl font-black font-outfit text-brand">68.4 <span className="text-[10px] font-bold">cm/s</span></p>
            </div>
            <div className="p-4 bg-[var(--surface-alt)] rounded-2xl border border-[var(--border)]">
              <p className="text-[10px] font-black text-subtle uppercase tracking-widest mb-1">Pulsatility Index</p>
              <p className="text-2xl font-black font-outfit">1.82</p>
            </div>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scanData1}>
                <defs>
                  <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--brand)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} stroke="var(--subtle)" fontSize={10} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} stroke="var(--subtle)" fontSize={10} />
                <Tooltip 
                   contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}
                />
                <Area type="monotone" dataKey="velocity" stroke="var(--brand)" fill="url(#baselineGrad)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Follow-up Scan */}
        <div className="stat-card group hover:border-amber-500/30 transition-all duration-500">
          <div className="flex justify-between items-start mb-6 border-b border-[var(--border)] pb-6">
            <div>
              <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-widest mb-2 inline-block">Active Follow-up</span>
              <h4 className="text-xl font-bold">30w 0d Gestation</h4>
              <p className="text-xs text-subtle font-medium flex items-center gap-1 mt-1">
                <Calendar size={12} /> Captured: Oct 14, 2026
              </p>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
               <AlertCircle size={20} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-[var(--surface-alt)] rounded-2xl border border-amber-500/20 relative">
              <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-black text-amber-600">
                 <TrendingUp size={12} /> +20%
              </div>
              <p className="text-[10px] font-black text-subtle uppercase tracking-widest mb-1">PSV Median</p>
              <p className="text-2xl font-black font-outfit text-amber-600">82.1 <span className="text-[10px] font-bold">cm/s</span></p>
            </div>
            <div className="p-4 bg-[var(--surface-alt)] rounded-2xl border border-[var(--border)]">
              <p className="text-[10px] font-black text-subtle uppercase tracking-widest mb-1">Pulsatility Index</p>
              <p className="text-2xl font-black font-outfit">1.65</p>
            </div>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scanData2}>
                <defs>
                  <linearGradient id="followGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} stroke="var(--subtle)" fontSize={10} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} stroke="var(--subtle)" fontSize={10} />
                <Tooltip 
                   contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}
                />
                <Area type="monotone" dataKey="velocity" stroke="#f59e0b" fill="url(#followGrad)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="stat-card border-l-8 border-brand bg-brand/5 p-8 flex flex-col md:flex-row gap-8 items-start">
        <div className="w-16 h-16 bg-brand-gradient rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
           <Activity size={32} />
        </div>
        <div className="space-y-4">
           <h4 className="text-2xl font-black font-outfit tracking-tight">Clinical Diagnostic Insight</h4>
           <p className="text-subtle font-medium leading-relaxed max-w-4xl">
             Analysis indicates a <strong>20.03% increase</strong> in PSV over the 13-day interval. While the baseline was stable, the current trajectory shows an acceleration in peak velocity, now reaching <strong>82.1 cm/s</strong>. This level is significantly approaching the critical 1.5 MoM threshold for 30 weeks.
           </p>
           <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-[var(--border)] rounded-xl text-xs font-bold text-subtle">
                 <AlertCircle size={16} className="text-amber-500" /> Elevated Monitoring Required
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-[var(--border)] rounded-xl text-xs font-bold text-subtle">
                 <CheckCircle2 size={16} className="text-emerald-500" /> Data Calibration: Optimized
              </div>
              <button className="text-xs font-black text-brand uppercase tracking-widest flex items-center gap-2 hover:underline">
                 View Combined Heatmap <ArrowRight size={14} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTool;
