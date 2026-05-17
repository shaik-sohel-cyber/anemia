import { Activity, Home, BarChart2, Clock, Settings, LogOut, Bell, User, Sun, Moon, Users, Shield, HelpCircle } from 'lucide-react';

const DashboardLayout = ({ children, onNavigate, onLogout, currentView, darkMode, toggleDarkMode, username, role }) => {
  const isDoctor = role === 'Radiologist';

  const menuItems = [
    { id: 'dashboard', label: isDoctor ? 'Dashboard' : 'My Analysis', icon: <Home size={20} />, views: ['dashboard', 'upload', 'analysis', 'results'], show: true },
    { id: 'patients', label: 'Patient Registry', icon: <Users size={20} />, views: ['patients'], show: isDoctor },
    { id: 'compare', label: 'Compare Scans', icon: <Activity size={20} />, views: ['compare'], show: isDoctor },
    { id: 'analytics', label: 'QC Dashboard', icon: <BarChart2 size={20} />, views: ['analytics'], show: isDoctor },
    { id: 'history', label: isDoctor ? 'Scan History' : 'My Records', icon: <Clock size={20} />, views: ['history'], show: true },
  ].filter(item => item.show);

  const secondaryItems = [
    { id: 'guidelines', label: 'Guidelines', icon: <Shield size={20} />, views: ['guidelines'] },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, views: ['settings'] },
    { id: 'help', label: 'Help Center', icon: <HelpCircle size={20} />, views: ['help'] },
  ];

  return (
    <div className="layout-wrapper">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Activity size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">GeoProteoNet</h1>
        </div>

        <div className="sidebar-nav" style={{ flex: 1 }}>
          <p className="text-xs font-bold text-subtle uppercase tracking-widest mb-3 px-3">Main Diagnostics</p>
          {menuItems.map(item => (
            <div 
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-item ${item.views.includes(currentView) ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}

          <p className="text-xs font-bold text-subtle uppercase tracking-widest mb-3 mt-8 px-3">Clinical Support</p>
          {secondaryItems.map(item => (
            <div 
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-item ${item.views.includes(currentView) ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-[var(--border)]">
          <div className="nav-item text-danger hover:bg-danger/10 group cursor-pointer transition-all" onClick={onLogout || (() => onNavigate('landing'))}>
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-bold">Sign Out Workstation</span>
          </div>
        </div>
      </aside>

      {/* Main App Content Area */}
      <main className="main-content">
        <header className="flex items-center justify-between mb-8 animate-in">
          <div>
            <h2 className="text-3xl font-bold mb-1">
              {menuItems.find(i => i.views.includes(currentView))?.label || 'Diagnostics'}
            </h2>
            <p className="text-muted text-sm">{isDoctor ? 'Clinical Station' : 'Personal Results Portal'} • Welcome back, {username?.split(' ')[1] || 'User'}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="glass flex items-center gap-1 p-1 rounded-full border border-[var(--border)]">
              <button 
                onClick={() => darkMode && toggleDarkMode()} 
                className={`btn btn-ghost p-2 rounded-full ${!darkMode ? 'bg-white shadow-sm text-brand' : ''}`}
              >
                <Sun size={18} />
              </button>
              <button 
                onClick={() => !darkMode && toggleDarkMode()} 
                className={`btn btn-ghost p-2 rounded-full ${darkMode ? 'bg-[var(--surface-alt)] shadow-sm text-brand' : ''}`}
              >
                <Moon size={18} />
              </button>
            </div>

            <button className="btn btn-secondary p-3 rounded-xl relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-danger border-2 border-[var(--surface)] rounded-full"></span>
            </button>

            <div 
              className="flex items-center gap-3 pl-2 cursor-pointer group hover:opacity-80 transition-all"
              onClick={() => onNavigate('profile')}
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-tight group-hover:text-brand transition-colors">{username || 'Dr. Sarah Connor'}</p>
                <p className="text-xs text-muted">{role || 'Radiologist'}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center color-white shadow-brand group-hover:scale-105 transition-transform">
                <User size={20} color="white" />
              </div>
            </div>
          </div>
        </header>

        <div className="animate-in stagger-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
