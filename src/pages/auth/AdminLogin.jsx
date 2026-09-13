import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginAsAdmin } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate against env credentials
    const envId = import.meta.env.VITE_ADMIN_ID || 'admin';
    const envPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';

    await new Promise((r) => setTimeout(r, 800)); // Simulate auth delay

    if (adminId === envId && password === envPass) {
      const user = loginAsAdmin();
      toast.success(`Welcome, ${user.name}! Admin Console active.`);
      navigate('/admin');
    } else {
      setError('Invalid admin credentials. Access denied.');
      toast.error('Authentication failed. Invalid admin ID or password.');
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center relative overflow-hidden bg-grid-pattern"
      style={{ background: 'var(--bg-page)' }}
    >
      {/* Ambient orbs — purple/violet for admin */}
      <div
        className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full blur-[140px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)' }}
      />

      <div className="w-full max-w-md px-6 relative z-10">
        {/* Back to regular login */}
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-medium mb-6 transition-colors hover:underline"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to User Login
        </Link>

        <div className="auth-glass-panel p-8 md:p-10">
          {/* Shield header */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="h-16 w-16 rounded-2xl flex items-center justify-center text-white text-2xl mb-4"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                boxShadow: '0 12px 32px rgba(139,92,246,0.4)',
              }}
            >
              <Shield className="h-8 w-8" />
            </div>
            <h2
              className="text-xl font-bold font-heading tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Admin Console
            </h2>
            <p className="text-xs mt-1.5 text-center" style={{ color: 'var(--text-muted)' }}>
              Restricted access. Enter admin credentials to proceed.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Admin ID */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Admin ID
              </label>
              <input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter admin ID"
                required
                className="glass-input w-full rounded-xl py-2.5 px-4 text-xs"
                style={{ color: 'var(--text-primary)' }}
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="glass-input w-full rounded-xl py-2.5 px-4 pr-10 text-xs"
                  style={{ color: 'var(--text-primary)' }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ color: 'var(--text-faint)' }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="text-xs px-3 py-2 rounded-lg font-medium"
                style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)' }}
              >
                🔒 {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                boxShadow: loading ? 'none' : '0 6px 20px rgba(139,92,246,0.35)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                'Access Admin Console'
              )}
            </button>
          </form>

          {/* Footer hint */}
          <div className="mt-6 text-center">
            <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>
              Admin access is limited to authorized platform administrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
