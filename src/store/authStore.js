import { create } from 'zustand';

const ROLES = {
  student: {
    id: 'student-1',
    name: 'Sarah Connor',
    email: 'sarah.c@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'Fullstack Software Engineer Candidate',
    skills: ['React', 'JavaScript', 'Node.js', 'Tailwind CSS', 'Python', 'SQL'],
  },
  hr: {
    id: 'hr-1',
    name: 'Marcus Vance',
    email: 'marcus.v@stripe.com',
    role: 'hr',
    company: 'Stripe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    title: 'Lead Technical Recruiter',
    skills: ['Talent Sourcing', 'Technical Interviews', 'ATS Screening'],
  },
  admin: {
    id: 'admin-1',
    name: 'Alex Mercer',
    email: 'alex.admin@antigravity.ai',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    title: 'Chief Platform Administrator',
    skills: ['System Health', 'User Moderation', 'AI Model Routing'],
  },
};

export const useAuthStore = create((set, get) => ({
  user: ROLES.student,
  loading: false,

  switchRole: (role) => {
    if (ROLES[role]) {
      set({ user: ROLES[role] });
      return ROLES[role];
    }
  },

  login: async (email, role = 'student') => {
    set({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 600));
    const targetUser = ROLES[role] ? { ...ROLES[role], email } : { ...ROLES.student, email };
    set({ user: targetUser, loading: false });
    return targetUser;
  },

  signUp: async (name, email, role = 'student') => {
    set({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 600));
    const base = ROLES[role] || ROLES.student;
    const newUser = {
      ...base,
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
    };
    set({ user: newUser, loading: false });
    return newUser;
  },

  logout: () => {
    set({ user: null });
  },

  updateProfile: (profileData) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...profileData } : null
    }));
  }
}));
