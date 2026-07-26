import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Menu, Bell, Search, LogOut, ChevronDown, User, Settings, ArrowLeftRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar({ onMenuToggle }) {
  const { user, logout, login } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleToggle = async () => {
    const nextRole = user?.role === 'hr' ? 'student' : 'hr';
    toast.loading(`Switching to ${nextRole === 'hr' ? 'HR Portal' : 'Student Portal'}...`, { id: 'role-switch' });
    
    // Simulate login for that role
    await login(user?.email || 'sarah.c@gmail.com', nextRole);
    
    toast.success(`Welcome to the ${nextRole === 'hr' ? 'HR Recruiter' : 'Student'} Portal!`, { id: 'role-switch' });
    navigate(nextRole === 'hr' ? '/hr' : '/student');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-obsidian-900/80 backdrop-blur-md border-b border-white/[0.06] px-6 flex items-center justify-between">
      {/* Mobile Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-gray-400 hover:text-white transition-colors"
          aria-label="Toggle sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search resumes, jobs, campaigns, candidate files..."
            className="w-full bg-obsidian-950 border border-white/[0.08] hover:border-white/[0.12] focus:border-brand-blue rounded-lg py-1.5 pl-10 pr-4 text-xs text-gray-300 focus:outline-none transition-all duration-150"
          />
        </div>
      </div>

      {/* Quick Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Role Toggle Switch */}
        <button
          onClick={handleRoleToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-obsidian-950 hover:bg-obsidian-800 text-xs font-semibold text-gray-300 transition-colors cursor-pointer"
          title="Switch view portals"
        >
          <ArrowLeftRight className="h-3.5 w-3.5 text-brand-blue" />
          <span>Switch to {user?.role === 'hr' ? 'Student' : 'HR'}</span>
        </button>

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-lg border border-white/[0.08] bg-obsidian-950 hover:bg-obsidian-800 text-gray-400 hover:text-white transition-colors relative cursor-pointer"
            aria-label="Notifications menu"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-brand-rose animate-pulse" />
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-obsidian-850 border border-white/[0.08] rounded-xl shadow-2xl p-4 z-20">
                <div className="flex justify-between items-center pb-2 border-b border-white/[0.06] mb-2">
                  <span className="text-xs font-bold text-white">Notifications</span>
                  <button className="text-[10px] text-brand-blue hover:underline">Mark all read</button>
                </div>
                <div className="space-y-2.5 max-h-60 overflow-y-auto">
                  <div className="text-xs p-2 hover:bg-white/[0.02] rounded-lg transition-colors cursor-pointer">
                    <p className="font-semibold text-gray-200">AI Resume Analysis Completed</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Your resume was analyzed with a score of 84%.</p>
                  </div>
                  <div className="text-xs p-2 hover:bg-white/[0.02] rounded-lg transition-colors cursor-pointer">
                    <p className="font-semibold text-gray-200">New Campaign Launched</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Vercel opened a Senior React Developer position.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
              alt={user?.name || 'User'}
              className="h-7 w-7 rounded-lg object-cover border border-white/[0.08]"
            />
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-obsidian-850 border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden py-1 z-20 text-xs">
                <div className="px-4 py-2.5 border-b border-white/[0.06] bg-obsidian-950/40">
                  <p className="font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                </div>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate(user?.role === 'hr' ? '/hr/settings' : '/student/profile');
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate(user?.role === 'hr' ? '/hr/settings' : '/student/settings');
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-left text-brand-rose hover:bg-brand-rose/5 border-t border-white/[0.04] transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
