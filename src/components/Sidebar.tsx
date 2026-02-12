
import React from 'react';
import { UserRole } from '../types';
import { LayoutDashboard, Users, Calendar, ClipboardList, LogOut, Settings, ShieldCheck, UserCircle } from 'lucide-react';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (id: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, onTabChange, onLogout }) => {
  const menuItems = {
    [UserRole.ADMIN]: [
      { icon: LayoutDashboard, label: 'Dashboard', id: 'dash' },
      { icon: Users, label: 'Doctors', id: 'doctors' },
      { icon: Calendar, label: 'Sessions', id: 'sessions' },
      { icon: ClipboardList, label: 'Bookings', id: 'bookings' },
    ],
    [UserRole.DOCTOR]: [
      { icon: LayoutDashboard, label: 'Overview', id: 'dash' },
      { icon: Calendar, label: 'Appointments', id: 'apps' },
      { icon: ClipboardList, label: 'My Sessions', id: 'sessions' },
      { icon: UserCircle, label: 'Profile', id: 'profile' },
    ],
    [UserRole.PATIENT]: [
      { icon: LayoutDashboard, label: 'My Health', id: 'dash' },
      { icon: Calendar, label: 'New Booking', id: 'new' },
      { icon: ClipboardList, label: 'Past Bookings', id: 'past' },
      { icon: UserCircle, label: 'My Account', id: 'profile' },
    ],
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-full border-r border-slate-800">
      <div className="p-6 flex items-center space-x-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight">MedPulse</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems[role].map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
