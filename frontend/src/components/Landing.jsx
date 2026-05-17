import React from 'react';
import { Activity, Brain, Shield, ArrowRight, Sun, Moon, Database, ChevronRight, Zap, Globe, FileCheck } from 'lucide-react';

const Landing = ({ onNavigate, darkMode, toggleDarkMode }) => {
  const heroImage = "/hero.png";

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center text-white shadow-brand">
              <Activity size={24} />
            </div>
            <span className="text-xl font-black font-outfit tracking-tighter">GEOPROTEONET</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-bold text-subtle hover:text-brand transition-colors">Technology</a>
            <a href="#" className="text-sm font-bold text-subtle hover:text-brand transition-colors">Research</a>
            <a href="#" className="text-sm font-bold text-subtle hover:text-brand transition-colors">Ethics</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => onNavigate('login')} className="btn btn-primary px-6 py-2.5 rounded-xl shadow-brand">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
           <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[var(--background)] to-[var(--background)] z-10"></div>
           <img 
             src={heroImage} 
             alt="Medical Visualization" 
             className="w-full h-full object-cover animate-fade-in"
           />
        </div>

        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-2xl animate-in slide-in-left-10 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/10 text-brand text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-brand/20">
              <Zap size={12} className="fill-brand" /> Next-Generation Diagnostic Intelligence
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-outfit leading-[1.1] mb-8 tracking-tight">
              Precision <span className="text-brand">AI Analysis</span> for Fetal Health.
            </h1>
            <p className="text-lg md:text-xl text-subtle leading-relaxed mb-10 max-w-xl font-medium">
              GeoProteoNet leverages advanced deep learning to provide non-invasive, high-precision detection of fetal anemia through automated Doppler waveform analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onNavigate('login')} 
                className="btn btn-primary h-14 px-10 rounded-2xl shadow-brand flex items-center justify-center gap-2 text-lg font-bold"
              >
                Launch Dashboard <ChevronRight size={20} />
              </button>
              <button className="btn btn-secondary h-14 px-10 rounded-2xl flex items-center justify-center gap-2 text-lg font-bold border border-[var(--border)]">
                Read Research Paper
              </button>
            </div>
            
            <div className="mt-16 flex items-center gap-8 grayscale opacity-50">
               <div className="flex items-center gap-2 font-bold text-sm tracking-widest uppercase">
                  <Shield size={20} /> HIPAA Compliant
               </div>
               <div className="flex items-center gap-2 font-bold text-sm tracking-widest uppercase">
                  <Globe size={20} /> ISO Certified
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[var(--surface-alt)]/30 border-y border-[var(--border)]">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
             <h2 className="text-3xl md:text-5xl font-black font-outfit mb-6">Revolutionizing Clinical Diagnostics</h2>
             <p className="text-subtle font-medium text-lg leading-relaxed">
               Our system integrates seamlessly into existing obstetric workflows, providing real-time insights backed by peer-reviewed deep learning architectures.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Brain className="text-brand" />, 
                title: "GeoProteoNet Engine", 
                desc: "State-of-the-art neural network trained on thousands of labeled MCA Doppler datasets for superior classification accuracy." 
              },
              { 
                icon: <Activity className="text-brand" />, 
                title: "Automated Waveforms", 
                desc: "Instant extraction of PSV, EDV, and PI metrics directly from ultrasound scans without manual caliper placement." 
              },
              { 
                icon: <FileCheck className="text-brand" />, 
                title: "Research-Grade Reporting", 
                desc: "Comprehensive PDF exports including Grad-CAM explainability heatmaps and comparative clinical benchmarks." 
              }
            ].map((feature, i) => (
              <div key={i} className="stat-card p-10 group hover:border-brand/50 transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-brand/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand/10 transition-colors">
                  {React.cloneElement(feature.icon, { size: 32 })}
                </div>
                <h4 className="text-xl font-bold mb-4">{feature.title}</h4>
                <p className="text-subtle leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 overflow-hidden relative">
        <div className="container mx-auto px-6 text-center">
           <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-brand mb-12">Powered by Modern Intelligence</h3>
           <div className="flex flex-wrap justify-center gap-12 items-center opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="flex items-center gap-3 font-black text-2xl font-outfit">
                <Database size={32} /> TENSORFLOW
             </div>
             <div className="flex items-center gap-3 font-black text-2xl font-outfit">
                <Globe size={32} /> PYTORCH
             </div>
             <div className="flex items-center gap-3 font-black text-2xl font-outfit">
                <Activity size={32} /> OPENCV
             </div>
             <div className="flex items-center gap-3 font-black text-2xl font-outfit">
                <Brain size={32} /> SCIPY
             </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[var(--border)] py-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center text-white shadow-brand">
              <Activity size={18} />
            </div>
            <span className="text-lg font-black font-outfit tracking-tighter">GEOPROTEONET</span>
          </div>
          <p className="text-subtle text-sm font-medium">
            © 2026 GEOPROTEONET RESEARCH SYSTEMS. All clinical data is encrypted.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-subtle hover:text-brand transition-colors text-sm font-bold">Privacy Policy</a>
            <a href="#" className="text-subtle hover:text-brand transition-colors text-sm font-bold">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
