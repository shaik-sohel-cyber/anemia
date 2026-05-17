import { useState } from 'react';
import { Calendar, Search, Filter, ChevronRight, CheckCircle, AlertTriangle, Inbox, MoreHorizontal, Download, FileText } from 'lucide-react';

const HistoryView = ({ onNavigate, history = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(record => 
    record.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in">
      {/* Search and Filters */}
      <div className="stat-card p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
          <input 
            type="text" 
            placeholder="Search patient ID, name, or diagnosis..." 
            className="w-full pl-12 pr-4 py-3 bg-[var(--surface-alt)] border border-[var(--border)] rounded-2xl focus:outline-none focus:border-brand transition-all text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="btn btn-secondary flex-1 md:flex-none py-3 px-6 rounded-xl flex items-center gap-2">
            <Filter size={18} /> Filters
          </button>
          <button className="btn btn-primary flex-1 md:flex-none py-3 px-6 rounded-xl flex items-center gap-2">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="stat-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-[var(--surface-alt)] text-subtle font-bold uppercase tracking-widest text-[10px] border-b border-[var(--border)]">
                <th className="p-4 pl-6">Analysis Date</th>
                <th className="p-4">Patient Profile</th>
                <th className="p-4">Gestational Age</th>
                <th className="p-4">MCA PSV</th>
                <th className="p-4">AI Diagnosis</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredHistory.length > 0 ? filteredHistory.map((record, index) => (
                <tr key={index} className="group hover:bg-[var(--surface-alt)]/50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                      <span className="font-bold">{record.date}</span>
                      <span className="text-[10px] text-subtle font-mono uppercase">{record.id}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center font-bold">
                        {record.patient.charAt(0)}
                      </div>
                      <span className="font-medium">{record.patient}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted">{record.ga} weeks</td>
                  <td className="p-4">
                    <span className="font-mono font-bold text-brand">{record.psv} cm/s</span>
                  </td>
                  <td className="p-4">
                    <span className={`badge ${
                      record.status === 'Normal' ? 'badge-success' : 
                      record.status === 'Anemic' ? 'badge-danger' : 'badge-warning'
                    } py-1 px-3`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onNavigate('results')} className="p-2 hover:bg-white rounded-lg text-subtle hover:text-brand transition-all">
                        <FileText size={18} />
                      </button>
                      <button className="p-2 hover:bg-white rounded-lg text-subtle hover:text-brand transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="p-20 text-center">
                    <div className="flex flex-col items-center max-w-xs mx-auto">
                      <div className="w-20 h-20 bg-[var(--surface-alt)] rounded-full flex items-center justify-center text-subtle mb-6 animate-pulse">
                        <Inbox size={40} />
                      </div>
                      <h4 className="text-xl font-bold mb-2">No Records Found</h4>
                      <p className="text-muted text-sm mb-8 leading-relaxed">
                        There are currently no diagnostic reports in the database. Perform a new analysis to get started.
                      </p>
                      <button onClick={() => onNavigate('dashboard')} className="btn btn-primary px-8 py-3 rounded-xl shadow-brand">
                        Analyze New Scan
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 pl-6 pr-6 bg-[var(--surface-alt)]/30 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-subtle border-t border-[var(--border)]">
          <p className="uppercase tracking-widest">
            Showing {history.length > 0 ? `1-${history.length} of ${history.length}` : '0 of 0'} Diagnostic Reports
          </p>
          <div className="flex gap-2">
            <button className="btn btn-secondary py-2 px-4 rounded-lg opacity-50 cursor-not-allowed">Previous</button>
            <button className="btn btn-secondary py-2 px-4 rounded-lg">Next Page</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
