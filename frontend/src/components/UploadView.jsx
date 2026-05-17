import { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, FileSearch, User, Info, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

const UploadView = ({ onUpload, onAnalyze, uploadedImage, patients = [], selectedPatientId, setSelectedPatientId }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0], selectedPatientId);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0], selectedPatientId);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Main Analysis Engine Area */}
      <div className="lg:col-span-2 space-y-6">
        <div className="stat-card p-8 min-h-[500px] flex items-center justify-center">
          {!uploadedImage ? (
            <div 
              className={`w-full h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-3xl transition-all duration-300 ${
                isDragging ? 'border-brand bg-blue-50/50 scale-[1.02]' : 'border-[var(--border)] bg-[var(--surface-alt)]'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="w-20 h-20 bg-brand-gradient rounded-full flex items-center justify-center text-white shadow-brand mb-6 animate-pulse-ring">
                <UploadCloud size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Upload Ultrasound Scan</h3>
              <p className="text-muted max-w-sm mb-8">
                Drag and drop your MCA Doppler scan here, or click to browse your workstation files.
              </p>
              
              <div className="flex gap-4 items-center text-xs text-subtle font-medium uppercase tracking-widest">
                <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-success" /> DICOM Support</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-success" /> High Resolution</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-success" /> AI-Enhanced</span>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          ) : (
            <div className="w-full animate-in flex flex-col items-center">
              <div className="relative group rounded-3xl overflow-hidden border border-[var(--border)] shadow-xl bg-black aspect-[4/3] w-full max-w-[600px] flex items-center justify-center">
                <img 
                  src={uploadedImage} 
                  alt="Ultrasound Preview" 
                  className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                   <p className="text-white text-sm font-medium">Click "Start Analysis" below to process with GeoProteoNet</p>
                </div>
                <button 
                  onClick={() => onUpload(null, selectedPatientId)} 
                  className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-danger transition-colors shadow-lg"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mt-8 flex gap-4">
                <button 
                  onClick={() => onUpload(null, selectedPatientId)} 
                  className="btn btn-secondary px-8 py-4 rounded-2xl"
                >
                  Change Scan
                </button>
                <button 
                  onClick={onAnalyze} 
                  className="btn btn-primary px-12 py-4 rounded-2xl shadow-xl hover:scale-105"
                >
                  <FileSearch size={20} /> Start GeoProteoNet Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Control Panel & Info Side Area */}
      <div className="space-y-6">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-brand/10 text-brand rounded-lg">
              <User size={18} />
            </div>
            <h4 className="font-bold">Clinical Context</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-subtle uppercase tracking-wider mb-2 block">Associated Patient</label>
              <div className="relative">
                <select 
                  className="w-full p-3 pl-4 pr-10 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)] appearance-none focus:outline-none focus:border-brand transition-colors font-medium text-sm"
                  value={selectedPatientId} 
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                >
                  <option value="">Guest Analysis (No Record)</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.displayId})</option>
                  ))}
                </select>
                <ChevronRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle rotate-90" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 text-xs leading-relaxed flex gap-3">
              <Info size={16} className="shrink-0" />
              <p>Associating a scan with a patient profile allows for temporal comparison and automatic clinical history tracking.</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Activity size={18} />
            </div>
            <h4 className="font-bold">Model Parameters</h4>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted">Engine</span>
              <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">GeoProteoNet v3.1</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted">Optimization</span>
              <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">Quantized Int8</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted">Target Area</span>
              <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">MCA Waveform</span>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100">
               <p className="text-[10px] text-subtle font-medium uppercase tracking-tight mb-2">Quality Checklist</p>
               <ul className="space-y-2">
                 <li className="flex items-center gap-2 text-xs text-muted">
                   <div className="w-1.5 h-1.5 rounded-full bg-success"></div> Clear envelope visible
                 </li>
                 <li className="flex items-center gap-2 text-xs text-muted">
                   <div className="w-1.5 h-1.5 rounded-full bg-success"></div> Minimal acoustic shadowing
                 </li>
               </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadView;
