import { useState } from 'react';
import { Activity, Lock, Mail, ArrowLeft, Sun, Moon, ShieldCheck, Zap, Loader2, UserPlus, LogIn, ChevronRight, CheckCircle2, Building } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const Login = ({ onLogin, onNavigate, darkMode, toggleDarkMode }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Radiologist');
  const [institution, setInstitution] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin(userCredential.user, role, institution);
    } catch (err) {
      console.error("Auth Error:", err.code);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid clinical credentials. Please check your email/password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
      } else {
        setError('Authentication failed. Please check your connection.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoggingIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLogin(result.user);
    } catch (err) {
      console.error("Google Auth Error:", err);
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center p-12">
         {/* Animated Background Elements */}
         <div className="absolute inset-0">
            <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--brand)_0%,_transparent_70%)] opacity-20 animate-pulse"></div>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
         </div>
         
         <div className="relative z-10 w-full max-w-xl space-y-12 animate-in slide-in-left duration-1000">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-brand-gradient rounded-3xl flex items-center justify-center text-white shadow-2xl">
                  <Activity size={36} />
               </div>
               <h1 className="text-4xl font-black text-white font-outfit tracking-tighter">GeoProteoNet</h1>
            </div>

            <div className="space-y-6">
               <h2 className="text-5xl font-black text-white leading-tight font-outfit">
                  Precision AI for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Fetal Health.</span>
               </h2>
               <p className="text-xl text-slate-400 font-medium leading-relaxed">
                  The world's first clinical intelligence platform for real-time MCA Doppler analysis and fetal anemia prediction.
               </p>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-8">
               {[
                 { title: 'Neural Detection', desc: 'Real-time MCA waveform segmentation' },
                 { title: 'Clinical Precision', desc: 'MoM calculations based on Mari et al.' },
                 { title: 'Secure Flow', desc: 'HIPAA compliant data orchestration' }
               ].map((feat, i) => (
                 <div key={i} className="flex gap-4 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-brand">
                       <CheckCircle2 size={20} />
                    </div>
                    <div>
                       <h4 className="text-white font-bold">{feat.title}</h4>
                       <p className="text-sm text-slate-500 font-medium">{feat.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
         {/* Mobile Top Header */}
         <div className="absolute top-8 left-8 right-8 flex justify-between items-center lg:hidden">
            <div className="flex items-center gap-2">
               <Activity className="text-brand" size={24} />
               <span className="font-black text-xl tracking-tight dark:text-white">GeoProteoNet</span>
            </div>
         </div>

         <div className="absolute top-8 right-8">
            <button onClick={toggleDarkMode} className="p-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-105 transition-all">
               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
         </div>

         <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-bottom-4 duration-700">
            <div className="space-y-2">
               <button 
                  onClick={() => onNavigate('landing')}
                  className="group flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-brand transition-all mb-4"
               >
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Portal
               </button>
               <h3 className="text-4xl font-black font-outfit tracking-tight dark:text-white">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
               </h3>
               <p className="text-slate-500 font-medium">
                  {isSignUp ? 'Join the next generation of fetal diagnostics' : 'Sign in to your clinical workstation'}
               </p>
            </div>

            <div className="space-y-4 pt-4">
                {/* Global Role Selection */}
                <div className="space-y-4 mb-6">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Your Access Level</label>
                      <div className="grid grid-cols-2 gap-3">
                         <button 
                            type="button"
                            onClick={() => setRole('Radiologist')}
                            className={`h-12 rounded-xl text-xs font-bold border transition-all ${role === 'Radiologist' ? 'bg-brand/10 border-brand text-brand' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'}`}
                         >
                            <ShieldCheck size={14} className="inline mr-2" /> Doctor
                         </button>
                         <button 
                            type="button"
                            onClick={() => setRole('Patient')}
                            className={`h-12 rounded-xl text-xs font-bold border transition-all ${role === 'Patient' ? 'bg-brand/10 border-brand text-brand' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'}`}
                         >
                            <UserPlus size={14} className="inline mr-2" /> Patient
                         </button>
                      </div>
                   </div>

                   {role === 'Radiologist' && (
                      <div className="space-y-1.5 animate-in slide-in-top-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Affiliated Institution</label>
                         <div className="relative group">
                            <Building size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand transition-colors" />
                            <input 
                               type="text" 
                               className="w-full h-14 px-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl dark:text-white focus:outline-none focus:border-brand transition-all"
                               placeholder="e.g. Mayo Clinic, New York"
                               value={institution}
                               onChange={(e) => setInstitution(e.target.value)}
                            />
                         </div>
                      </div>
                   )}
                </div>

               {/* Social Login */}
               <button 
                  onClick={handleGoogleSignIn}
                  disabled={isLoggingIn}
                  className="w-full h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center gap-4 font-bold text-slate-700 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
               >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9105 17.5885 17.2025 16.3414 18.0182V21.0039H20.1779C22.4314 18.9273 23.766 15.8821 23.766 12.2764Z" fill="#4285F4"/>
                    <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1845 21.0039L16.348 18.0182C15.2758 18.7423 13.8824 19.1667 12.2467 19.1667C9.1166 19.1667 6.46571 17.0601 5.5134 14.2203H1.5498V17.2882C3.52187 21.2131 7.59515 24.0008 12.2401 24.0008Z" fill="#34A853"/>
                    <path d="M5.50654 14.2203C5.26384 13.5046 5.12749 12.7441 5.12749 11.961C5.12749 11.1779 5.26384 10.4174 5.50654 9.70166V6.63379H1.5498C0.716186 8.29746 0.243164 10.076 0.243164 11.961C0.243164 13.846 0.716186 15.6246 1.5498 17.2882L5.50654 14.2203Z" fill="#FBBC05"/>
                    <path d="M12.2401 4.75966C14.0016 4.73352 15.6946 5.39486 16.9417 6.61114L20.2639 3.28892C18.1332 1.2514 15.242 0.106689 12.2401 0.124601C7.59515 0.124601 3.52187 2.91234 1.5498 6.83723L5.5134 9.9051C6.46571 7.06527 9.1166 4.95872 12.2467 4.95872C12.2445 4.95872 12.2423 4.95966 12.2401 4.75966Z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
               </button>

               <div className="flex items-center gap-4 py-2">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Or use email</span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
               </div>

               {/* Auth Form */}
               <form onSubmit={handleLoginSubmit} className="space-y-5">
                  {error && (
                    <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/30 rounded-2xl text-rose-600 dark:text-rose-400 text-xs font-bold animate-in shake-1">
                       {error}
                    </div>
                  )}

                  {isSignUp && (
                    <div className="space-y-4">
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                          <input 
                             type="text" required
                             className="w-full h-14 px-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl dark:text-white focus:outline-none focus:border-brand transition-all"
                             placeholder="Dr. Sarah Connor"
                             value={fullName}
                             onChange={(e) => setFullName(e.target.value)}
                          />
                       </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                     <div className="relative group">
                        <Mail size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand transition-colors" />
                        <input 
                           type="email" required
                           className="w-full h-14 px-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl dark:text-white focus:outline-none focus:border-brand transition-all"
                           placeholder="doctor@hospital.com"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                        />
                     </div>
                  </div>

                  <div className="space-y-1.5">
                     <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                        {!isSignUp && <button type="button" className="text-[10px] font-black text-brand uppercase tracking-wider hover:underline">Forgot?</button>}
                     </div>
                     <div className="relative group">
                        <Lock size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand transition-colors" />
                        <input 
                           type="password" required
                           className="w-full h-14 px-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl dark:text-white focus:outline-none focus:border-brand transition-all"
                           placeholder="••••••••••••"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                        />
                     </div>
                  </div>

                  <button 
                     type="submit" 
                     disabled={isLoggingIn}
                     className="w-full h-16 bg-brand-gradient text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:shadow-brand/20 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70"
                  >
                     {isLoggingIn ? <Loader2 size={20} className="animate-spin" /> : (isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />)}
                     {isLoggingIn ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In to Station')}
                  </button>
               </form>

               <div className="text-center pt-4">
                  <p className="text-sm text-slate-500 font-medium">
                     {isSignUp ? 'Already have a clinical account?' : 'Need to register your workstation?'}
                     <button 
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="ml-2 text-brand font-black uppercase tracking-widest text-xs hover:underline"
                     >
                        {isSignUp ? 'Sign In' : 'Register Now'}
                     </button>
                  </p>
               </div>
            </div>

            <div className="pt-12 border-t border-slate-200 dark:border-slate-800">
               <div className="flex items-center justify-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-brand" /> SSL Encrypted • Clinical Standard v3.4
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Login;
