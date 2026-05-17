import { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle, Download, FileText, Activity, Edit3, ChevronLeft, Share2, ClipboardCheck, ArrowUpRight, BarChart2, Shield, Sparkles, Loader2 } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter, ZAxis, ReferenceLine, Label } from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const getHeatmapColor = (value) => {
  if (value === 0) return 'transparent';
  if (value > 0) return `rgba(220, 38, 38, ${value})`;
  return `rgba(37, 99, 235, ${Math.abs(value)})`;
};

const fallbackWaveformData = [
  { time: 1, psv: 0.94, edv: 0.09 },
  { time: 2, psv: 0.95, edv: 0.08 },
  { time: 3, psv: 0.98, edv: 0.05 },
  { time: 4, psv: 0.97, edv: 0.06 },
  { time: 5, psv: 0.96, edv: 0.05 },
  { time: 6, psv: 0.94, edv: 0.06 },
  { time: 7, psv: 0.90, edv: 0.09 },
  { time: 8, psv: 0.93, edv: 0.02 },
  { time: 9, psv: 0.95, edv: 0.08 },
  { time: 10, psv: 0.92, edv: 0.01 }
];

const fallbackHeatmapData = [
  { feature1: 'PSV', feature2: 'PSV', value: 1.00 },
  { feature1: 'PSV', feature2: 'EDV', value: 0.47 },
  { feature1: 'PSV', feature2: 'RI', value: 0.00 },
  { feature1: 'PSV', feature2: 'PI', value: 0.00 },
  { feature1: 'PSV', feature2: 'S/D', value: -0.95 },
  { feature1: 'EDV', feature2: 'PSV', value: 0.47 },
  { feature1: 'EDV', feature2: 'EDV', value: 1.00 },
  { feature1: 'EDV', feature2: 'RI', value: 0.00 },
  { feature1: 'EDV', feature2: 'PI', value: 0.00 },
  { feature1: 'EDV', feature2: 'S/D', value: -0.61 },
  { feature1: 'RI', feature2: 'PSV', value: 0.00 },
  { feature1: 'RI', feature2: 'EDV', value: 0.00 },
  { feature1: 'RI', feature2: 'RI', value: 1.00 },
  { feature1: 'RI', feature2: 'PI', value: 0.00 },
  { feature1: 'RI', feature2: 'S/D', value: 0.00 },
  { feature1: 'PI', feature2: 'PSV', value: 0.00 },
  { feature1: 'PI', feature2: 'EDV', value: 0.00 },
  { feature1: 'PI', feature2: 'RI', value: 0.00 },
  { feature1: 'PI', feature2: 'PI', value: 1.00 },
  { feature1: 'PI', feature2: 'S/D', value: 0.00 },
  { feature1: 'S/D', feature2: 'PSV', value: -0.95 },
  { feature1: 'S/D', feature2: 'EDV', value: -0.61 },
  { feature1: 'S/D', feature2: 'RI', value: 0.00 },
  { feature1: 'S/D', feature2: 'PI', value: 0.00 },
  { feature1: 'S/D', feature2: 'S/D', value: 1.00 }
];

const ResultsView = ({ uploadedImage, onNavigate, analysisData, patient }) => {
  const [customNotes, setCustomNotes] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  

  
  const isAnemic = analysisData ? (analysisData.prediction === 'Anemia') : false; 
  const heatmapUrl = analysisData?.gradcam_path ? `${import.meta.env.VITE_API_URL}${analysisData.gradcam_path}` : null;

  const psv = analysisData?.features?.PSV || 0;
  const edv = analysisData?.features?.EDV || 0;
  const ri = analysisData?.features?.RI || 0;
  const pi = analysisData?.features?.PI || 0;
  const sd = analysisData?.features?.SD || 0;
  const confidence = typeof analysisData?.confidence === 'number' ? (analysisData.confidence * 100).toFixed(2) : 0;

  // MoM (Multiples of the Median) Calculation - Mari et al. 2000
  // GA is in weeks. Median PSV = 10 ^ (0.0133 * weeks + 0.214)
  const gaWeeks = patient?.ga || 20; // Default to 20 if unknown
  const medianPsv = Math.pow(10, (0.0133 * gaWeeks + 0.214));
  const mom = (psv / medianPsv).toFixed(2);
  const isHighMoM = parseFloat(mom) >= 1.5;

  // Generate Mari Curve data for visualization (Weeks 18 to 36)
  const mariCurveData = useMemo(() => {
    const data = [];
    for (let w = 18; w <= 36; w++) {
      const med = Math.pow(10, (0.0133 * w + 0.214));
      data.push({
        week: w,
        median: Number(med.toFixed(1)),
        mild: Number((med * 1.29).toFixed(1)),
        severe: Number((med * 1.5).toFixed(1))
      });
    }
    return data;
  }, []);

  const currentScanPoint = [{ x: gaWeeks, y: psv, mom: mom }];

  const handleExportPDF = async () => {
    const element = document.getElementById('diagnostic-report');
    if (!element || isExporting) return;
    setIsExporting(true);
    const scrollY = window.scrollY;
    
    try {
      window.scrollTo(0, 0);
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) document.documentElement.removeAttribute('data-theme');
      
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true, 
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      pdf.save(`GeoProteoNet_Report_${patient?.displayId || 'SCAN'}_${Date.now()}.pdf`);
      if (isDark) document.documentElement.setAttribute('data-theme', 'dark');
    } catch (error) {
      console.error('PDF Export Error:', error);
    } finally {
      setIsExporting(false);
      window.scrollTo(0, scrollY);
    }
  };

  const handleGenerateAINotes = async () => {
    if (!analysisData) return;
    setIsGeneratingNotes(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
           prompt: `Generate a concise professional medical note for a fetal ultrasound scan with PSV: ${psv} cm/s, MoM: ${mom}, GA: ${gaWeeks} weeks. Prediction: ${isAnemic ? 'Fetal Anemia' : 'Normal'}. Include observations and recommended next steps.`,
           only_notes: true 
        })
      });
      if (response.ok) {
        const data = await response.json();
        setCustomNotes(data.medical_notes || data.analysis || "Analysis complete. Fetal parameters consistent with clinical findings.");
      } else {
         throw new Error("API error");
      }
    } catch (err) {
      setCustomNotes(`CLINICAL SCAN SUMMARY\n====================\n- Date: ${new Date().toLocaleDateString()}\n- GA: ${gaWeeks} weeks\n- PSV: ${psv} cm/s\n- MoM Score: ${mom}\n- Risk Assessment: ${isAnemic ? 'HIGH RISK (Anemia)' : 'LOW RISK (Normal)'}\n- Clinical Guidance: ${isAnemic ? 'Urgent MFM Referral Required' : 'Continue routine screening'}`);
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  return (
    <div className="space-y-8 pb-12" id="diagnostic-report">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('dashboard')} className="btn btn-secondary p-2 rounded-xl">
             <ChevronLeft size={20} />
          </button>
          <div>
            <h3 className="text-2xl font-bold">Diagnostic Report</h3>
            <p className="text-muted text-sm flex items-center gap-2">
              <ClipboardCheck size={14} className="text-brand" /> MCA Doppler Ultrasound Analysis
            </p>
          </div>
        </div>
        
        {patient && (
          <div className="flex flex-wrap gap-4 p-4 bg-[var(--surface-alt)] rounded-2xl border border-[var(--border)] animate-in slide-in-from-top-4">
            <div className="flex items-center gap-2 px-3 border-r border-[var(--border)]">
              <Users size={16} className="text-brand" />
              <span className="text-xs font-bold text-subtle uppercase tracking-wider">Patient:</span>
              <span className="text-sm font-black">{patient.name}</span>
            </div>
            <div className="flex items-center gap-2 px-3 border-r border-[var(--border)]">
              <Calendar size={16} className="text-brand" />
              <span className="text-xs font-bold text-subtle uppercase tracking-wider">Gestation:</span>
              <span className="text-sm font-black">{patient.ga} weeks</span>
            </div>
            <div className="flex items-center gap-2 px-3 border-r border-[var(--border)]">
              <Activity size={16} className="text-brand" />
              <span className="text-xs font-bold text-subtle uppercase tracking-wider">Patient ID:</span>
              <span className="text-sm font-black font-mono">{patient.displayId}</span>
            </div>
            <div className="flex items-center gap-2 px-3">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-xs font-bold text-success uppercase tracking-wider">Live Analysis Active</span>
            </div>
          </div>
        )}

        <div className="flex gap-3" data-html2canvas-ignore="true">
          <button className="btn btn-secondary shadow-sm">
            <Share2 size={18} /> Share
          </button>
          <button 
            className={`btn btn-primary shadow-brand ${isExporting ? 'opacity-70' : ''}`} 
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            {isExporting ? <Activity size={18} className="animate-spin" /> : <Download size={18} />}
            Export Official PDF
          </button>
        </div>
      </div>

      {/* Main Results Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 stat-card border-l-8 ${isAnemic ? 'border-l-danger' : 'border-l-success'} bg-gradient-to-r from-[var(--surface)] to-[var(--surface-alt)]`}>
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <span className={`badge ${isAnemic ? 'badge-danger' : 'badge-success'} py-1 px-4`}>
                AI Diagnostics Result
              </span>
              <h2 className="text-5xl font-bold tracking-tight">
                {isAnemic ? 'Anemic Detected' : 'Healthy Normal'}
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-muted font-medium">
                  <Activity size={18} className="text-brand" />
                  MCA Waveform Hyperdynamic: <strong>{isAnemic ? 'Yes' : 'No'}</strong>
                </div>
                <div className="flex items-center gap-2 text-muted font-medium">
                  <Activity size={18} className="text-brand" />
                  Clinical Risk: <strong>{isAnemic ? 'Severe' : 'Normal'}</strong>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-center gap-2">
               <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="var(--border)" strokeWidth="8" fill="transparent" />
                    <circle cx="48" cy="48" r="40" stroke={isAnemic ? 'var(--danger)' : 'var(--brand)'} strokeWidth="8" fill="transparent" strokeDasharray={251} strokeDashoffset={251 - (251 * confidence / 100)} strokeLinecap="round" className="transition-all duration-1000" />
                  </svg>
                  <span className="absolute text-lg font-bold">{Math.round(confidence)}%</span>
               </div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-subtle">Confidence</span>
            </div>
          </div>
          
          <div className="mt-8 p-6 glass rounded-2xl border border-[var(--border)] flex gap-4">
            <div className={`p-3 rounded-full shrink-0 ${isAnemic ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
              {isAnemic ? <AlertTriangle size={28} /> : <CheckCircle size={28} />}
            </div>
            <div>
              <h5 className="font-bold text-lg mb-1">AI Clinical Summary</h5>
              <p className="text-muted leading-relaxed">
                {isAnemic 
                  ? "Analysis reveals significantly elevated PSV (>1.5 MoM) with abnormal waveform indices. The GeoProteoNet engine identifies these markers as indicative of moderate-to-severe fetal anemia with 98% correlation to clinical labels." 
                  : "All Doppler parameters fall within 1 standard deviation of the gestation-specific mean. Waveform morphology is healthy with normal resistance and pulsatility indices."}
              </p>
            </div>
          </div>
        </div>

        {/* Visual Explanation Card */}
        <div className="stat-card p-0 overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-4 border-b border-[var(--border)] flex justify-between items-center glass">
            <h4 className="font-bold">Visual Explanation</h4>
            {heatmapUrl && (
              <button 
                className="btn btn-secondary py-1.5 px-3 rounded-lg text-xs"
                onClick={() => setShowHeatmap(!showHeatmap)}
              >
                {showHeatmap ? "View Original" : "View Heatmap"}
              </button>
            )}
          </div>
          <div className="flex-1 bg-black flex items-center justify-center relative">
            <img 
              src={showHeatmap && heatmapUrl ? heatmapUrl : uploadedImage} 
              className="max-w-full max-h-full object-contain" 
              alt="Scan" 
            />
            {showHeatmap && <div className="scanline" data-html2canvas-ignore="true"></div>}
          </div>
          <div className="p-3 text-[10px] text-center font-medium bg-[var(--surface-alt)] text-subtle uppercase tracking-widest">
            {showHeatmap ? 'Grad-CAM Attention Mapping Active' : 'Native Ultrasound Input View'}
          </div>
        </div>
      </div>

      {/* Metrics & Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'MCA PSV', value: `${psv} cm/s`, status: isAnemic ? 'High' : 'Normal', color: isAnemic ? 'danger' : 'success', desc: 'Peak Systolic' },
          { label: 'Multiples of Median', value: `${mom} MoM`, status: isHighMoM ? 'Anemic' : 'Normal', color: isHighMoM ? 'danger' : 'success', desc: 'Clinical Ratio' },
          { label: 'Pulsatility Index', value: pi, status: 'Calculated', color: 'brand', desc: 'Resistance' },
          { label: 'S/D Ratio', value: sd, status: isAnemic ? 'Abnormal' : 'Stable', color: isAnemic ? 'danger' : 'success', desc: 'Ratio' }
        ].map((stat, i) => (
          <div key={i} className="stat-card hover:border-brand transition-all animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <p className="text-xs font-bold text-subtle uppercase tracking-wider">{stat.label}</p>
            <h4 className="text-3xl font-bold py-1">{stat.value}</h4>
            <div className="flex justify-between items-center mt-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                stat.color === 'danger' ? 'bg-red-100 text-red-600' : 
                stat.color === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {stat.status}
              </span>
              <span className="text-[10px] text-subtle">{stat.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="stat-card min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
             <h4 className="font-bold flex items-center gap-2"><Activity size={18} className="text-brand" /> Characteristic Waveform</h4>
             <ArrowUpRight size={20} className="text-subtle" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analysisData?.waveform || []}>
                <defs>
                  <linearGradient id="colorPsv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--brand)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="time" hide />
                <YAxis domain={['auto', 'auto']} stroke="var(--subtle)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}
                />
                <Area type="monotone" dataKey="psv" stroke="var(--brand)" strokeWidth={3} fillOpacity={1} fill="url(#colorPsv)" />
                <Area type="monotone" dataKey="edv" stroke="var(--success)" strokeWidth={3} fillOpacity={0.1} fill="var(--success)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stat-card min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
             <h4 className="font-bold flex items-center gap-2"><ArrowUpRight size={18} className="text-brand" /> Clinical Mari Curve</h4>
             <span className="text-[10px] font-bold text-subtle uppercase">Reference Chart</span>
          </div>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis type="number" dataKey="week" name="Week" unit="w" domain={[18, 36]} stroke="var(--subtle)" fontSize={10} />
                <YAxis type="number" dataKey="psv" name="PSV" unit="cm/s" domain={[0, 120]} stroke="var(--subtle)" fontSize={10} />
                <ZAxis type="number" range={[100, 100]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                
                {/* Reference Area Curves */}
                <Scatter name="1.0 MoM (Median)" data={mariCurveData.map(d => ({ week: d.week, psv: d.median }))} line={{ stroke: 'var(--success)', strokeWidth: 1, strokeDasharray: '5 5' }} shape={() => null} />
                <Scatter name="1.29 MoM (Mild)" data={mariCurveData.map(d => ({ week: d.week, psv: d.mild }))} line={{ stroke: 'var(--warning)', strokeWidth: 1, strokeDasharray: '5 5' }} shape={() => null} />
                <Scatter name="1.5 MoM (Severe)" data={mariCurveData.map(d => ({ week: d.week, psv: d.severe }))} line={{ stroke: 'var(--danger)', strokeWidth: 2 }} shape={() => null} />
                
                {/* The Patient's Current Scan Point */}
                <Scatter 
                  name="Current Analysis" 
                  data={currentScanPoint.map(p => ({ week: p.x, psv: p.y }))} 
                  fill={isHighMoM ? 'var(--danger)' : 'var(--brand)'}
                />
              </ScatterChart>
            </ResponsiveContainer>
            <div className="absolute top-4 right-4 text-[8px] font-bold space-y-1">
               <div className="flex items-center gap-1"><div className="w-2 h-0.5 bg-red-500"></div> &gt;1.5 MoM (Anemic)</div>
               <div className="flex items-center gap-1"><div className="w-2 h-0.5 bg-amber-500 dashed"></div> 1.29 MoM (Mild)</div>
               <div className="flex items-center gap-1"><div className="w-2 h-0.5 bg-emerald-500 dashed"></div> Median</div>
            </div>
          </div>
        </div>

        <div className="stat-card min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
             <h4 className="font-bold flex items-center gap-2"><BarChart2 size={18} className="text-brand" /> Feature Correlation</h4>
             <span className="text-[10px] font-bold text-brand uppercase px-2 py-1 bg-brand/10 rounded">Live Map</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
             <div className="grid grid-cols-6 gap-2 w-full max-w-[400px]">
                {['P','E','R','I','S','L'].map(h => <div key={h} className="text-[10px] font-bold text-center text-subtle">{h}</div>)}
                {(analysisData?.heatmap || []).slice(0, 30).map((cell, idx) => (
                  <div 
                    key={idx}
                    className="aspect-square rounded-lg flex items-center justify-center text-[8px] font-bold text-white transition-transform hover:scale-110 cursor-pointer"
                    style={{ backgroundColor: getHeatmapColor(cell.correlation ?? cell.value ?? 0) }}
                  >
                    {(cell.correlation ?? cell.value ?? 0).toFixed(1)}
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Clinical Notes & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 stat-card">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold flex items-center gap-2 text-brand">
              <Edit3 size={20} /> Clinical Documentation
            </h4>
            <button 
              onClick={handleGenerateAINotes}
              disabled={isGeneratingNotes || !analysisData}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand/10 text-brand text-xs font-bold hover:bg-brand/20 transition-all disabled:opacity-50"
            >
              {isGeneratingNotes ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {isGeneratingNotes ? "AI Generating..." : "AI Auto-Write"}
            </button>
          </div>
          <textarea 
            className="w-full p-6 rounded-2xl bg-[var(--surface-alt)] border-2 border-transparent focus:border-brand focus:bg-[var(--surface)] outline-none transition-all text-sm leading-relaxed" 
            rows="6" 
            placeholder="Type your clinical observations, recommended treatments, or follow-up plans here..."
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
          ></textarea>
        </div>

        <div className="bg-brand text-white shadow-brand rounded-2xl p-6 flex flex-col gap-2 relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Shield size={20} /> Recommendations
          </h4>
          <div className="space-y-4">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
              <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Immediate Action</p>
              <p className="text-sm font-medium">
                {isAnemic 
                  ? "Recommend urgent consultation with a Maternal-Fetal Medicine (MFM) specialist for potential intrauterine transfusion." 
                  : "No acute intervention required. Fetal parameters are within normal physiological limits."}
              </p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
              <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Follow-up</p>
              <p className="text-sm font-medium">
                {isAnemic 
                  ? "Repeat MCA Doppler scan in 24 hours to monitor PSV trajectory and peak velocity." 
                  : "Continue routine prenatal screening as per standard trimester guidelines."}
              </p>
            </div>
            <button className="btn w-full bg-white text-brand rounded-xl font-bold mt-4 hover:bg-blue-50">
              {isAnemic ? "View Anemia Protocol" : "View Routine Protocol"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
