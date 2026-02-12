
import React from 'react';
import { User, UserRole } from '../types';
import { Bell, Search, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  user: User;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  searchQuery, 
  onSearchChange, 
  unreadCount, 
  onOpenNotifications,
  onToggleDarkMode,
  isDarkMode
}) => {
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10 transition-colors">
      <div className="relative w-96 hidden md:block">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input 
          type="text" 
          placeholder="Search patients, doctors, records..." 
          className="pl-10 pr-4 py-2 w-full bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        <button 
          onClick={onToggleDarkMode}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button 
          onClick={onOpenNotifications}
          className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white relative p-1 transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900"></span>
          )}
        </button>
        
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              {user.role === UserRole.ADMIN ? 'Med Team' : user.role.toLowerCase()}
            </p>
          </div>
          <img 
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`} 
            alt="Profile" 
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
