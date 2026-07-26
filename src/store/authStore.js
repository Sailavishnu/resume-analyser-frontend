import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: {
    id: 'student-1',
    name: 'Sarah Connor',
    email: 'sarah.c@gmail.com',
    role: 'student', // 'student' or 'hr'
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'Fullstack Software Engineer',
    skills: ['React', 'JavaScript', 'Node.js', 'Tailwind CSS', 'Python', 'SQL'],
  },
  loading: false,

  login: async (email, role) => {
    set({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: role === 'hr' ? 'hr-1' : 'student-1',
      name: role === 'hr' ? 'Marcus Vance' : 'Sarah Connor',
      email: email,
      role: role,
      avatar: role === 'hr' 
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      title: role === 'hr' ? 'Lead Technical Recruiter' : 'Fullstack Software Engineer',
      skills: role === 'hr' ? [] : ['React', 'JavaScript', 'Node.js', 'Tailwind CSS', 'Python', 'SQL'],
    };
    
    set({ user: mockUser, loading: false });
    return mockUser;
  },

  signUp: async (name, email, role) => {
    set({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      email: email,
      role: role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: role === 'hr' ? 'HR Talent Specialist' : 'Aspiring Software Developer',
      skills: [],
    };
    
    set({ user: mockUser, loading: false });
    return mockUser;
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
