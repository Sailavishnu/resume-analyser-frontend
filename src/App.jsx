import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <BrowserRouter>
      {/* Toast Notification overlay */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0f0f13',
            color: '#f3f4f6',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: '12px',
          },
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  );
}
