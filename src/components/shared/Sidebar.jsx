import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard, FilePlus, Sparkles, MessageSquare, Briefcase,
  BookOpen, User, Settings, Users, Calendar, LineChart, Building,
  GraduationCap, SearchCode, Shield, FileCheck, Sliders, Activity
} from 'lucide-react';

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const { user } = useAuthStore();
  const role = user?.role || 'student';
  const isHr = role === 'hr';
  const isAdmin = role === 'admin';

  const studentNav = [
    { name: 'Dashboard',         to: '/student',              icon: LayoutDashboard },
    { name: 'Resume Guide',      to: '/student/guide',        icon: GraduationCap },
    { name: 'Resume Builder',    to: '/student/builder',      icon: FilePlus },
    { name: 'Resume Analysis',   to: '/student/analysis',     icon: Sparkles },
    { name: 'Applications',      to: '/student/applications', icon: Briefcase },
    { name: 'Messages',          to: '/student/messages',     icon: MessageSquare },
    { name: 'AI Interview',      to: '/student/interview',    icon: BookOpen },
    { name: 'Profile & Settings',to: '/student/profile',      icon: User },
  ];

  const hrNav = [
    { name: 'Dashboard',          to: '/hr',             icon: LayoutDashboard },
    { name: 'Job Postings',       to: '/hr/jobs',        icon: Briefcase },
    { name: 'Candidate Pipeline', to: '/hr/candidates',  icon: Users },
    { name: 'Interviews',         to: '/hr/interviews',  icon: Calendar },
    { name: 'Messages',           to: '/hr/messages',    icon: MessageSquare },
    { name: 'Analytics & Reports',to: '/hr/analytics',   icon: LineChart },
    { name: 'Company & Settings', to: '/hr/company',     icon: Building },
  ];

  const adminNav = [
    { name: 'Dashboard',          to: '/admin',          icon: LayoutDashboard },
    { name: 'User Management',    to: '/admin/users',    icon: Users },
    { name: 'Content & Job Audit',to: '/admin/content',  icon: FileCheck },
    { name: 'Platform Analytics', to: '/admin/analytics',icon: LineChart },
    { name: 'System Settings',    to: '/admin/settings', icon: Sliders },
  ];

  const nav = isAdmin ? adminNav : isHr ? hrNav : studentNav;

  const accentColor  = isAdmin ? '#8b5cf6' : isHr ? '#0d9488' : '#3b82f6';
  const accentBg     = isAdmin ? 'rgba(139,92,246,0.13)' : isHr ? 'rgba(13,148,136,0.13)' : 'rgba(59,130,246,0.13)';
  const accentBorder = isAdmin ? '#8b5cf6' : isHr ? '#0d9488' : '#3b82f6';
  const logoGrad     = isAdmin ? 'linear-gradient(135deg,#8b5cf6,#ec4899)' : isHr ? 'linear-gradient(135deg,#0d9488,#10b981)' : 'linear-gradient(135deg,#3b82f6,#6366f1)';
  const logoGlow     = isAdmin ? '0 4px 18px rgba(139,92,246,0.45)' : isHr ? '0 4px 18px rgba(13,148,136,0.45)' : '0 4px 18px rgba(59,130,246,0.45)';

  const homePath = isAdmin ? '/admin' : isHr ? '/hr' : '/student';
  const portalTitle = isAdmin ? 'Admin Console' : isHr ? 'HR Recruiter' : 'Student Portal';

  const inner = (
    <aside className="glass-sidebar flex flex-col h-full w-[240px]">
      {/* ── Logo ── */}
      <Link
        to={homePath}
        className="flex items-center gap-3 px-4 py-5 border-b shrink-0"
        style={{ borderColor: 'var(--border-faint)' }}
        onClick={onMobileClose}
      >
        <div
          className="h-8 w-8 min-w-[32px] rounded-xl flex items-center justify-center text-white font-bold text-sm"
          style={{ background: logoGrad, boxShadow: logoGlow }}
        >
          {isAdmin ? '🛡️' : 'A'}
        </div>
        <span className="sidebar-logo-text font-bold text-sm font-heading tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Antigravity AI
        </span>
      </Link>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 space-y-1">
        <p
          className="sidebar-section-label text-[10px] uppercase font-bold tracking-widest px-3 mb-2"
          style={{ color: 'var(--text-faint)' }}
        >
          {portalTitle}
        </p>

        {nav.map(({ name, to, icon: Icon }) => (
          <NavLink
            key={name}
            to={to}
            end={to === '/student' || to === '/hr' || to === '/admin'}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium
               transition-all duration-200 min-w-max
               ${isActive ? 'font-semibold' : ''}`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: accentBg,
                    color: accentColor,
                    borderLeft: `2px solid ${accentBorder}`,
                    paddingLeft: '10px',
                    boxShadow: `0 0 0 1px ${accentBg}, inset 0 1px 0 rgba(255,255,255,0.06)`,
                  }
                : { color: 'var(--text-muted)' }
            }
            onMouseEnter={e => {
              if (!e.currentTarget.getAttribute('aria-current')) {
                e.currentTarget.style.background = 'var(--nav-hover-bg)';
                e.currentTarget.style.color = 'var(--nav-hover-text)';
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.getAttribute('aria-current')) {
                e.currentTarget.style.background = '';
                e.currentTarget.style.color = 'var(--text-muted)';
              }
            }}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            <span className="sidebar-label">{name}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── User Footer ── */}
      <div
        className="flex items-center gap-3 px-3 py-4 border-t shrink-0"
        style={{ borderColor: 'var(--border-faint)', background: 'var(--nav-hover-bg)' }}
      >
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
          alt={user?.name || 'User'}
          className="h-8 w-8 min-w-[32px] rounded-xl object-cover border"
          style={{ borderColor: 'var(--border-light)' }}
        />
        <div className="sidebar-user-info min-w-0">
          <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            {user?.name || 'User'}
          </p>
          <p className="text-[10px] truncate capitalize mt-0.5" style={{ color: 'var(--text-faint)' }}>
            {role} account
          </p>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <div className="sidebar-wrapper hidden lg:block relative z-20">
        {inner}
      </div>

      <div
        className={`
          lg:hidden fixed top-0 left-0 bottom-0 z-50
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {inner}
      </div>
    </>
  );
}
