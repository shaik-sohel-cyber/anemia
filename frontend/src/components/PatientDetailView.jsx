import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, User, Activity, AlertTriangle, CheckCircle, FileText, TrendingUp, ArrowRight, ShieldAlert, Clock, Info, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const PatientDetailView = ({ patient, onNavigate }) => {
  const [scans, setScans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (patient?.id) {
      fetch(`${import.meta.env.VITE_API_URL}/api/patients/${patient.id}/scans`)
        .then(res => res.json())
        .then(data => {
          setScans(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error fetching patient scans:", err);
          setIsLoading(false);
        });
    }
  }, [patient]);

  const handleExportPDF = async () => {
    const element = document.getElementById('patient-case-file');
    if (!element || isExporting) return;
    setIsExporting(true);
    const scrollY = window.scrollY;
    
    try {
      window.scrollTo(0, 0);
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) document.documentElement.removeAttribute('data-theme');
      
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Patient_Case_History_${patient?.displayId}_${Date.now()}.pdf`);
      
      if (isDark) document.documentElement.setAttribute('data-theme', 'dark');
    } catch (error) {
      console.error('PDF Export Error:', error);
    } finally {
      setIsExporting(false);
      window.scrollTo(0, scrollY);
    }
  };

  // Prepare trend data
  const trendData = scans.map((s, i) => ({
    date: new Date(s.created_at).toLocaleDateString(),
    psv: s.psv,
    prediction: s.prediction,
    confidence: s.confidence
  }));

  const latestScan = scans.length > 0 ? scans[scans.length - 1] : null;
  const isAnemic = latestScan?.prediction === 'Anemia';

  return (
    <div className="space-y-8 animate-in pb-12" id="patient-case-file">
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('patients')} className="btn btn-secondary p-2 rounded-xl">
             <ChevronLeft size={20} />
          </button>
          <div>
            <h3 className="text-2xl font-black font-outfit">Patient Case File</h3>
            <p className="text-subtle text-sm flex items-center gap-2">
              <User size={14} className="text-brand" /> {patient?.name} | ID: {patient?.displayId}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={handleExportPDF}
             disabled={isExporting}
             className="btn btn-secondary px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold"
           >
              <Download size={18} /> {isExporting ? 'Generating...' : 'Export Case File'}
           </button>
           <button 
             onClick={() => onNavigate('upload')}
             className="btn btn-primary shadow-brand px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold"
           >
              <Activity size={18} /> Perform New Scan
           </button>
        </div>
      </div>

      {/* Bio & Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="stat-card flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center font-black text-2xl border border-brand/20">
               {patient?.name?.charAt(0)}
            </div>
            <div>
               <p className="text-[10px] font-black text-subtle uppercase tracking-widest">Maternal Info</p>
               <h4 className="text-xl font-bold">{patient?.name}</h4>
               <p className="text-sm font-medium text-muted">{patient?.age} Years Old</p>
            </div>
         </div>
         
         <div className="stat-card">
            <p className="text-[10px] font-black text-subtle uppercase tracking-widest mb-1">Gestation</p>
            <div className="flex items-end gap-2">
               <h4 className="text-3xl font-black text-brand">{patient?.ga}</h4>
               <span className="text-sm font-bold text-subtle pb-1">Weeks</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-success">
               <Clock size={12} /> Progressing Normally
            </div>
         </div>

         <div className={`stat-card border-l-4 ${isAnemic ? 'border-l-danger' : 'border-l-success'}`}>
            <p className="text-[10px] font-black text-subtle uppercase tracking-widest mb-1">Overall Clinical Risk</p>
            <div className="flex items-center gap-3">
               {isAnemic ? (
                 <><ShieldAlert size={24} className="text-danger" /><h4 className="text-2xl font-black text-danger">High Risk</h4></>
               ) : (
                 <><CheckCircle size={24} className="text-success" /><h4 className="text-2xl font-black text-success">Normal</h4></>
               )}
            </div>
            <p className="text-[10px] font-medium text-subtle mt-2">Based on {scans.length} diagnostic events</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Trend Chart */}
         <div className="lg:col-span-3 stat-card">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h4 className="font-bold flex items-center gap-2">
                    <TrendingUp size={18} className="text-brand" /> MCA PSV Longitudinal Trend
                  </h4>
                  <p className="text-[10px] text-subtle font-bold uppercase tracking-widest mt-1">Velocity Tracking (cm/s)</p>
               </div>
               <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-brand/5 rounded-md border border-brand/10">
                     <div className="w-2 h-2 rounded-full bg-brand"></div>
                     <span className="text-[10px] font-bold text-brand uppercase">Patient PSV</span>
                  </div>
               </div>
            </div>
            
            <div className="h-[350px] w-full">
               {scans.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                       <XAxis dataKey="date" axisLine={false} tickLine={false} stroke="var(--subtle)" fontSize={11} />
                       <YAxis axisLine={false} tickLine={false} stroke="var(--subtle)" fontSize={11} />
                       <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}
                       />
                       <ReferenceLine y={80} stroke="var(--danger)" strokeDasharray="3 3" label={{ position: 'right', value: 'Critical Threshold', fill: 'var(--danger)', fontSize: 10 }} />
                       <Line 
                          type="monotone" 
                          dataKey="psv" 
                          stroke="var(--brand)" 
                          strokeWidth={4} 
                          dot={{ fill: 'var(--brand)', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, strokeWidth: 0 }}
                       />
                    </LineChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="h-full w-full flex flex-col items-center justify-center bg-[var(--surface-alt)] rounded-2xl border-2 border-dashed border-[var(--border)]">
                    <TrendingUp size={48} className="text-subtle mb-4" />
                    <p className="text-sm font-bold text-subtle">No Trend Data Available Yet</p>
                    <p className="text-[10px] text-muted">Complete at least 2 scans to see longitudinal progression.</p>
                 </div>
               )}
            </div>
         </div>

          <div className="stat-card flex flex-col h-full overflow-hidden">
            <h4 className="font-bold flex items-center gap-2 mb-6">
               <Clock size={18} className="text-brand" /> Scan History
            </h4>
            <div className="space-y-3 overflow-y-auto max-h-[280px] pr-2 scrollbar-thin">
               {scans.length > 0 ? [...scans].reverse().map((scan, i) => (
                  <div key={scan.id} className="p-3 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)] group hover:border-brand transition-all cursor-pointer">
                     <div className="flex justify-between items-start mb-1">
                        <span className="text-[9px] font-black text-subtle uppercase tracking-widest">{new Date(scan.created_at).toLocaleDateString()}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${scan.prediction === 'Anemia' ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                           {scan.prediction}
                        </span>
                     </div>
                     <div className="flex justify-between items-end">
                        <div>
                           <p className="text-base font-black">{scan.psv} <span className="text-[10px] text-subtle font-bold">cm/s</span></p>
                        </div>
                        <ArrowRight size={12} className="text-subtle group-hover:text-brand transform group-hover:translate-x-1 transition-all" />
                     </div>
                  </div>
               )) : (
                  <div className="text-center py-10">
                     <p className="text-xs font-bold text-subtle">No scans performed.</p>
                  </div>
               )}
            </div>
         </div>
      </div>

      {/* Clinical Guidance Info */}
      <div className="stat-card bg-brand/5 border-brand/20">
         <div className="flex items-start gap-4">
            <div className="p-3 bg-brand/10 text-brand rounded-2xl">
               <Info size={24} />
            </div>
            <div>
               <h4 className="font-bold text-brand">Clinical Guidance for this Case</h4>
               <p className="text-sm text-subtle mt-1 leading-relaxed">
                  Based on the longitudinal data, this fetus shows a {scans.length > 1 ? 'progression' : 'current state'} consistent with 
                  <span className={`mx-1 font-bold ${isAnemic ? 'text-danger' : 'text-success'}`}>{isAnemic ? 'Anemia Risk' : 'Normal Development'}</span>. 
                  {isAnemic ? 'Immediate follow-up with MCA PSV MoM calculation and consideration of cordocentesis is recommended if PSV remains > 1.5 MoM.' : 'Continued routine screening as per standard prenatal guidelines is advised.'}
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PatientDetailView;
