import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Menu, Bell, Search, LogOut, ChevronDown, User, Settings, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar({ onMobileMenuToggle }) {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const [showNotif,    setShowNotif]    = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifTimer   = useRef(null);
  const userTimer    = useRef(null);

  const isDark = theme === 'dark';
  const isAdmin = user?.role === 'admin';

  const hover = (setter, timerRef) => ({
    onMouseEnter: () => { clearTimeout(timerRef.current); setter(true);  },
    onMouseLeave: () => { timerRef.current = setTimeout(() => setter(false), 180); },
  });

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    // Admin gets redirected to admin login, others to regular login
    if (isAdmin) {
      navigate('/admin/login');
    } else {
      navigate('/login');
    }
  };



  return (
    <header className="glass-navbar sticky top-0 z-30 h-16 w-full flex items-center justify-between px-5 shrink-0">

      {/* ── Left: mobile hamburger + search ── */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl glass transition-colors cursor-pointer"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative max-w-sm w-full hidden sm:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5"
            style={{ color: 'var(--text-faint)' }}
          />
          <input
            type="text"
            placeholder="Search resumes, jobs, candidates…"
            className="glass-input w-full rounded-xl py-2 pl-9 pr-4 text-xs"
            style={{ color: 'var(--text-secondary)' }}
          />
        </div>
      </div>

      {/* ── Right: actions ── */}
      <div className="flex items-center gap-2.5 shrink-0">



        {/* ── Theme toggle ── */}
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light Mode' : 'Dark Mode'}
        >
          <span className="theme-toggle-thumb" />
          <span className="absolute right-1.5 pointer-events-none">
            {isDark
              ? <Moon  className="h-3 w-3 text-indigo-300" />
              : <Sun   className="h-3 w-3 text-amber-400"  />
            }
          </span>
        </button>

        {/* ── Notifications (hover) ── */}
        <div className="relative" {...hover(setShowNotif, notifTimer)}>
          <button
            className="glass relative p-2 rounded-xl cursor-pointer transition-all"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-brand-rose animate-pulse" />
          </button>

          {showNotif && (
            <div
              className="glass-dropdown absolute right-0 top-full mt-2 w-80 z-50 overflow-hidden"
              {...hover(setShowNotif, notifTimer)}
            >
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: 'var(--border-faint)' }}
              >
                <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</span>
                <button className="text-[10px] text-brand-blue hover:underline font-medium">Mark all read</button>
              </div>

              <div className="p-2 max-h-72 overflow-y-auto space-y-0.5">
                {[
                  { title: 'AI Resume Analysis Complete', body: 'Your resume scored 84% — view suggestions.',   dot: '#3b82f6' },
                  { title: 'New Recruiter Message',       body: 'Karthik Kumar from Zoho sent you a message.', dot: '#10b981' },
                  { title: 'Mock Interview Ready',        body: 'Practice your tailored technical round.',      dot: '#8b5cf6' },
                ].map((n, i) => (
                  <NotifItem key={i} {...n} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── User menu (hover) ── */}
        <div className="relative" {...hover(setShowUserMenu, userTimer)}>
          <button
            className="glass flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl cursor-pointer transition-all"
            aria-label="User menu"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
              alt={user?.name || 'User'}
              className="h-7 w-7 rounded-lg object-cover border"
              style={{ borderColor: 'var(--border-light)' }}
            />
            <ChevronDown
              className="h-3.5 w-3.5 transition-transform duration-200"
              style={{
                color: 'var(--text-muted)',
                transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0)',
              }}
            />
          </button>

          {showUserMenu && (
            <div
              className="glass-dropdown absolute right-0 top-full mt-2 w-56 z-50 overflow-hidden"
              {...hover(setShowUserMenu, userTimer)}
            >
              <div
                className="px-4 py-3 border-b"
                style={{ borderColor: 'var(--border-faint)', background: 'var(--nav-hover-bg)' }}
              >
                <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                <p className="text-[10px] mt-0.5 capitalize truncate" style={{ color: 'var(--text-muted)' }}>
                  {user?.role} Portal · {user?.email}
                </p>
              </div>



              <div className="p-1.5 space-y-0.5">
                <MenuBtn
                  icon={<User className="h-4 w-4 text-brand-blue" />}
                  label="Profile"
                  onClick={() => { setShowUserMenu(false); navigate(isAdmin ? '/admin/settings' : user?.role === 'hr' ? '/hr/company' : '/student/profile'); }}
                />
                <MenuBtn
                  icon={<Settings className="h-4 w-4 text-brand-indigo" />}
                  label="Settings"
                  onClick={() => { setShowUserMenu(false); navigate(isAdmin ? '/admin/settings' : user?.role === 'hr' ? '/hr/settings' : '/student/settings'); }}
                />
                <div className="my-1 border-t" style={{ borderColor: 'var(--border-faint)' }} />
                <MenuBtn
                  icon={<LogOut className="h-4 w-4" />}
                  label="Log Out"
                  danger
                  onClick={() => { setShowUserMenu(false); handleLogout(); }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function NotifItem({ title, body, dot }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-colors text-xs"
      style={{ background: hovered ? 'var(--nav-hover-bg)' : 'transparent' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="mt-1.5 h-2 w-2 rounded-full shrink-0" style={{ background: dot }} />
      <div>
        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</p>
        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{body}</p>
      </div>
    </div>
  );
}

function MenuBtn({ icon, label, onClick, danger = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 w-full px-3 py-2 text-xs rounded-lg text-left cursor-pointer transition-colors"
      style={{
        color: danger ? '#f43f5e' : 'var(--text-secondary)',
        background: hovered ? (danger ? 'rgba(244,63,94,0.08)' : 'var(--nav-hover-bg)') : 'transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
