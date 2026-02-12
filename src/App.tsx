
import React, { useState, useEffect } from 'react';
import { User, UserRole, Doctor, Patient, Session, Appointment } from './types';
import { getStore, saveStore } from './store';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { Loader2, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [view, setView] = useState<'login' | 'signup' | 'dashboard'>('login');
  const [activeTab, setActiveTab] = useState<string>('dash');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('hms_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Sync dark mode class
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hms_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hms_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const store = getStore();
      setDoctors(store.doctors);
      setPatients(store.patients);
      setSessions(store.sessions);
      setAppointments(store.appointments);
      if (store.currentUser) {
        setCurrentUser(store.currentUser);
        setView('dashboard');
      }
      setIsAppLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAppLoading) {
      saveStore({ doctors, patients, sessions, appointments, currentUser });
    }
  }, [doctors, patients, sessions, appointments, currentUser, isAppLoading]);

  const handleLogin = (user: User) => {
    setIsAppLoading(true);
    setTimeout(() => {
      setCurrentUser(user);
      setView('dashboard');
      setActiveTab('dash');
      setSearchQuery('');
      setIsAppLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    setIsAppLoading(true);
    setTimeout(() => {
      setCurrentUser(null);
      setView('login');
      setActiveTab('dash');
      setSearchQuery('');
      setIsAppLoading(false);
    }, 600);
  };

  const handleDeleteAccount = (userId: string) => {
    if (currentUser?.role === UserRole.DOCTOR) {
      setDoctors(prev => prev.filter(d => d.id !== userId));
    } else {
      setPatients(prev => prev.filter(p => p.id !== userId));
    }
    handleLogout();
  };

  const handleUpdateProfile = (updated: Partial<User>) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const newUser = { ...prev, ...updated };
      
      if (newUser.role === UserRole.DOCTOR) {
        setDoctors(docs => docs.map(d => d.id === newUser.id ? newUser as Doctor : d));
      } else if (newUser.role === UserRole.PATIENT) {
        setPatients(pats => pats.map(p => p.id === newUser.id ? newUser as Patient : p));
      }
      
      return newUser;
    });
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  if (isAppLoading) {
    return (
      <div className={`h-screen w-full flex flex-col items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
          <div className="relative bg-indigo-600 p-5 rounded-[2.5rem] shadow-2xl mb-8">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
        </div>
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-sm font-black uppercase tracking-[0.3em] opacity-40">Initializing MedPulse</p>
      </div>
    );
  }

  const currentPatientUser = patients.find(p => p.id === currentUser?.id);
  const unreadNotifications = currentPatientUser?.notifications?.filter(n => !n.isRead).length || 0;

  if (view === 'login') return <Login onLogin={handleLogin} onSwitchToSignup={() => setView('signup')} />;
  if (view === 'signup') return <Signup onSignup={handleLogin} onSwitchToLogin={() => setView('login')} />;

  return (
    <div className={`flex h-screen transition-colors ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      <Sidebar 
        role={currentUser?.role || UserRole.PATIENT} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={handleLogout} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={currentUser!} 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
          unreadCount={unreadNotifications}
          onOpenNotifications={() => setActiveTab('notifications')}
          onToggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 dark:bg-slate-950">
          {currentUser?.role === UserRole.ADMIN && (
            <AdminDashboard 
              doctors={doctors} 
              setDoctors={setDoctors} 
              patients={patients} 
              setPatients={setPatients}
              sessions={sessions} 
              setSessions={setSessions}
              appointments={appointments}
              setAppointments={setAppointments}
              activeSection={activeTab}
              onSectionChange={setActiveTab}
              searchQuery={searchQuery}
            />
          )}
          {currentUser?.role === UserRole.DOCTOR && (
            <DoctorDashboard 
              doctor={currentUser as Doctor} 
              appointments={appointments} 
              setAppointments={setAppointments}
              sessions={sessions}
              patients={patients}
              onDeleteAccount={() => handleDeleteAccount(currentUser.id)}
              onUpdateProfile={handleUpdateProfile}
              activeSection={activeTab}
              onSectionChange={setActiveTab}
              searchQuery={searchQuery}
            />
          )}
          {currentUser?.role === UserRole.PATIENT && (
            <PatientDashboard 
              patient={currentPatientUser || (currentUser as Patient)} 
              appointments={appointments} 
              setAppointments={setAppointments}
              doctors={doctors}
              sessions={sessions}
              onDeleteAccount={() => handleDeleteAccount(currentUser.id)}
              onUpdateProfile={handleUpdateProfile}
              activeSection={activeTab}
              onSectionChange={setActiveTab}
              searchQuery={searchQuery}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
