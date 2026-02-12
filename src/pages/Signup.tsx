
import React, { useState } from 'react';
import { User, UserRole, Patient } from '../types';
import { getStore, saveStore } from '../store';
import { ShieldCheck, UserPlus, User as UserIcon, Mail, Phone, Lock, ArrowLeft, Loader2 } from 'lucide-react';

interface SignupProps {
  onSignup: (user: User) => void;
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay for professional feel
    setTimeout(() => {
      const { patients, ...rest } = getStore();
      
      const newPatient: Patient = {
        id: 'p' + Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: UserRole.PATIENT,
        avatar: `https://ui-avatars.com/api/?name=${formData.name}&background=random`
      };

      saveStore({ ...rest, patients: [...patients, newPatient] });
      onSignup(newPatient);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden relative">
        <button 
          onClick={onSwitchToLogin}
          disabled={isLoading}
          className="absolute top-6 left-6 p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-30"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="p-8 pt-12 pb-6 text-center">
          <div className="inline-flex bg-emerald-600 p-4 rounded-3xl text-white mb-6 shadow-lg shadow-emerald-100">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Join MedPulse</h1>
          <p className="text-slate-500 font-medium">Create your patient health profile</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all disabled:opacity-50"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                disabled={isLoading}
                type="email"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all disabled:opacity-50"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all disabled:opacity-50"
                placeholder="Phone Number"
                required
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                disabled={isLoading}
                type="password"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all disabled:opacity-50"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 mt-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <UserPlus className="w-5 h-5" />
            )}
            <span>{isLoading ? 'Creating Profile...' : 'Create Account'}</span>
          </button>
        </form>

        <div className="p-8 pt-0 text-center border-t border-slate-50 bg-slate-50/50">
          <p className="text-slate-500 text-sm font-medium mb-2 mt-6">Already have an account?</p>
          <button 
            disabled={isLoading}
            onClick={onSwitchToLogin}
            className="text-emerald-600 font-bold hover:underline disabled:opacity-50"
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
