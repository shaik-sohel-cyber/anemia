import React from 'react';
import { Settings as SettingsIcon, Shield, Bell, Eye, Database, Smartphone, Globe, Lock } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-8 animate-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-3xl font-black font-outfit tracking-tight">System Settings</h3>
          <p className="text-subtle text-sm flex items-center gap-2">
            <Lock size={16} className="text-brand" /> Secure Configuration Management
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
           <div className="p-2 bg-brand/5 rounded-xl border-l-4 border-brand">
              <button className="w-full flex items-center gap-3 p-4 text-brand font-bold bg-white shadow-sm rounded-lg">
                 <SettingsIcon size={18} /> General Preferences
              </button>
           </div>
           <button className="w-full flex items-center gap-3 p-4 text-subtle font-bold hover:bg-[var(--surface-alt)] transition-colors rounded-xl">
              <Shield size={18} /> Privacy & Security
           </button>
           <button className="w-full flex items-center gap-3 p-4 text-subtle font-bold hover:bg-[var(--surface-alt)] transition-colors rounded-xl">
              <Bell size={18} /> Notifications
           </button>
           <button className="w-full flex items-center gap-3 p-4 text-subtle font-bold hover:bg-[var(--surface-alt)] transition-colors rounded-xl">
              <Database size={18} /> Database Sync
           </button>
        </div>

        <div className="md:col-span-2 space-y-6">
           <div className="stat-card">
              <h4 className="font-bold mb-6">General Preferences</h4>
              <div className="space-y-8">
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="font-bold">Dark Mode</p>
                       <p className="text-xs text-subtle">Adjust interface for low-light environments</p>
                    </div>
                    <div className="w-12 h-6 bg-brand rounded-full relative p-1 cursor-pointer">
                       <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between border-t border-[var(--border)] pt-8">
                    <div>
                       <p className="font-bold">AI Sensitivity</p>
                       <p className="text-xs text-subtle">Adjustment for false-positive filtering</p>
                    </div>
                    <select className="bg-[var(--surface-alt)] border border-[var(--border)] rounded-lg px-4 py-2 font-bold text-xs">
                       <option>Balanced (Standard)</option>
                       <option>High Sensitivity</option>
                       <option>Diagnostic Only</option>
                    </select>
                 </div>

                 <div className="flex items-center justify-between border-t border-[var(--border)] pt-8">
                    <div>
                       <p className="font-bold">Unit System</p>
                       <p className="text-xs text-subtle">Measurement display for velocity</p>
                    </div>
                    <div className="flex gap-1 bg-[var(--surface-alt)] p-1 rounded-lg">
                       <button className="px-3 py-1 bg-white shadow-sm rounded-md text-[10px] font-black uppercase">cm/s</button>
                       <button className="px-3 py-1 text-[10px] font-black uppercase text-subtle">m/s</button>
                    </div>
                 </div>
              </div>
           </div>

           <div className="stat-card bg-amber-500/5 border-amber-500/20">
              <div className="flex gap-4">
                 <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl shrink-0">
                    <Shield size={24} />
                 </div>
                 <div>
                    <h4 className="font-bold text-amber-700">Administrator Only Access</h4>
                    <p className="text-sm text-amber-600 mt-1">Some settings are locked to hospital administrators. Please contact your IT department for server-level changes.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
