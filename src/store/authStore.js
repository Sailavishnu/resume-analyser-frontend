import { create } from 'zustand';

const ROLES = {
  student: {
    id: 'student-1',
    name: 'Priya Lakshmi',
    email: 'priya.lakshmi@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Fullstack Software Engineer Candidate',
    skills: ['React', 'JavaScript', 'Node.js', 'Tailwind CSS', 'Python', 'SQL'],
  },
  hr: {
    id: 'hr-1',
    name: 'Karthik Kumar',
    email: 'karthik.k@zoho.com',
    role: 'hr',
    company: 'Zoho Corporation',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Lead Technical Recruiter',
    skills: ['Talent Sourcing', 'Technical Interviews', 'ATS Screening'],
  },
  admin: {
    id: 'admin-1',
    name: 'Suresh Kannan',
    email: 'suresh.admin@careerhub.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Chief Platform Administrator',
    skills: ['System Health', 'User Moderation', 'AI Model Routing'],
  },
};

export const useAuthStore = create((set, get) => ({
  user: null, // Start as null — user must log in
  loading: false,

  // Regular login for student / hr
  login: async (email, role = 'student') => {
    set({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 600));
    const targetUser = ROLES[role] ? { ...ROLES[role], email } : { ...ROLES.student, email };
    set({ user: targetUser, loading: false });
    return targetUser;
  },

  // Admin-specific login (called from AdminLogin page after credential check)
  loginAsAdmin: () => {
    const adminUser = { ...ROLES.admin };
    set({ user: adminUser, loading: false });
    return adminUser;
  },

  // Regular sign up for student / hr
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

  // Switch role (only between student and hr from navbar)
  switchRole: (role) => {
    if (role === 'admin') return; // Admin can't be switched to from navbar
    if (ROLES[role]) {
      set({ user: ROLES[role] });
      return ROLES[role];
    }
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
