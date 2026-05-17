import { useState } from 'react';
import { Search, Plus, MoreVertical, Filter, User, X, Check, ArrowRight, UserPlus, ShieldAlert, Calendar, Activity, FileText } from 'lucide-react';

const PatientDirectory = ({ onNavigate, patients = [], refreshPatients, setSelectedPatientId }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', ga: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(pt => 
    pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pt.displayId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = async () => {
    if (newPatient.name) {
      setIsSaving(true);
      try {
        let gaVal = null;
        if (newPatient.ga) {
            const match = newPatient.ga.match(/(\d+)/);
            if (match) gaVal = parseInt(match[1]);
        }
          
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/patients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newPatient.name,
                age: newPatient.age ? parseInt(newPatient.age) : null,
                gestational_age: gaVal,
                medical_notes: ''
            })
        });
        
        if (response.ok) {
            setNewPatient({ name: '', age: '', ga: '' });
            setIsAdding(false);
            if (refreshPatients) refreshPatients();
        }
      } catch (e) {
          console.error("Error creating patient:", e);
      } finally {
          setIsSaving(false);
      }
    }
  };

  const handleSelectPatient = (id) => {
    setSelectedPatientId(id);
    onNavigate('upload');
  };

  const handleViewDetail = (id) => {
    setSelectedPatientId(id);
    onNavigate('patient_detail');
  };

  return (
    <div className="space-y-8 animate-in">
      {/* Header with Title and Global Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-3xl font-black font-outfit tracking-tight">Patient Registry</h3>
          <p className="text-subtle text-sm flex items-center gap-2">
            <User size={16} className="text-brand" /> Total Active Cases: {patients.length}
          </p>
        </div>
        <button 
          className={`btn ${isAdding ? 'btn-secondary' : 'btn-primary shadow-brand'} h-12 px-6 rounded-xl flex items-center gap-2 font-bold transition-all`} 
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? <><X size={18} /> Close Panel</> : <><UserPlus size={18} /> Register New Patient</>}
        </button>
      </div>

      {/* Registration Panel */}
      {isAdding && (
        <div className="stat-card border-brand/20 bg-brand/5 p-8 animate-in slide-in-top-5">
          <h4 className="font-bold mb-6 flex items-center gap-2">
            <UserPlus size={18} className="text-brand" /> New Patient Intake
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="md:col-span-1 space-y-2">
              <label className="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Full Name</label>
              <input type="text" className="w-full h-12 bg-white dark:bg-slate-900 border border-[var(--border)] rounded-xl px-4 font-bold focus:outline-none focus:border-brand transition-all" placeholder="e.g. Sarah Jenkins" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} disabled={isSaving}/>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Maternal Age</label>
              <input type="number" className="w-full h-12 bg-white dark:bg-slate-900 border border-[var(--border)] rounded-xl px-4 font-bold focus:outline-none focus:border-brand transition-all" placeholder="e.g. 28" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} disabled={isSaving} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-subtle uppercase tracking-widest ml-1">Gestational Age</label>
              <input type="text" className="w-full h-12 bg-white dark:bg-slate-900 border border-[var(--border)] rounded-xl px-4 font-bold focus:outline-none focus:border-brand transition-all" placeholder="e.g. 24 weeks" value={newPatient.ga} onChange={e => setNewPatient({...newPatient, ga: e.target.value})} disabled={isSaving} />
            </div>
            <button className="btn btn-primary h-12 rounded-xl flex items-center justify-center gap-2 font-bold shadow-brand" onClick={handleAddPatient} disabled={!newPatient.name || isSaving}>
              {isSaving ? <Activity size={18} className="animate-spin" /> : <Check size={18} />}
              {isSaving ? 'Processing...' : 'Confirm Registration'}
            </button>
          </div>
        </div>
      )}

      {/* Patient List */}
      <div className="stat-card p-0 overflow-hidden">
        <div className="p-4 px-6 border-b border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4 bg-[var(--surface-alt)]/30">
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
            <input 
              type="text" 
              placeholder="Search by name, ID or clinical status..." 
              className="w-full h-11 pl-12 pr-4 bg-white dark:bg-slate-900 border border-[var(--border)] rounded-xl font-medium focus:outline-none focus:border-brand transition-all text-sm" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <button className="btn btn-secondary py-2.5 px-4 rounded-xl flex items-center gap-2 text-xs font-bold">
               <Filter size={16} /> Advanced Filter
             </button>
             <button className="btn btn-secondary py-2.5 px-4 rounded-xl flex items-center gap-2 text-xs font-bold">
               <Calendar size={16} /> Date Range
             </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase font-black text-subtle tracking-widest border-b border-[var(--border)]">
                <th className="p-4 px-6">Patient Name</th>
                <th className="p-4">Reference ID</th>
                <th className="p-4">Gestational Age</th>
                <th className="p-4">Last Event</th>
                <th className="p-4">Risk</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredPatients.length > 0 ? filteredPatients.map((pt, idx) => (
                <tr key={pt.id} className="group hover:bg-[var(--surface-alt)]/50 transition-colors animate-in fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <td className="p-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center font-black text-xs border border-brand/20">
                        {pt.name.charAt(0)}
                      </div>
                      <div className="cursor-pointer group/name" onClick={() => handleViewDetail(pt.id)}>
                        <span className="font-bold block text-sm group-hover/name:text-brand transition-colors">{pt.name}</span>
                        <span className="text-[9px] text-subtle font-bold uppercase tracking-widest">Age: {pt.age || '--'}Y</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-[10px] font-bold text-subtle">{pt.displayId}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-xs text-brand bg-brand/5 px-2 py-1 rounded-lg border border-brand/10">{pt.ga}w</span>
                  </td>
                  <td className="p-4 text-xs text-muted">
                    <div className="flex items-center gap-1.5">
                       <Calendar size={12} /> {pt.lastScan || 'Pending'}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`badge ${
                      pt.risk === 'High' ? 'badge-danger' : 
                      pt.risk === 'Medium' ? 'badge-warning' : 'badge-success'
                    } py-1 px-2.5 text-[10px] flex items-center gap-1 w-fit`}>
                      {pt.risk === 'High' && <ShieldAlert size={10} />}
                      {pt.risk}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <button 
                        className="p-2 hover:bg-brand/10 rounded-lg text-subtle hover:text-brand transition-all flex items-center gap-2 text-xs font-bold"
                        onClick={() => handleViewDetail(pt.id)}
                        title="View Full Case File"
                      >
                        <FileText size={18} />
                      </button>
                      <button 
                        className="p-2 hover:bg-brand/10 rounded-lg text-subtle hover:text-brand transition-all flex items-center gap-2 text-xs font-bold"
                        onClick={() => handleSelectPatient(pt.id)}
                        title="New Analysis"
                      >
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="p-20 text-center">
                    <div className="flex flex-col items-center max-w-sm mx-auto">
                        <div className="w-20 h-20 bg-[var(--surface-alt)] rounded-full flex items-center justify-center text-subtle mb-6 animate-pulse">
                           <User size={40} />
                        </div>
                        <h4 className="text-xl font-bold mb-2">Registry is Empty</h4>
                        <p className="text-subtle text-sm font-medium mb-8">
                           No patient records found in the database. Use the registration panel to add a new case.
                        </p>
                        <button className="btn btn-primary px-8 py-3 rounded-xl shadow-brand font-bold" onClick={() => setIsAdding(true)}>
                           Open Registration Intake
                        </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientDirectory;
