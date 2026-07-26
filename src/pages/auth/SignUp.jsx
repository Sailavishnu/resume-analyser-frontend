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
      const user = await signUp(data.name, data.email, selectedRole);
      toast.success(`Account created successfully! Welcome, ${user.name}`);
      if (user.role === 'hr') {
        navigate('/hr');
      } else {
        navigate('/student');
      }
    } catch (err) {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-screen flex bg-obsidian-950 text-gray-200">
      {/* Left side: Premium Branding Card */}
      <div className="hidden lg:flex lg:w-1/2 bg-obsidian-900 border-r border-white/[0.06] p-12 flex-col justify-between relative bg-grid-pattern overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-brand-blue/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-brand-violet/10 blur-[100px] pointer-events-none" />

        <div className="flex items-center gap-2.5 z-10">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-violet flex items-center justify-center text-white font-bold text-xl shadow-lg">
            A
          </div>
          <span className="font-bold text-md tracking-tight text-white font-heading">
            Antigravity AI
          </span>
        </div>

        <div className="max-w-md z-10">
          <h1 className="text-4xl font-extrabold text-white font-heading tracking-tight leading-tight mb-4">
            Accelerate your <br />
            <span className="bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-violet bg-clip-text text-fill-transparent">
              career tracking
            </span>
          </h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Create an applicant profile to instantly check ATS scores, compare alignment across dozens of campaigns, and unlock AI mock interviews.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 z-10">
          <span>Protected by AES-256</span>
          <span>•</span>
          <span>SaaS Enterprise Ready</span>
        </div>
      </div>

      {/* Right side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-grid-pattern lg:hidden pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-brand-indigo/5 blur-[90px] lg:hidden pointer-events-none" />

        <div className="w-full max-w-sm flex flex-col z-10">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-heading text-white mb-1.5">Create Account</h2>
            <p className="text-xs text-gray-400">Get started by setting up your portal credentials.</p>
          </div>

          {/* Role selector buttons */}
          <div className="grid grid-cols-2 gap-2.5 p-1 rounded-xl bg-obsidian-900 border border-white/[0.06] mb-5">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`
                flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer
                ${selectedRole === 'student' 
                  ? 'bg-brand-blue text-white shadow-md' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
                }
              `}
            >
              <User className="h-4 w-4" />
              <span>Student Portal</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('hr')}
              className={`
                flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer
                ${selectedRole === 'hr' 
                  ? 'bg-brand-teal text-white shadow-md' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
                }
              `}
            >
              <Users className="h-4 w-4" />
              <span>HR Recruiter</span>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            <Input
              label="Full Name"
              id="name"
              placeholder="e.g. Sarah Connor"
              error={errors.name?.message}
              register={register('name', { required: 'Name is required' })}
            />

            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="e.g. sarah.c@gmail.com"
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
              placeholder="••••••••"
              error={errors.password?.message}
              register={register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />

            <div className="flex items-start pt-1">
              <label className="flex items-start gap-2.5 text-xs text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded mt-0.5 bg-obsidian-900 border-white/[0.08] text-brand-blue focus:ring-0 cursor-pointer"
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

          {/* Footer link */}
          <div className="mt-6 text-center text-xs text-gray-400">
            <span>Already have an account? </span>
            <Link to="/login" className="text-brand-blue hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
