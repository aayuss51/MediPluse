
import React, { useState, useEffect } from 'react';
import { Doctor, Session, Patient, Appointment, UserRole, Notification } from '../types';
import { 
  Plus, Edit2, Trash2, Calendar, Users, ClipboardCheck, ArrowUpRight, 
  ArrowLeft, Search, Eye, Phone, Info, XCircle, User as UserIcon, 
  ListChecks, CheckCircle2, Clock, Mail, ShieldAlert, Loader2,
  CalendarDays, UserCircle, MapPin
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  doctors: Doctor[];
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>;
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  sessions: Session[];
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  activeSection?: string;
  onSectionChange?: (id: string) => void;
  searchQuery?: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  doctors, 
  setDoctors, 
  patients,
  setPatients,
  sessions, 
  setSessions, 
  appointments,
  setAppointments,
  activeSection,
  onSectionChange,
  searchQuery = ''
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'doctors' | 'sessions' | 'patients' | 'bookings'>('stats');
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showSessionBookingsModal, setShowSessionBookingsModal] = useState<Session | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [localSearch, setLocalSearch] = useState('');
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (activeSection) {
      if (activeSection === 'dash') setActiveTab('stats');
      else if (activeSection === 'doctors' || activeSection === 'sessions' || activeSection === 'patients' || activeSection === 'bookings') setActiveTab(activeSection);
      else setActiveTab('stats');
    }
  }, [activeSection]);

  const stats = [
    { label: 'Total Doctors', value: doctors.length, icon: Users, color: 'bg-indigo-500' },
    { label: 'Total Patients', value: patients.length, icon: ClipboardCheck, color: 'bg-emerald-500' },
    { label: 'Active Sessions', value: sessions.length, icon: Calendar, color: 'bg-amber-500' },
    { label: 'Appointments', value: appointments.length, icon: ArrowUpRight, color: 'bg-rose-500' },
  ];

  const handleApproveBooking = (appointment: Appointment) => {
    setIsActionLoading(`approve-${appointment.id}`);
    setTimeout(() => {
      setAppointments(prev => prev.map(a => a.id === appointment.id ? { ...a, status: 'approved' } : a));
      
      // Update session currentBookings
      setSessions(prev => prev.map(s => s.id === appointment.sessionId ? { ...s, currentBookings: s.currentBookings + 1 } : s));

      const newNotif: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        message: `Good news! Your booking with ${appointment.doctorName} on ${appointment.date} has been APPROVED.`,
        date: new Date().toLocaleString(),
        isRead: false,
        type: 'success'
      };
      setPatients(prev => prev.map(p => p.id === appointment.patientId ? { 
        ...p, 
        notifications: [newNotif, ...(p.notifications || [])] 
      } : p));
      setIsActionLoading(null);
    }, 600);
  };

  const handleRejectBooking = (appointment: Appointment) => {
    setIsActionLoading(`reject-${appointment.id}`);
    setTimeout(() => {
      setAppointments(prev => prev.map(a => a.id === appointment.id ? { ...a, status: 'cancelled' } : a));
      setIsActionLoading(null);
    }, 600);
  };

  const query = searchQuery.toLowerCase();
  const localQuery = localSearch.toLowerCase();

  const filteredDoctors = doctors.filter(d => 
    (d.name.toLowerCase().includes(query) || d.specialty.toLowerCase().includes(query)) &&
    (d.name.toLowerCase().includes(localQuery))
  );

  const filteredSessions = sessions.filter(s => 
    (s.doctorName.toLowerCase().includes(query) || s.date.toLowerCase().includes(query)) &&
    (s.doctorName.toLowerCase().includes(localQuery))
  );

  const filteredPatients = patients.filter(p => 
    (p.name.toLowerCase().includes(query) || p.email.toLowerCase().includes(query)) &&
    (p.name.toLowerCase().includes(localQuery))
  );

  const filteredAppointments = appointments.filter(a => 
    (a.patientName.toLowerCase().includes(query) || a.doctorName.toLowerCase().includes(query)) &&
    (a.patientName.toLowerCase().includes(localQuery))
  ).sort((a, b) => (a.status === 'pending' ? -1 : 1));

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    setLocalSearch('');
    if (onSectionChange) {
      onSectionChange(tab === 'stats' ? 'dash' : tab);
    }
  };

  const handleAddOrUpdateDoctor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsActionLoading('doctor-modal');
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const specialty = formData.get('specialty') as string;
    const phone = formData.get('phone') as string;

    setTimeout(() => {
      if (editingDoctor) {
        setDoctors(prev => prev.map(d => d.id === editingDoctor.id ? { ...d, name, email, specialty, phone } : d));
      } else {
        const newDoc: Doctor = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          specialty,
          phone,
          role: UserRole.DOCTOR,
          avatar: `https://ui-avatars.com/api/?name=${name}&background=random`
        };
        setDoctors([...doctors, newDoc]);
      }
      setShowDoctorModal(false);
      setEditingDoctor(null);
      setIsActionLoading(null);
    }, 800);
  };

  const handleAddSession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsActionLoading('session-modal');
    const formData = new FormData(e.currentTarget);
    const doctorId = formData.get('doctorId') as string;
    const doctor = doctors.find(d => d.id === doctorId);
    
    setTimeout(() => {
      const newSession: Session = {
        id: Math.random().toString(36).substr(2, 9),
        doctorId,
        doctorName: doctor?.name || 'Unknown',
        date: formData.get('date') as string,
        startTime: formData.get('startTime') as string,
        endTime: formData.get('endTime') as string,
        maxPatients: parseInt(formData.get('maxPatients') as string),
        currentBookings: 0,
      };
      setSessions([...sessions, newSession]);
      setShowSessionModal(false);
      setIsActionLoading(null);
    }, 800);
  };

  const getSessionPatients = (sessionId: string) => {
    return appointments.filter(a => a.sessionId === sessionId && a.status !== 'cancelled');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl w-fit shadow-sm">
            {['stats', 'doctors', 'sessions', 'patients', 'bookings'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => handleTabClick(tab as any)} 
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'stats' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4 transition-all hover:shadow-lg">
                <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm h-[400px]">
            <h3 className="text-xl font-bold mb-8 dark:text-white">Facility Traffic Overview</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                {name: 'Mon', apps: 12}, {name: 'Tue', apps: 19}, {name: 'Wed', apps: 15}, 
                {name: 'Thu', apps: 22}, {name: 'Fri', apps: 30}, {name: 'Sat', apps: 10}, {name: 'Sun', apps: 5}
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="apps" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'doctors' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 transition-colors">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold dark:text-white">Medical Staff Roster</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage specialist profiles</p>
            </div>
            <button 
              disabled={!!isActionLoading}
              onClick={() => { setEditingDoctor(null); setShowDoctorModal(true); }} 
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center space-x-2 text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              <span>Register Doctor</span>
            </button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr><th className="px-8 py-5">Physician</th><th className="px-8 py-5">Specialty</th><th className="px-8 py-5">Contact</th><th className="px-8 py-5 text-right pr-12">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDoctors.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-8 py-6 flex items-center space-x-4">
                    <img src={doc.avatar} className="w-10 h-10 rounded-2xl border border-slate-100 dark:border-slate-700" alt="" />
                    <span className="font-bold text-slate-900 dark:text-white">{doc.name}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-xl text-xs font-black uppercase">{doc.specialty}</span>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-600 dark:text-slate-400 font-medium">
                    <div className="flex flex-col">
                        <span>{doc.email}</span>
                        <span className="text-[10px] font-bold text-slate-400">{doc.phone || 'No phone'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right pr-8">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => { setEditingDoctor(doc); setShowDoctorModal(true); }} className="p-2.5 text-slate-400 hover:text-indigo-600 rounded-xl transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => setDoctors(doctors.filter(d => d.id !== doc.id))} className="p-2.5 text-slate-400 hover:text-red-600 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 transition-colors">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold dark:text-white">Clinical Session Slots</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Plan doctor availability</p>
            </div>
            <button 
              disabled={!!isActionLoading}
              onClick={() => setShowSessionModal(true)} 
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center space-x-2 text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              <span>Create Session</span>
            </button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr><th className="px-8 py-5">Physician</th><th className="px-8 py-5">Date</th><th className="px-8 py-5">Timing</th><th className="px-8 py-5">Occupancy</th><th className="px-8 py-5 text-right pr-12">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSessions.map(session => (
                <tr key={session.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-8 py-6 font-bold text-slate-900 dark:text-white">{session.doctorName}</td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-600 dark:text-slate-400">{session.date}</td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{session.startTime} - {session.endTime}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(session.currentBookings / session.maxPatients) * 100}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-500">{session.currentBookings}/{session.maxPatients}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right pr-8">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => setShowSessionBookingsModal(session)} title="View Live List" className="p-2.5 text-slate-400 hover:text-indigo-600 rounded-xl transition-colors"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => setSessions(sessions.filter(s => s.id !== session.id))} className="p-2.5 text-slate-400 hover:text-red-600 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'patients' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 transition-colors">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800">
            <h3 className="text-xl font-bold dark:text-white">Patient Directory</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Review registered users</p>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr><th className="px-8 py-5">Patient Name</th><th className="px-8 py-5">Email</th><th className="px-8 py-5">Phone</th><th className="px-8 py-5 text-right pr-12">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPatients.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-8 py-6 flex items-center space-x-4">
                    <img src={p.avatar || `https://ui-avatars.com/api/?name=${p.name}`} className="w-10 h-10 rounded-2xl border border-slate-100 dark:border-slate-700" alt="" />
                    <span className="font-bold text-slate-900 dark:text-white">{p.name}</span>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-slate-600 dark:text-slate-400">{p.email}</td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-500">{p.phone || '--'}</td>
                  <td className="px-8 py-6 text-right pr-8">
                    <button onClick={() => setPatients(patients.filter(pat => pat.id !== p.id))} className="p-2.5 text-slate-400 hover:text-red-600 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 transition-colors">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800">
             <h3 className="text-xl font-bold dark:text-white">Appointment Authorization</h3>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Verify patient requests</p>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr><th className="px-8 py-5">Patient</th><th className="px-8 py-5">Doctor</th><th className="px-8 py-5">Slot</th><th className="px-8 py-5">Status</th><th className="px-8 py-5 text-right pr-12">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAppointments.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-8 py-6 font-bold dark:text-white">{a.patientName}</td>
                  <td className="px-8 py-6 font-bold text-indigo-600 dark:text-indigo-400">{a.doctorName}</td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">{a.date} • {a.time}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${
                        a.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                        a.status === 'approved' ? 'bg-indigo-50 text-indigo-600' :
                        a.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-rose-50 text-rose-600'
                    }`}>{a.status}</span>
                  </td>
                  <td className="px-8 py-6 text-right pr-8">
                    {a.status === 'pending' && (
                      <div className="flex justify-end space-x-2">
                        <button 
                          disabled={!!isActionLoading}
                          onClick={() => handleApproveBooking(a)} 
                          className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50 flex items-center space-x-2 transition-all hover:bg-emerald-700"
                        >
                          {isActionLoading === `approve-${a.id}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                          <span>Authorize</span>
                        </button>
                        <button 
                          disabled={!!isActionLoading}
                          onClick={() => handleRejectBooking(a)} 
                          className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50 flex items-center space-x-2 transition-all hover:bg-rose-100"
                        >
                          {isActionLoading === `reject-${a.id}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-4 h-4" />}
                          <span>Decline</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Doctor Modals */}
      {showDoctorModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <form onSubmit={handleAddOrUpdateDoctor} className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[40px] p-10 space-y-6 shadow-2xl">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{editingDoctor ? 'Update Staff' : 'Register Doctor'}</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-1 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input name="name" defaultValue={editingDoctor?.name} placeholder="Name" required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="col-span-1 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specialty</label>
                <input name="specialty" defaultValue={editingDoctor?.specialty} placeholder="Specialty" required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input name="email" type="email" defaultValue={editingDoctor?.email} placeholder="Email" required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div className="flex space-x-4 pt-4">
              <button type="button" onClick={() => setShowDoctorModal(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold transition-colors">Cancel</button>
              <button disabled={isActionLoading === 'doctor-modal'} type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all hover:bg-indigo-700">
                {isActionLoading === 'doctor-modal' && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>{editingDoctor ? 'Update Info' : 'Register Staff'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <form onSubmit={handleAddSession} className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] p-10 space-y-6 shadow-2xl">
            <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl"><CalendarDays className="w-6 h-6" /></div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">New Session</h3>
            </div>
            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Physician</label>
                <select name="doctorId" required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
                    {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Consultation Date</label>
                <input name="date" type="date" required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
                    <input name="startTime" type="time" required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Time</label>
                    <input name="endTime" type="time" required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient Capacity</label>
                <input name="maxPatients" type="number" defaultValue={10} min={1} required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div className="flex space-x-4 pt-4">
              <button type="button" onClick={() => setShowSessionModal(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold transition-colors">Cancel</button>
              <button disabled={isActionLoading === 'session-modal'} type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all hover:bg-indigo-700">
                {isActionLoading === 'session-modal' && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>Publish Slot</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Session Patient List Modal (Live List) */}
      {showSessionBookingsModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in zoom-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
            <button onClick={() => setShowSessionBookingsModal(null)} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-rose-600 transition-colors">
                <XCircle className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4 mb-8">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-3xl"><ListChecks className="w-8 h-8" /></div>
                <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Live Patient List</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{showSessionBookingsModal.doctorName} • {showSessionBookingsModal.date}</p>
                </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3">
                {getSessionPatients(showSessionBookingsModal.id).length === 0 ? (
                    <div className="py-20 text-center text-slate-400">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-10" />
                        <p className="font-bold">No patients booked for this session yet.</p>
                    </div>
                ) : (
                    getSessionPatients(showSessionBookingsModal.id).map(app => (
                        <div key={app.id} className="p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-between border border-slate-50 dark:border-slate-700 transition-all hover:border-indigo-200">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-indigo-600 font-bold shadow-sm">
                                    <UserIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">{app.patientName}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{app.time}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                app.status === 'approved' ? 'bg-indigo-100 text-indigo-600' : 
                                app.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                                'bg-slate-200 text-slate-500'
                            }`}>{app.status}</span>
                        </div>
                    ))
                )}
            </div>
            
            <button onClick={() => setShowSessionBookingsModal(null)} className="w-full mt-8 py-5 bg-indigo-600 text-white rounded-3xl font-black transition-all hover:bg-indigo-700 active:scale-95">Dismiss View</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
