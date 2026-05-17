import React from 'react';
import { HelpCircle, Book, MessageSquare, Video, FileText, ExternalLink, Mail } from 'lucide-react';

const HelpCenter = () => {
  return (
    <div className="space-y-8 animate-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-3xl font-black font-outfit tracking-tight">Help & Documentation</h3>
          <p className="text-subtle text-sm flex items-center gap-2">
            <HelpCircle size={16} className="text-brand" /> Operational Support & Training Resources
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="stat-card group hover:border-brand transition-all cursor-pointer">
            <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand group-hover:text-white transition-all">
               <Book size={24} />
            </div>
            <h4 className="font-bold text-xl mb-2">User Guide</h4>
            <p className="text-sm text-subtle leading-relaxed mb-6">Learn how to navigate the platform, manage patients, and interpret AI results.</p>
            <button className="text-xs font-black text-brand uppercase tracking-widest flex items-center gap-2">Read Docs <ExternalLink size={14} /></button>
         </div>

         <div className="stat-card group hover:border-brand transition-all cursor-pointer">
            <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand group-hover:text-white transition-all">
               <Video size={24} />
            </div>
            <h4 className="font-bold text-xl mb-2">Video Tutorials</h4>
            <p className="text-sm text-subtle leading-relaxed mb-6">Step-by-step video walk-throughs on performing high-quality MCA Doppler scans.</p>
            <button className="text-xs font-black text-brand uppercase tracking-widest flex items-center gap-2">Watch Videos <ExternalLink size={14} /></button>
         </div>

         <div className="stat-card group hover:border-brand transition-all cursor-pointer">
            <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand group-hover:text-white transition-all">
               <MessageSquare size={24} />
            </div>
            <h4 className="font-bold text-xl mb-2">Technical Support</h4>
            <p className="text-sm text-subtle leading-relaxed mb-6">Connect with our engineering team for system troubleshooting or API integration.</p>
            <button className="text-xs font-black text-brand uppercase tracking-widest flex items-center gap-2">Contact Us <Mail size={14} /></button>
         </div>
      </div>

      <div className="stat-card">
         <h4 className="font-bold mb-8">Frequently Asked Questions</h4>
         <div className="space-y-6">
            {[
               { q: "How does the Mari Curve MoM calculation work?", a: "The platform uses the clinical regression formula PSV = e^(2.31 + 0.046 * GA) to calculate the median for each gestational week." },
               { q: "Can I export reports to PDF?", a: "Yes, once an analysis is complete, you can use the 'Print / Export PDF' button on the results page." },
               { q: "Is the AI analysis real-time?", a: "Analysis typically takes 2-5 seconds depending on image complexity and server load." }
            ].map((faq, i) => (
               <div key={i} className="border-b border-[var(--border)] pb-6 last:border-0 last:pb-0">
                  <p className="font-bold mb-2 flex items-center gap-3">
                     <span className="text-brand">Q:</span> {faq.q}
                  </p>
                  <p className="text-sm text-subtle leading-relaxed">
                     {faq.a}
                  </p>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default HelpCenter;
