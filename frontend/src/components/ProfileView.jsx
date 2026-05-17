import React from 'react';
import { User, Mail, Shield, ShieldCheck, MapPin, Phone, Building, Calendar, LogOut } from 'lucide-react';
import { auth } from '../firebase';

const ProfileView = ({ username, role, institution, onLogout }) => {
  const user = auth.currentUser;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in">
      <div className="stat-card p-0 overflow-hidden">
        <div className="h-32 bg-brand-gradient"></div>
        <div className="px-8 pb-8 -mt-12 relative flex flex-col md:flex-row items-end gap-6">
          <div className="w-32 h-32 rounded-3xl bg-white dark:bg-slate-900 p-2 shadow-xl">
            <div className="w-full h-full rounded-2xl bg-brand/10 flex items-center justify-center text-brand">
              <User size={64} />
            </div>
          </div>
          <div className="flex-1 pb-2">
            <h3 className="text-3xl font-black font-outfit">{username}</h3>
            <p className="text-brand font-bold flex items-center gap-2">
              {role === 'Radiologist' ? <ShieldCheck size={16} /> : <User size={16} />}
              {role} • Clinical ID: {user?.uid?.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <button 
            onClick={onLogout}
            className="btn bg-danger/10 text-danger border border-danger/20 px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold hover:bg-danger hover:text-white transition-all mb-2"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="stat-card space-y-6">
          <h4 className="font-bold text-lg border-b border-[var(--border)] pb-4">Account Information</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-alt)] flex items-center justify-center text-muted">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-subtle uppercase tracking-widest">Primary Email</p>
                <p className="font-bold">{user?.email || 'doctor@hospital.com'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-alt)] flex items-center justify-center text-muted">
                <Shield size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-subtle uppercase tracking-widest">Authentication Provider</p>
                <p className="font-bold capitalize">{user?.providerData[0]?.providerId.split('.')[0] || 'Password'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-alt)] flex items-center justify-center text-muted">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-subtle uppercase tracking-widest">Member Since</p>
                <p className="font-bold">{user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Today'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card space-y-6">
          <h4 className="font-bold text-lg border-b border-[var(--border)] pb-4">Professional Metadata</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-alt)] flex items-center justify-center text-muted">
                <Building size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-subtle uppercase tracking-widest">Affiliated Institution</p>
                <p className="font-bold">{role === 'Radiologist' ? (institution || 'Global Health Diagnostics') : 'Personal Access'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-alt)] flex items-center justify-center text-muted">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-subtle uppercase tracking-widest">Regional Node</p>
                <p className="font-bold">Global / Multi-Region</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-alt)] flex items-center justify-center text-muted">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-subtle uppercase tracking-widest">Contact Support</p>
                <p className="font-bold text-brand hover:underline cursor-pointer">Request Verified Phone</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="stat-card border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-900/10">
         <div className="flex gap-4">
            <div className="shrink-0 text-amber-600">
               <ShieldCheck size={24} />
            </div>
            <div>
               <h5 className="font-bold text-amber-900 dark:text-amber-400">Clinical Data Protection Notice</h5>
               <p className="text-sm text-amber-800/80 dark:text-amber-400/80 mt-1">
                  Your clinical sessions are encrypted with 256-bit AES protection. Accessing patient data from unverified workstations may trigger a secondary authentication challenge.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ProfileView;
