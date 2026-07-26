import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard,
  FilePlus,
  Upload,
  BarChart,
  Sparkles,
  SearchCode,
  MessageSquare,
  Briefcase,
  BookOpen,
  Bell,
  User,
  Settings,
  X,
  BriefcaseIcon,
  Users,
  Eye,
  Calendar,
  LineChart,
  ClipboardList,
  Building
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuthStore();
  const role = user?.role || 'student';

  const studentNavigation = [
    { name: 'Dashboard', to: '/student', icon: LayoutDashboard },
    { name: 'Resume Builder', to: '/student/builder', icon: FilePlus },
    { name: 'Resume Upload', to: '/student/upload', icon: Upload },
    { name: 'ATS Analysis', to: '/student/ats', icon: BarChart },
    { name: 'Resume Enhancement', to: '/student/enhancement', icon: Sparkles },
    { name: 'JD Match', to: '/student/jdmatch', icon: SearchCode },
    { name: 'AI Interview', to: '/student/interview', icon: MessageSquare },
    { name: 'Applications', to: '/student/applications', icon: Briefcase },
    { name: 'Learning Resources', to: '/student/resources', icon: BookOpen },
    { name: 'Notifications', to: '/student/notifications', icon: Bell },
    { name: 'Profile', to: '/student/profile', icon: User },
    { name: 'Settings', to: '/student/settings', icon: Settings },
  ];

  const hrNavigation = [
    { name: 'Dashboard', to: '/hr', icon: LayoutDashboard },
    { name: 'Job Management', to: '/hr/jobs', icon: BriefcaseIcon },
    { name: 'Candidates', to: '/hr/candidates', icon: Users },
    { name: 'Resume Screening', to: '/hr/screening', icon: Eye },
    { name: 'Interviews', to: '/hr/interviews', icon: Calendar },
    { name: 'Analytics', to: '/hr/analytics', icon: LineChart },
    { name: 'Reports', to: '/hr/reports', icon: ClipboardList },
    { name: 'Company Profile', to: '/hr/company', icon: Building },
    { name: 'Notifications', to: '/hr/notifications', icon: Bell },
    { name: 'Settings', to: '/hr/settings', icon: Settings },
  ];

  const navigation = role === 'hr' ? hrNavigation : studentNavigation;

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden cursor-pointer"
        />
      )}

      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-40 w-64 bg-obsidian-900 border-r border-white/[0.06]
          flex flex-col transform transition-transform duration-300 lg:static lg:transform-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Logo Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <Link to={role === 'hr' ? '/hr' : '/student'} className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-tr ${role === 'hr' ? 'from-brand-teal to-brand-emerald' : 'from-brand-blue to-brand-indigo'} text-white font-bold text-lg shadow-md`}>
              A
            </div>
            <span className="font-semibold text-sm tracking-tight text-white font-heading">
              Antigravity AI
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Link list */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin">
          <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest px-3 mb-2">
            {role === 'hr' ? 'HR Operations' : 'Student Portal'}
          </div>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.to === '/student' || item.to === '/hr'}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 group
                  ${isActive 
                    ? role === 'hr'
                      ? 'bg-brand-teal/15 text-brand-teal border-l-2 border-brand-teal pl-2.5 shadow-[0_0_15px_rgba(13,148,136,0.05)]'
                      : 'bg-brand-blue/15 text-brand-blue border-l-2 border-brand-blue pl-2.5 shadow-[0_0_15px_rgba(59,130,246,0.05)]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                  }
                `}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Role Display */}
        <div className="p-4 border-t border-white/[0.06] bg-obsidian-950/40">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
              alt={user?.name || 'User'}
              className="h-8 w-8 rounded-lg object-cover border border-white/[0.08]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Guest User'}</p>
              <p className="text-[10px] text-gray-500 truncate capitalize">{role} Account</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
