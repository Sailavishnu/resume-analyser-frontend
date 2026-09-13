import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard, FilePlus, Upload, BarChart, Sparkles,
  SearchCode, MessageSquare, Briefcase, BookOpen, Bell,
  User, Settings, BriefcaseIcon, Users, Eye, Calendar,
  LineChart, ClipboardList, Building, GraduationCap,
} from 'lucide-react';

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const { user } = useAuthStore();
  const role = user?.role || 'student';
  const isHr = role === 'hr';

  const studentGroups = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', to: '/student', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Resume Studio',
      items: [
        { name: 'Resume Guide',   to: '/student/guide',        icon: GraduationCap },
        { name: 'Resume Builder', to: '/student/builder',      icon: FilePlus },
        { name: 'Resume Upload',  to: '/student/upload',       icon: Upload },
      ],
    },
    {
      title: 'AI Intelligence',
      items: [
        { name: 'ATS Analysis',   to: '/student/ats',          icon: BarChart },
        { name: 'AI Enhancement', to: '/student/enhancement',  icon: Sparkles },
        { name: 'JD Match',       to: '/student/jdmatch',      icon: SearchCode },
      ],
    },
    {
      title: 'Career & Prep',
      items: [
        { name: 'AI Interview',   to: '/student/interview',    icon: MessageSquare },
        { name: 'Applications',   to: '/student/applications', icon: Briefcase },
        { name: 'Resources',      to: '/student/resources',    icon: BookOpen },
      ],
    },
    {
      title: 'Account',
      items: [
        { name: 'Notifications',  to: '/student/notifications',icon: Bell },
        { name: 'Profile',        to: '/student/profile',      icon: User },
        { name: 'Settings',       to: '/student/settings',     icon: Settings },
      ],
    },
  ];

  const hrGroups = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', to: '/hr', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Talent Acquisition',
      items: [
        { name: 'Jobs',       to: '/hr/jobs',       icon: BriefcaseIcon },
        { name: 'Candidates', to: '/hr/candidates', icon: Users },
        { name: 'Screening',  to: '/hr/screening',  icon: Eye },
        { name: 'Interviews', to: '/hr/interviews', icon: Calendar },
      ],
    },
    {
      title: 'Insights & Org',
      items: [
        { name: 'Analytics',  to: '/hr/analytics',  icon: LineChart },
        { name: 'Reports',    to: '/hr/reports',    icon: ClipboardList },
        { name: 'Company',    to: '/hr/company',    icon: Building },
      ],
    },
    {
      title: 'Account',
      items: [
        { name: 'Notifications', to: '/hr/notifications', icon: Bell },
        { name: 'Settings',      to: '/hr/settings',     icon: Settings },
      ],
    },
  ];

  const groups = isHr ? hrGroups : studentGroups;

  const accentColor  = isHr ? '#0d9488'                        : '#3b82f6';
  const accentBg     = isHr ? 'rgba(13,148,136,0.13)'          : 'rgba(59,130,246,0.13)';
  const accentBorder = isHr ? '#0d9488'                        : '#3b82f6';
  const logoGrad     = isHr ? 'linear-gradient(135deg,#0d9488,#10b981)' : 'linear-gradient(135deg,#3b82f6,#6366f1)';
  const logoGlow     = isHr ? '0 4px 18px rgba(13,148,136,0.45)'       : '0 4px 18px rgba(59,130,246,0.45)';

  const inner = (
    <aside className="glass-sidebar flex flex-col h-full w-[240px]">
      {/* ── Logo ── */}
      <Link
        to={isHr ? '/hr' : '/student'}
        className="flex items-center gap-3 px-4 py-5 border-b shrink-0"
        style={{ borderColor: 'var(--border-faint)' }}
        onClick={onMobileClose}
      >
        <div
          className="h-8 w-8 min-w-[32px] rounded-xl flex items-center justify-center text-white font-bold text-sm"
          style={{ background: logoGrad, boxShadow: logoGlow }}
        >
          A
        </div>
        <span className="sidebar-logo-text font-bold text-sm font-heading tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Antigravity AI
        </span>
      </Link>

      {/* ── Grouped Nav ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 space-y-3">
        {groups.map((grp, gIdx) => (
          <div key={grp.title || gIdx} className="space-y-0.5">
            <p
              className="sidebar-section-label text-[9px] uppercase font-bold tracking-widest px-3 pt-1 text-ellipsis overflow-hidden"
              style={{ color: 'var(--text-faint)' }}
            >
              {grp.title}
            </p>

            {grp.items.map(({ name, to, icon: Icon }) => (
              <NavLink
                key={name}
                to={to}
                end={to === '/student' || to === '/hr'}
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium
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
                <Icon className="h-[17px] w-[17px] shrink-0" />
                <span className="sidebar-label">{name}</span>
              </NavLink>
            ))}
          </div>
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
      {/* ── Desktop: hover-expand wrapper ── */}
      <div className="sidebar-wrapper hidden lg:block relative z-20">
        {inner}
      </div>

      {/* ── Mobile: slide-in panel ── */}
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
