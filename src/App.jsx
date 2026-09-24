import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';

export default function App() {
  const { initTheme, theme } = useThemeStore();
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initTheme();
    initAuth();
  }, [initTheme, initAuth]);

  return (
    <BrowserRouter>
      {/* Toast Notification overlay */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: theme === 'dark' ? '#0f0f13' : '#ffffff',
            color: theme === 'dark' ? '#f3f4f6' : '#0f1629',
            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(99,102,241,0.15)',
            fontSize: '12px',
            boxShadow: '0 8px 24px rgba(99,102,241,0.12)',
          },
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  );
}
