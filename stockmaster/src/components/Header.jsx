import { useState } from 'react';
import { Menu, Bell, Search, ChevronDown, LogOut, Settings, User } from 'lucide-react';

const Header = ({ onMenuClick, user, onLogout }) => {
  const [showProfile, setShowProfile] = useState(false);
  
  return (
    <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-gray-400 hover:text-white"><Menu className="w-6 h-6" /></button>
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input type="text" placeholder="Search..." className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-white"><Bell className="w-6 h-6" /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span></button>
          <div className="relative">
            <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center"><span className="text-white font-medium text-sm">{user?.first_name?.[0] || 'U'}</span></div>
              <span className="hidden sm:block text-white font-medium">{user?.first_name || 'User'}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-slate-700"><User className="w-4 h-4" /> Profile</button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-slate-700"><Settings className="w-4 h-4" /> Settings</button>
                <hr className="my-2 border-slate-700" />
                <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700"><LogOut className="w-4 h-4" /> Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;