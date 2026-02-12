
import React, { useState, useEffect } from 'react';
import { Patient, Appointment, Doctor, Session, Notification } from '../types';
import { 
  Calendar, Clock, User, Heart, Search, ChevronRight, AlertCircle, 
  Trash2, Edit3, Mail, Phone, ArrowLeft, CheckCircle, Save, 
  Stethoscope, Bell, Info, XCircle, ShieldCheck, CreditCard, Droplets, Loader2,
  CalendarDays, UserCircle
} from 'lucide-react';

interface PatientDashboardProps {
  patient: Patient;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  doctors: Doctor[];
  sessions: Session[];
  onDeleteAccount: () => void;
  onUpdateProfile: (data: Partial<Patient>) => void;
  activeSection?: string;
  onSectionChange?: (id: string) => void;
  searchQuery?: string;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ 
  patient, 
  appointments, 
  setAppointments, 
  doctors, 
  sessions, 
  onDeleteAccount, 
  onUpdateProfile,
  activeSection,
  onSectionChange,
  searchQuery = ''
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'book' | 'history' | 'profile' | 'notifications'>('overview');
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<Appointment | null>(null);
  const [localSearch, setLocalSearch] = useState('');
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (activeSection) {
      if (activeSection === 'dash') setActiveTab('overview');
      else if (activeSection === 'new') setActiveTab('book');
      else if (activeSection === 'past') setActiveTab('history');
      else if (activeSection === 'notifications') setActiveTab('notifications');
      else if (activeSection === 'profile') setActiveTab('profile');
      else setActiveTab(activeSection as any);
    }
  }, [activeSection]);

  const handleBook = (session: Session) => {
    setIsActionLoading(`book-${session.id}`);
    setTimeout(() => {
      const newApp: Appointment = {
        id: Math.random().toString(36).substr(2, 9),
        sessionId: session.id,
        patientId: patient.id,
        patientName: patient.name,
        doctorId: session.doctorId,
        doctorName: session.doctorName,
        date: session.date,
        time: session.startTime,
        status: 'pending' 
      };
      setAppointments([...appointments, newApp]);
      setBookingConfirmation(newApp);
      setIsActionLoading(null);
    }, 1000);
  };

  const handleHealthUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsActionLoading('health-update');
    const formData = new FormData(e.currentTarget);
    const data = {
      bloodGroup: formData.get('bloodGroup') as string,
      insuranceId: formData.get('insuranceId') as string,
      currentProblem: formData.get('currentProblem') as string,
    };
    
    setTimeout(() => {
      onUpdateProfile(data);
      setIsEditingHealth(false);
      setIsActionLoading(null);
    }, 800);
  };

  const handleAccountUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsActionLoading('account-update');
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
    };
    
    setTimeout(() => {
      onUpdateProfile(data);
      setIsEditingAccount(false);
      setIsActionLoading(null);
    }, 1000);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsActionLoading('delete-account');
      setTimeout(() => {
        onDeleteAccount();
        setIsActionLoading(null);
      }, 1500);
    }
  };

  const handleTabClick = (tab: any) => {
    if (isActionLoading) return;
    setActiveTab(tab);
    setLocalSearch(''); 
    if (onSectionChange) {
      if (tab === 'overview') onSectionChange('dash');
      else if (tab === 'book') onSectionChange('new');
      else if (tab === 'history') onSectionChange('past');
      else onSectionChange(tab);
    }
  };

  const myBookings = appointments.filter(a => a.patientId === patient.id);
  
  const filteredSessions = sessions.filter(s => 
    (s.doctorName.toLowerCase().includes(localSearch.toLowerCase()) || 
     doctors.find(d => d.id === s.doctorId)?.specialty.toLowerCase().includes(localSearch.toLowerCase()))
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Bar */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-800 dark:to-violet-800 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-bold mb-3 tracking-tight">Welcome, {patient.name}</h2>
            <p className="text-indigo-100 text-lg opacity-90 max-w-lg font-medium">MedPulse is one of the Trusted health care center for your total cure</p>
          </div>
          <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/10 flex items-center justify-center"><ShieldCheck className="w-12 h-12" /></div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex space-x-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl w-fit shadow-sm">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'book', label: 'New Booking' },
            { id: 'history', label: 'My Bookings' },
            { id: 'profile', label: 'Profile' }
          ].map((tab) => (
            <button 
              key={tab.id} 
              disabled={!!isActionLoading}
              onClick={() => handleTabClick(tab.id as any)} 
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50 ${
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

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Medical Snapshot</h3>
              <button disabled={!!isActionLoading} onClick={() => setIsEditingHealth(true)} className="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center space-x-1 disabled:opacity-50">
                <Edit3 className="w-4 h-4" />
                <span>Update</span>
              </button>
            </div>
            {isEditingHealth ? (
              <form onSubmit={handleHealthUpdate} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Blood Group</label>
                    <input 
                      name="bloodGroup" 
                      disabled={!!isActionLoading} 
                      defaultValue={patient.bloodGroup} 
                      placeholder="e.g. O+" 
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Insurance ID</label>
                    <input 
                      name="insuranceId" 
                      disabled={!!isActionLoading} 
                      defaultValue={patient.insuranceId} 
                      placeholder="Policy ID" 
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Medical Issue</label>
                  <textarea 
                    name="currentProblem" 
                    disabled={!!isActionLoading} 
                    defaultValue={patient.currentProblem} 
                    placeholder="Briefly describe any symptoms..." 
                    rows={2} 
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 rounded-xl text-sm font-medium border-none resize-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                  />
                </div>
                <div className="flex space-x-3">
                  <button type="button" disabled={!!isActionLoading} onClick={() => setIsEditingHealth(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-xs transition-colors">Cancel</button>
                  <button disabled={!!isActionLoading} type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 disabled:opacity-50 transition-all">
                    {isActionLoading === 'health-update' && <Loader2 className="w-3 h-3 animate-spin" />}
                    <span>{isActionLoading === 'health-update' ? 'Saving...' : 'Save Update'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-50 dark:border-slate-700">
                  <div className="flex items-center space-x-3"><Droplets className="w-5 h-5 text-rose-500" /><span className="font-bold text-slate-700 dark:text-slate-300">Blood Group</span></div>
                  <span className="font-extrabold text-slate-900 dark:text-white">{patient.bloodGroup || 'Not Set'}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-50 dark:border-slate-700">
                  <div className="flex items-center space-x-3"><CreditCard className="w-5 h-5 text-indigo-500" /><span className="font-bold text-slate-700 dark:text-slate-300">Insurance ID</span></div>
                  <span className="font-extrabold text-slate-900 dark:text-white">{patient.insuranceId || 'Not Set'}</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-50 dark:border-slate-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Reported Note</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium italic">
                    {patient.currentProblem || 'No active symptoms reported.'}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleTabClick('book')}
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-left hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <h4 className="font-bold mb-1 dark:text-white">Book Slot</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Schedule new visit</p>
              </button>
              <button 
                onClick={() => handleTabClick('history')}
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-left hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h4 className="font-bold mb-1 dark:text-white">My Records</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">View past history</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'book' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
          {filteredSessions.map(session => (
            <div key={session.id} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
              <h4 className="font-bold text-lg mb-4 text-slate-900 dark:text-white relative z-10">{session.doctorName}</h4>
              <div className="text-slate-500 dark:text-slate-400 text-sm mb-8 relative z-10">
                 <div className="flex items-center space-x-2"><Calendar className="w-4 h-4 opacity-50" /><span>{session.date}</span></div>
                 <div className="flex items-center space-x-2 mt-1.5"><Clock className="w-4 h-4 opacity-50" /><span>{session.startTime} - {session.endTime}</span></div>
              </div>
              <button 
                disabled={!!isActionLoading || session.currentBookings >= session.maxPatients}
                onClick={() => handleBook(session)} 
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 disabled:opacity-50 transition-all active:scale-[0.98] shadow-lg shadow-indigo-100 dark:shadow-none"
              >
                {isActionLoading === `book-${session.id}` ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <span>{session.currentBookings >= session.maxPatients ? 'Session Full' : 'Request Appointment'}</span>
              </button>
            </div>
          ))}
          {filteredSessions.length === 0 && (
             <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-20 dark:text-white" />
                <p className="font-bold text-slate-400">No matching slots available.</p>
             </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800">
            <h3 className="text-xl font-bold dark:text-white">Appointment History</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Review your clinical visits</p>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {myBookings.length === 0 ? (
              <div className="p-20 text-center">
                <CalendarDays className="w-16 h-16 mx-auto mb-4 opacity-10 dark:text-white" />
                <p className="text-slate-400 font-bold">You haven't booked any appointments yet.</p>
                <button 
                  onClick={() => handleTabClick('book')}
                  className="mt-4 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  Find a Doctor
                </button>
              </div>
            ) : (
              myBookings.map(app => (
                <div key={app.id} className="p-8 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 group transition-all">
                  <div className="flex items-center space-x-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm ${
                      app.status === 'approved' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' :
                      app.status === 'completed' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                      'bg-slate-50 dark:bg-slate-800 text-slate-400'
                    }`}>
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg">Dr. {app.doctorName}</h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                          <Clock className="w-3 h-3 mr-1" /> {app.date} • {app.time}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          app.status === 'approved' ? 'bg-indigo-50 text-indigo-600' : 
                          app.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                          app.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                          'bg-rose-50 text-rose-600'
                        }`}>{app.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</p>
                    <p className={`font-black text-sm uppercase ${
                      app.status === 'approved' ? 'text-indigo-600' : 
                      app.status === 'completed' ? 'text-emerald-600' : 
                      'text-slate-400'
                    }`}>{app.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
                    <UserCircle className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Patient Profile</h3>
                </div>
                {!isEditingAccount && (
                   <button 
                    disabled={!!isActionLoading} 
                    onClick={() => setIsEditingAccount(true)} 
                    className="p-3 bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-2xl hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
                   >
                      <Edit3 className="w-5 h-5" />
                   </button>
                )}
              </div>
              
              {isEditingAccount ? (
                <form onSubmit={handleAccountUpdate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                    <input 
                      name="name" 
                      disabled={!!isActionLoading} 
                      defaultValue={patient.name} 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      name="email" 
                      type="email" 
                      disabled={!!isActionLoading} 
                      defaultValue={patient.email} 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Contact</label>
                    <input 
                      name="phone" 
                      disabled={!!isActionLoading} 
                      defaultValue={patient.phone} 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <button type="button" disabled={!!isActionLoading} onClick={() => setIsEditingAccount(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-sm">Cancel</button>
                    <button disabled={!!isActionLoading} type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm flex items-center justify-center space-x-2 disabled:opacity-50">
                      {isActionLoading === 'account-update' && <Loader2 className="w-5 h-5 animate-spin" />}
                      <span>Save Profile</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl flex items-center space-x-6 border border-slate-50 dark:border-slate-800">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm"><Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /></div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Email Address</p>
                      <p className="font-bold text-lg text-slate-900 dark:text-white">{patient.email}</p>
                    </div>
                  </div>
                  <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl flex items-center space-x-6 border border-slate-50 dark:border-slate-800">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm"><Phone className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /></div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Phone Number</p>
                      <p className="font-bold text-lg text-slate-900 dark:text-white">{patient.phone || 'No phone linked'}</p>
                    </div>
                  </div>
                  
                  <div className="pt-10 border-t border-slate-100 dark:border-slate-800 mt-4">
                    <button 
                      onClick={handleDelete}
                      disabled={!!isActionLoading}
                      className="w-full py-5 bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 rounded-3xl font-black text-sm flex items-center justify-center space-x-3 hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-all disabled:opacity-50"
                    >
                      {isActionLoading === 'delete-account' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                      <span>Permanently Delete Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {bookingConfirmation && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] p-10 shadow-2xl text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
               <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Request Submitted</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">Your appointment request with <b>{bookingConfirmation.doctorName}</b> is pending review by our Med Team.</p>
            <button onClick={() => { setBookingConfirmation(null); handleTabClick('history'); }} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black transition-all hover:bg-indigo-700 active:scale-95 shadow-2xl shadow-indigo-100 dark:shadow-none">Return to Bookings</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
