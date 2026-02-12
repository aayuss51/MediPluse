
import { User, Doctor, Patient, Session, Appointment, UserRole } from './types';

const INITIAL_DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Sarah Wilson', email: 'sarah@medpulse.com', role: UserRole.DOCTOR, specialty: 'Cardiology', avatar: 'https://picsum.photos/seed/doctor1/100/100' },
  { id: 'd2', name: 'Dr. James Chen', email: 'james@medpulse.com', role: UserRole.DOCTOR, specialty: 'Neurology', avatar: 'https://picsum.photos/seed/doctor2/100/100' },
  { id: 'd3', name: 'Dr. Demo Specialist', email: 'doctor@med.com', role: UserRole.DOCTOR, specialty: 'General Medicine', avatar: 'https://picsum.photos/seed/doctor3/100/100', bio: 'A dedicated healthcare professional providing excellence in clinical care and medical management.' }
];

const INITIAL_PATIENTS: Patient[] = [
  { id: 'p1', name: 'John Doe', email: 'john@gmail.com', role: UserRole.PATIENT, phone: '555-0199', avatar: 'https://picsum.photos/seed/patient1/100/100' },
  { id: 'p-aayush', name: 'Aayush', email: 'aayush12@gmail.com', role: UserRole.PATIENT, phone: '555-0888', avatar: 'https://ui-avatars.com/api/?name=Aayush&background=6366f1&color=fff', notifications: [] }
];

const INITIAL_SESSIONS: Session[] = [
  { id: 's1', doctorId: 'd1', doctorName: 'Dr. Sarah Wilson', date: '2024-06-20', startTime: '09:00', endTime: '12:00', maxPatients: 10, currentBookings: 1 },
  { id: 's2', doctorId: 'd3', doctorName: 'Dr. Demo Specialist', date: '2024-06-21', startTime: '10:00', endTime: '14:00', maxPatients: 8, currentBookings: 0 }
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: 'a1', sessionId: 's1', patientId: 'p1', patientName: 'John Doe', doctorId: 'd1', doctorName: 'Dr. Sarah Wilson', date: '2024-06-20', time: '09:30', status: 'approved' }
];

export const getStore = () => {
  const doctors = JSON.parse(localStorage.getItem('hms_doctors') || JSON.stringify(INITIAL_DOCTORS));
  const patients = JSON.parse(localStorage.getItem('hms_patients') || JSON.stringify(INITIAL_PATIENTS));
  const sessions = JSON.parse(localStorage.getItem('hms_sessions') || JSON.stringify(INITIAL_SESSIONS));
  const appointments = JSON.parse(localStorage.getItem('hms_appointments') || JSON.stringify(INITIAL_APPOINTMENTS));
  const currentUser = JSON.parse(localStorage.getItem('hms_current_user') || 'null');

  return { doctors, patients, sessions, appointments, currentUser };
};

export const saveStore = (data: any) => {
  if (data.doctors) localStorage.setItem('hms_doctors', JSON.stringify(data.doctors));
  if (data.patients) localStorage.setItem('hms_patients', JSON.stringify(data.patients));
  if (data.sessions) localStorage.setItem('hms_sessions', JSON.stringify(data.sessions));
  if (data.appointments) localStorage.setItem('hms_appointments', JSON.stringify(data.appointments));
  if (data.currentUser !== undefined) localStorage.setItem('hms_current_user', JSON.stringify(data.currentUser));
};
