
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { getStore } from '../store';
import { ShieldCheck, LogIn, User as UserIcon, Lock, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate network delay for professional feel and to show the loader
    setTimeout(() => {
      const { doctors, patients } = getStore();
      
      let foundUser: User | null = null;

      // Check Admin (Hardcoded for demo)
      if (email === 'admin@admin.com' && password === 'admin123') {
        foundUser = { id: 'admin', name: 'Med Team', email: 'admin@admin.com', role: UserRole.ADMIN };
      } 
      // Check Aayush Demo Patient
      else if (email === 'aayush12@gmail.com' && password === 'aayush123') {
        const aayush = patients.find((p: any) => p.email === 'aayush12@gmail.com');
        if (aayush) foundUser = aayush;
      }
      // Check Demo Doctor
      else if (email === 'doctor@med.com' && password === 'doctor123') {
        const demoDoc = doctors.find((d: any) => d.email === 'doctor@med.com');
        if (demoDoc) foundUser = demoDoc;
      }
      // Check Others
      else {
        const doctor = doctors.find((d: any) => d.email === email);
        if (doctor) foundUser = doctor;
        else {
          const patient = patients.find((p: any) => p.email === email);
          if (patient) foundUser = patient;
        }
      }

      if (foundUser) {
        onLogin(foundUser);
      } else {
        setError('Invalid email or password. Please check your credentials.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
        <div className="p-8 pt-12 pb-6 text-center">
          <div className="inline-flex bg-indigo-600 p-4 rounded-3xl text-white mb-6 shadow-lg shadow-indigo-100">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Please sign in to MedPulse HMS</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="email" 
                disabled={isLoading}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all disabled:opacity-50"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="password" 
                disabled={isLoading}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all disabled:opacity-50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="p-8 pt-0 text-center">
          <p className="text-slate-500 font-medium mb-4">New patient?</p>
          <button 
            disabled={isLoading}
            onClick={onSwitchToSignup}
            className="text-indigo-600 font-bold hover:underline disabled:opacity-50"
          >
            Create Patient Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
