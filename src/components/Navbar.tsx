import React from "react";
import { signInWithGoogle } from "../utils/auth";
import { Search, Bell, Settings, User, LogOut } from "lucide-react";

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <div className="h-16 bg-black/20 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 z-40">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search projects..."
            className="bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-white/40 hover:text-white transition-colors">
          <Bell size={20} />
        </button>
        <button className="text-white/40 hover:text-white transition-colors">
          <Settings size={20} />
        </button>
        
        <div className="h-8 w-[1px] bg-white/10 mx-2" />

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-xs font-medium text-white">{user?.displayName}</span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Pro Forger</span>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden">
            <img src={user?.photoURL || ""} alt="User" className="w-full h-full object-cover" />
          </div>
          <button 
            onClick={onLogout}
            className="p-2 hover:bg-white/10 text-white/40 hover:text-red-400 rounded-lg transition-all ml-2"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
