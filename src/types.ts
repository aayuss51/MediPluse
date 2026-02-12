
export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  specialty?: string;
  phone?: string;
  avatar?: string;
}

export interface Doctor extends User {
  specialty: string;
  bio?: string;
}

export interface Notification {
  id: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'info' | 'success' | 'error';
}

export interface Patient extends User {
  dob?: string;
  medicalHistory?: string[];
  bloodGroup?: string;
  insuranceId?: string;
  currentProblem?: string;
  notifications?: Notification[];
}

export interface Session {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string;
  startTime: string;
  endTime: string;
  maxPatients: number;
  currentBookings: number;
}

export interface Appointment {
  id: string;
  sessionId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  notes?: string;
}
