import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import PageTransition from './PageTransition';

export default function Layout() {
  const { user } = useAuthStore();
  const location = useLocation();
  // Mobile sidebar toggle only; desktop uses CSS hover
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPendingReveal, setIsPendingReveal] = useState(false);
  const timeoutRef = useRef(null);

  // Clear pending reveal if route changes externally
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [location.pathname]);

  const handleNavClick = () => {
    // Put content in frosted blur preview when a menu item is clicked
    setIsPendingReveal(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Safety auto-reveal after 600ms in case cursor stays stationary inside sidebar
    timeoutRef.current = setTimeout(() => {
      setIsPendingReveal(false);
    }, 600);
  };

  const handleSidebarMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsPendingReveal(false);
  };

  if (!user) return <Navigate to="/login" replace />;

  // Derive the portal from the URL path for correct sidebar rendering
  const pathPortal = location.pathname.startsWith('/admin')
    ? 'admin'
    : location.pathname.startsWith('/hr')
    ? 'hr'
    : 'student';

  // Enforce: user role must match URL portal
  if (user.role !== pathPortal) {
    const roleHome = user.role === 'admin' ? '/admin' : user.role === 'hr' ? '/hr' : '/student';
    return <Navigate to={roleHome} replace />;
  }

  return (
    <div
      className="flex h-screen w-screen overflow-hidden relative"
      style={{ background: 'var(--bg-page)' }}
    >
      {/* Ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* ── Sidebar (hover-open on desktop, slide-in on mobile) ── */}
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => {
          setMobileOpen(false);
          setIsPendingReveal(false);
        }}
        onNavClick={handleNavClick}
        onSidebarMouseLeave={handleSidebarMouseLeave}
      />

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ── Main panel ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative z-10 overflow-hidden">
        <Navbar onMobileMenuToggle={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-grid-pattern relative px-6 py-8">
          <motion.div
            animate={{
              filter: isPendingReveal ? 'blur(6px)' : 'blur(0px)',
              opacity: isPendingReveal ? 0.65 : 1,
              scale: isPendingReveal ? 0.985 : 1,
            }}
            transition={{
              duration: isPendingReveal ? 0.15 : 0.4,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="w-full h-full will-change-transform"
          >
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname}>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
