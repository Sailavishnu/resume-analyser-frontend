import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import { User, Users } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function SignUp() {
  const [selectedRole, setSelectedRole] = useState('student');
  const { signUp, loading } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const user = await signUp(data.name, data.email, data.password, selectedRole);
      toast.success(`Account created successfully! Welcome, ${user.name}`);
      if (user.role === 'hr') {
        navigate('/hr');
      } else {
        navigate('/student');
      }
    } catch (err) {
      toast.error(err?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div
      className="min-h-screen w-screen flex relative overflow-hidden bg-grid-pattern"
      style={{ background: 'var(--bg-page)' }}
    >
      {/* Ambient orbs */}
      <div className="page-orb-1" />
      <div className="page-orb-2" />

      {/* Left side: Premium Branding Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)',
          borderRight: '1px solid var(--border-sm)',
        }}
      >
        {/* Glow spheres */}
        <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.20) 0%, transparent 70%)' }} />

        {/* Logo */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="h-10 w-10 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>
            R
          </div>
          <span className="font-bold text-lg tracking-tight font-heading" style={{ color: 'var(--text-primary)' }}>
            Resume AI
          </span>
        </div>

        {/* Headline */}
        <div className="max-w-md z-10">
          <h1 className="text-4xl font-extrabold font-heading tracking-tight leading-tight mb-5"
            style={{ color: 'var(--text-primary)' }}>
            Accelerate your <br />
            <span className="bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-violet bg-clip-text text-transparent">
              career tracking.
            </span>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Create an applicant profile to instantly check ATS scores, compare alignment across dozens of campaigns, and unlock AI mock interviews.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {['ATS Analysis', 'AI Interviews', 'JD Matching', 'Resume Builder'].map(f => (
              <span key={f}
                className="text-xs px-3 py-1.5 rounded-full font-medium glassmorphic"
                style={{ color: 'var(--text-secondary)' }}>
                ✦ {f}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs z-10" style={{ color: 'var(--text-faint)' }}>
          <span>Protected by AES-256</span>
          <span>•</span>
          <span>SaaS Enterprise Ready</span>
        </div>
      </div>

      {/* Right side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 relative z-10">
        <div className="w-full max-w-sm">
          <div className="auth-glass-panel p-8 md:p-10">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-heading mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Create Account
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Get started by setting up your portal credentials.
              </p>
            </div>

            {/* Role selector */}
            <div
              className="grid grid-cols-2 gap-2 p-1 rounded-xl mb-5"
              style={{ background: 'var(--border-xs)', border: '1px solid var(--border-sm)' }}
            >
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`
                  flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer
                  ${selectedRole === 'student' ? 'bg-brand-blue text-white shadow-md' : ''}
                `}
                style={selectedRole !== 'student' ? { color: 'var(--text-muted)' } : {}}
              >
                <User className="h-4 w-4" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('hr')}
                className={`
                  flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer
                  ${selectedRole === 'hr' ? 'bg-brand-teal text-white shadow-md' : ''}
                `}
                style={selectedRole !== 'hr' ? { color: 'var(--text-muted)' } : {}}
              >
                <Users className="h-4 w-4" />
                <span>HR Recruiter</span>
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              <Input
                label="Full Name"
                id="name"
                autoComplete="name"
                placeholder="e.g. Priya Lakshmi"
                error={errors.name?.message}
                register={register('name', { required: 'Name is required' })}
              />

              <Input
                label="Email Address"
                id="email"
                type="email"
                autoComplete="email"
                placeholder="e.g. priya.lakshmi@gmail.com"
                error={errors.email?.message}
                register={register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />

              <Input
                label="Password"
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                error={errors.password?.message}
                register={register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
              />

              <div className="flex items-start pt-1">
                <label className="flex items-start gap-2.5 text-xs cursor-pointer" style={{ color: 'var(--text-muted)' }}>
                  <input
                    type="checkbox"
                    className="rounded mt-0.5 text-brand-blue focus:ring-0 cursor-pointer"
                    required
                  />
                  <span>I accept the <a href="#terms" className="text-brand-blue hover:underline">Terms of Service</a> and <a href="#privacy" className="text-brand-blue hover:underline">Privacy Policy</a></span>
                </label>
              </div>

              <Button
                type="submit"
                variant={selectedRole === 'hr' ? 'teal' : 'primary'}
                loading={loading}
                className="w-full mt-2"
              >
                Create Free Account
              </Button>
            </form>

            <div className="mt-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>Already have an account? </span>
              <Link to="/login" className="text-brand-blue hover:underline font-medium">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
