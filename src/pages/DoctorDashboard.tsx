
import React, { useState, useEffect } from 'react';
import { Doctor, Appointment, Session, Patient, UserRole } from '../types';
import { 
  Clock, User, CheckCircle, XCircle, Trash2, Edit3, Mail, 
  ArrowLeft, Search, CalendarCheck, Stethoscope, Phone, 
  FileText, Briefcase, LogOut, Save, Shield, Loader2
} from 'lucide-react';

interface DoctorDashboardProps {
  doctor: Doctor;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  sessions: Session[];
  patients: Patient[];
  onDeleteAccount: () => void;
  onUpdateProfile: (data: Partial<Doctor>) => void;
  activeSection?: string;
  onSectionChange?: (id: string) => void;
  searchQuery?: string;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ 
  doctor, 
  appointments, 
  setAppointments, 
  sessions, 
  patients, 
  onDeleteAccount, 
  onUpdateProfile,
  activeSection,
  onSectionChange,
  searchQuery = ''
}) => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'sessions' | 'patients' | 'profile'>('appointments');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (activeSection) {
      if (activeSection === 'dash') setActiveTab('appointments');
      else if (activeSection === 'apps') setActiveTab('appointments');
      else if (activeSection === 'sessions') setActiveTab('sessions');
      else if (activeSection === 'profile') setActiveTab('profile');
      else setActiveTab(activeSection as any);
    }
  }, [activeSection]);

  const query = searchQuery.toLowerCase();
  const localQuery = localSearch.toLowerCase();

  const myAppointments = appointments.filter(a => 
    a.doctorId === doctor.id && 
    (a.status === 'approved' || a.status === 'completed' || a.status === 'pending') &&
    (a.patientName.toLowerCase().includes(query) || a.patientName.toLowerCase().includes(localQuery))
  );

  const handleUpdateStatus = (appId: string, status: Appointment['status']) => {
    setIsActionLoading(`status-${appId}`);
    setTimeout(() => {
      setAppointments(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
      setIsActionLoading(null);
    }, 600);
  };

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    setLocalSearch('');
    if (onSectionChange) {
      if (tab === 'appointments') onSectionChange('dash');
      else onSectionChange(tab);
    }
  };

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsActionLoading('profile-save');
    const formData = new FormData(e.currentTarget);
    const updatedData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      specialty: formData.get('specialty') as string,
      bio: formData.get('bio') as string,
    };
    
    setTimeout(() => {
      onUpdateProfile(updatedData);
      setIsEditingProfile(false);
      setSaveStatus('Profile updated successfully!');
      setIsActionLoading(null);
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl w-fit shadow-sm">
            {[
              { id: 'appointments', label: 'Visits' },
              { id: 'sessions', label: 'My Slots' },
              { id: 'patients', label: 'Patients' },
              { id: 'profile', label: 'Profile' }
            ].map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => handleTabClick(tab.id as any)} 
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {saveStatus && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-100 dark:border-emerald-800 font-bold text-center">
          {saveStatus}
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/30">
            <div>
              <h3 className="text-xl font-bold dark:text-white">Active Clinical Visits</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Daily queue management</p>
            </div>
            <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
              {myAppointments.length} Total
            </span>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {myAppointments.length === 0 ? (
              <div className="p-20 text-center text-slate-400">
                <CalendarCheck className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="font-bold">No clinical visits today.</p>
              </div>
            ) : (
              myAppointments.map(app => (
                <div key={app.id} className="p-8 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 group transition-all">
                  <div className="flex items-center space-x-6">
                    <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg">{app.patientName}</h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center"><Clock className="w-3 h-3 mr-1" /> {app.date} • {app.time}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          app.status === 'approved' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>{app.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {app.status === 'approved' && (
                      <div className="flex space-x-2">
                        <button 
                          disabled={!!isActionLoading}
                          onClick={() => handleUpdateStatus(app.id, 'completed')} 
                          className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-lg flex items-center space-x-2 transition-all disabled:opacity-50"
                        >
                          {isActionLoading === `status-${app.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          <span>Complete</span>
                        </button>
                      </div>
                    )}
                    {app.status === 'completed' && (
                      <span className="flex items-center space-x-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl">
                        <CheckCircle className="w-4 h-4" />
                        <span>Finished</span>
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-8">
              {isEditingProfile ? (
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input name="name" defaultValue={doctor.name} placeholder="Full Name" required className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl border-none font-bold" />
                    <input name="specialty" defaultValue={doctor.specialty} placeholder="Specialty" required className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl border-none font-bold" />
                  </div>
                  <textarea name="bio" defaultValue={doctor.bio} rows={4} placeholder="About you..." className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl border-none font-medium resize-none" />
                  <div className="flex space-x-4 pt-6">
                    <button type="button" onClick={() => setIsEditingProfile(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold">Cancel</button>
                    <button 
                      disabled={isActionLoading === 'profile-save'}
                      type="submit" 
                      className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {isActionLoading === 'profile-save' && <Loader2 className="w-5 h-5 animate-spin" />}
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-10">
                   <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{doctor.name}</h3>
                      <button onClick={() => setIsEditingProfile(true)} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100"><Edit3 className="w-5 h-5" /></button>
                   </div>
                   <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-3xl">
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{doctor.bio || 'Add a professional bio to your profile.'}</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
