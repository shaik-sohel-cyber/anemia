import { BookOpen, Calculator, Info, CheckCircle, AlertCircle, ChevronRight, FileText } from 'lucide-react';

const ClinicalGuidelines = () => {
  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-3xl font-black font-outfit tracking-tight">Clinical Decision Support</h3>
          <p className="text-subtle text-sm flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-500" /> Evidence-Based Guidelines & Protocols (v2026.1)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Calculator Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="stat-card p-8">
            <div className="flex justify-between items-center mb-8 border-b border-[var(--border)] pb-6">
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand/10 text-brand rounded-2xl">
                     <Calculator size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">MCA-PSV MoM Calculator</h4>
                    <p className="text-xs text-subtle font-bold uppercase tracking-widest">Multiples of Median Engine</p>
                  </div>
               </div>
               <button className="text-xs font-bold text-brand hover:underline flex items-center gap-1 uppercase tracking-widest">
                 View Formula <ChevronRight size={14} />
               </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Gestational Age (Weeks)</label>
                <div className="relative">
                  <input type="number" className="w-full h-14 bg-[var(--surface-alt)] border border-[var(--border)] rounded-2xl px-6 font-bold text-lg focus:outline-none focus:border-brand transition-all" defaultValue="28" />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-subtle">WEEKS</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Measured PSV (cm/s)</label>
                <div className="relative">
                  <input type="number" className="w-full h-14 bg-[var(--surface-alt)] border border-[var(--border)] rounded-2xl px-6 font-bold text-lg focus:outline-none focus:border-brand transition-all" defaultValue="60" />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-subtle">CM/S</span>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-brand-gradient rounded-3xl text-center text-white shadow-[0_20px_50px_rgba(37,99,235,0.2)] transform hover:scale-[1.02] transition-transform duration-500 mb-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-2">Calculated Significance</p>
              <h2 className="text-6xl font-black font-outfit mb-2">1.15 MoM</h2>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md">
                 <CheckCircle size={14} /> Clinical Status: Within Normal Range
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-subtle font-black text-[10px] uppercase tracking-widest border-b border-[var(--border)]">
                    <th className="pb-4">Risk Classification</th>
                    <th className="pb-4">MoM Threshold</th>
                    <th className="pb-4">Clinical Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <td className="py-4 font-bold text-emerald-600">Low Risk / Normal</td>
                    <td className="py-4 text-muted font-mono">&lt; 1.50 MoM</td>
                    <td className="py-4 text-subtle font-medium">Standard Antenatal Monitoring</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-bold text-amber-500">Moderate Anemia</td>
                    <td className="py-4 text-muted font-mono">1.50 - 1.55 MoM</td>
                    <td className="py-4 text-subtle font-medium">Serial Scans Q3-5 Days</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-bold text-rose-600">Severe Anemia Risk</td>
                    <td className="py-4 text-muted font-mono">&gt; 1.55 MoM</td>
                    <td className="py-4 text-subtle font-medium font-bold">Immediate Fetal Intervention Consult</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Info Sidebar Column */}
        <div className="space-y-8">
          <div className="stat-card bg-brand-gradient border-0 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <FileText size={120} />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest mb-6">
                 <BookOpen size={14} /> 2026 Update
              </div>
              <h4 className="text-2xl font-black font-outfit mb-4 leading-tight">Institutional Protocol Updates</h4>
              <p className="text-sm font-medium text-white/80 leading-relaxed mb-8">
                Recent amendments to SMFM clinical guidelines for Rh-alloimmunized pregnancies. Algorithms have been adjusted to reflect new gestational-specific thresholds.
              </p>
              <button className="w-full py-4 bg-white text-brand font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:bg-slate-50 transition-all">
                Download PDF Full Policy
              </button>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                  <Info size={20} />
               </div>
               <h4 className="font-bold">Scanning Technique</h4>
            </div>
            <ul className="space-y-6">
              {[
                "Angle of insonation must be maintained < 15° for accuracy.",
                "Sample gate optimal range is between 1-2 mm.",
                "Capture waveforms at the proximal third of the artery.",
                "Ensure absence of fetal breathing or movement."
              ].map((tip, i) => (
                <li key={i} className="flex gap-4">
                   <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--surface-alt)] flex items-center justify-center text-[10px] font-black text-subtle border border-[var(--border)]">
                      {i + 1}
                   </div>
                   <p className="text-sm font-medium text-subtle leading-tight">{tip}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-3">
               <AlertCircle size={18} className="text-amber-500 shrink-0" />
               <p className="text-[10px] font-bold text-amber-700 leading-normal uppercase tracking-wider">
                 Incorrect technique may lead to false-positive MoM elevation.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalGuidelines;
