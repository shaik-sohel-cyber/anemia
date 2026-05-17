import { useState, useEffect } from 'react'
import { auth } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import './index.css'
import Landing from './components/Landing'
import Login from './components/Login'
import DashboardLayout from './components/DashboardLayout'
import UploadView from './components/UploadView'
import AnalysisView from './components/AnalysisView'
import ResultsView from './components/ResultsView'
import HistoryView from './components/HistoryView'
import AnalyticsView from './components/AnalyticsView'
import PatientDirectory from './components/PatientDirectory'
import PatientDetailView from './components/PatientDetailView'
import ComparisonTool from './components/ComparisonTool'
import ClinicalGuidelines from './components/ClinicalGuidelines'
import Settings from './components/Settings'
import HelpCenter from './components/HelpCenter'
import ProfileView from './components/ProfileView'

function App() {
  const [view, setView] = useState('landing') // 'landing', 'login', 'dashboard', 'analysis', 'results', 'history', 'analytics', 'patients', 'patient_detail'
  const [darkMode, setDarkMode] = useState(false)
  const [username, setUsername] = useState('Dr. Sarah Connor')
  const [role, setRole] = useState('Radiologist')
  const [uploadedImage, setUploadedImage] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [analysisData, setAnalysisData] = useState(null)
  const [analysisHistory, setAnalysisHistory] = useState([])
  const [patients, setPatients] = useState([])
  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [institution, setInstitution] = useState(localStorage.getItem('userInstitution') || 'Global Health Diagnostics')
  
  // Fetch real history from the backend
  const fetchHistory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/history`);
      if (response.ok) {
        const data = await response.json();
        const formattedHistory = data.map(record => ({
          id: `REC-${String(record.id).padStart(3, '0')}`,
          date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          patient: record.patient_name || 'Unknown',
          ga: 'Unknown',
          psv: record.features.PSV,
          status: record.prediction,
          risk: record.prediction === 'Anemia' ? 'High' : 'Low',
          image_path: record.image_path,
          gradcam_path: record.gradcam_path
        }));
        setAnalysisHistory(formattedHistory);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  // Fetch real patients from the backend
  const fetchPatients = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/patients`);
      if (response.ok) {
        const data = await response.json();
        const formattedPatients = data.map(p => ({
          id: p.id,
          displayId: `PT-${String(p.id).padStart(4, '0')}`,
          name: p.name,
          age: p.age,
          ga: p.ga,
          lastScan: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A',
          risk: 'Pending', // We could fetch latest scan risk here if backend joined it
          status: 'Active'
        }));
        setPatients(formattedPatients);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName || user.email.split('@')[0]);
        if (view === 'login' || view === 'landing') {
          setView('dashboard');
        }
        fetchHistory();
        fetchPatients();
      } else {
        if (view !== 'landing' && view !== 'login') {
          setView('landing');
        }
      }
    });
    return () => unsubscribe();
  }, [view]);

  // Apply dark mode theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Navigation handlers
  const navigateTo = (newView) => setView(newView);
  
  const handleLogin = (user, userRole, userInstitution) => {
    if (user) {
      const email = user.email;
      const namePart = email.split('@')[0];
      const nameParts = namePart.split(/[._-]/);
      const formattedName = (userRole === 'Radiologist' ? 'Dr. ' : '') + nameParts.map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');
      setUsername(formattedName);
      if (userRole) setRole(userRole);
      if (userInstitution) {
        setInstitution(userInstitution);
        localStorage.setItem('userInstitution', userInstitution);
      }
    }
    navigateTo('dashboard');
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigateTo('landing');
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  const handleUpload = (file, patientId) => {
    if (file) {
      setUploadedFile(file);
      setSelectedPatientId(patientId);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedFile(null);
      setUploadedImage(null);
    }
  }

  const handleAnalyze = async () => {
    navigateTo('analysis');
    
    if (uploadedFile) {
      try {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        if (selectedPatientId) {
            formData.append('patient_id', selectedPatientId);
        }
        
        const minWaitPromise = new Promise(resolve => setTimeout(resolve, 4000));
        
        const apiPromise = fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
          method: 'POST',
          body: formData
        }).then(res => res.json());
        
        const [_, data] = await Promise.all([minWaitPromise, apiPromise]);
        
        // Data is saved to the backend database automatically by the endpoint.
        // We will just re-fetch the history so the new record appears.
        await fetchHistory();
        
        setAnalysisData(data);
        navigateTo('results');
      } catch (err) {
        console.error("Backend error:", err);
        // Fallback navigation if backend is down
        setTimeout(() => navigateTo('results'), 4000);
      }
    } else {
      setTimeout(() => navigateTo('results'), 4000);
    }
  }

  // Render the current view
  let currentViewComponent;
  switch (view) {
    case 'landing':
      currentViewComponent = <Landing onNavigate={navigateTo} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      break;
    case 'login':
      currentViewComponent = <Login onLogin={handleLogin} onNavigate={navigateTo} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      break;
    case 'dashboard':
    case 'upload':
      currentViewComponent = (
        <DashboardLayout onNavigate={navigateTo} onLogout={handleLogout} currentView="dashboard" darkMode={darkMode} toggleDarkMode={toggleDarkMode} username={username} role={role}>
          <UploadView onUpload={handleUpload} onAnalyze={handleAnalyze} uploadedImage={uploadedImage} patients={patients} selectedPatientId={selectedPatientId} setSelectedPatientId={setSelectedPatientId} />
        </DashboardLayout>
      );
      break;
    case 'analysis':
      currentViewComponent = (
        <DashboardLayout onNavigate={navigateTo} onLogout={handleLogout} currentView="analysis" darkMode={darkMode} toggleDarkMode={toggleDarkMode} username={username} role={role}>
          <AnalysisView />
        </DashboardLayout>
      );
      break;
    case 'results':
      const currentPatient = patients.find(p => p.id === Number(selectedPatientId));
      currentViewComponent = (
        <DashboardLayout 
          onNavigate={navigateTo} 
          onLogout={handleLogout} 
          currentView="results" 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
          username={username} 
          role={role}
        >
          <ResultsView 
            uploadedImage={uploadedImage} 
            onNavigate={navigateTo} 
            analysisData={analysisData} 
            patient={currentPatient} 
          />
        </DashboardLayout>
      );
      break;
    case 'history':
      currentViewComponent = (
        <DashboardLayout onNavigate={navigateTo} onLogout={handleLogout} currentView="history" darkMode={darkMode} toggleDarkMode={toggleDarkMode} username={username} role={role}>
          <HistoryView onNavigate={navigateTo} history={analysisHistory} />
        </DashboardLayout>
      );
      break;
    case 'analytics':
      currentViewComponent = (
        <DashboardLayout onNavigate={navigateTo} onLogout={handleLogout} currentView="analytics" darkMode={darkMode} toggleDarkMode={toggleDarkMode} username={username} role={role}>
          <AnalyticsView analysisData={analysisData} history={analysisHistory} />
        </DashboardLayout>
      );
      break;
    case 'patients':
      currentViewComponent = (
        <DashboardLayout onNavigate={navigateTo} onLogout={handleLogout} currentView="patients" darkMode={darkMode} toggleDarkMode={toggleDarkMode} username={username} role={role}>
          <PatientDirectory 
            onNavigate={navigateTo} 
            patients={patients} 
            refreshPatients={fetchPatients} 
            setSelectedPatientId={setSelectedPatientId}
          />
        </DashboardLayout>
      );
      break;
    case 'patient_detail':
      const detailPatient = patients.find(p => p.id === Number(selectedPatientId));
      currentViewComponent = (
        <DashboardLayout onNavigate={navigateTo} onLogout={handleLogout} currentView="patients" darkMode={darkMode} toggleDarkMode={toggleDarkMode} username={username} role={role}>
          <PatientDetailView 
            patient={detailPatient} 
            onNavigate={navigateTo} 
          />
        </DashboardLayout>
      );
      break;
    case 'compare':
      currentViewComponent = (
        <DashboardLayout onNavigate={navigateTo} onLogout={handleLogout} currentView="compare" darkMode={darkMode} toggleDarkMode={toggleDarkMode} username={username} role={role}>
          <ComparisonTool />
        </DashboardLayout>
      );
      break;
    case 'guidelines':
      currentViewComponent = (
        <DashboardLayout onNavigate={navigateTo} onLogout={handleLogout} currentView="guidelines" darkMode={darkMode} toggleDarkMode={toggleDarkMode} username={username} role={role}>
          <ClinicalGuidelines />
        </DashboardLayout>
      );
      break;
    case 'settings':
      currentViewComponent = (
        <DashboardLayout onNavigate={navigateTo} onLogout={handleLogout} currentView="settings" darkMode={darkMode} toggleDarkMode={toggleDarkMode} username={username} role={role}>
          <Settings />
        </DashboardLayout>
      );
      break;
    case 'profile':
      currentViewComponent = (
        <DashboardLayout onNavigate={navigateTo} onLogout={handleLogout} currentView="profile" darkMode={darkMode} toggleDarkMode={toggleDarkMode} username={username} role={role}>
          <ProfileView username={username} role={role} institution={institution} onLogout={handleLogout} />
        </DashboardLayout>
      );
      break;
    case 'help':
      currentViewComponent = (
        <DashboardLayout onNavigate={navigateTo} onLogout={handleLogout} currentView="help" darkMode={darkMode} toggleDarkMode={toggleDarkMode} username={username} role={role}>
          <HelpCenter />
        </DashboardLayout>
      );
      break;
    default:
      currentViewComponent = <Landing onNavigate={navigateTo} />;
  }

  return (
    <div className="app-container">
      {currentViewComponent}
    </div>
  )
}

export default App
