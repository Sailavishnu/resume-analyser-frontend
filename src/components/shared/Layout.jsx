import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Protected route check
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-obsidian-950">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Navbar onMenuToggle={() => setSidebarOpen(true)} />
        
        {/* Scrollable Router View */}
        <main className="flex-1 overflow-y-auto px-6 py-8 bg-grid-pattern relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
