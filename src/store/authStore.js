import { create } from 'zustand';
import apiClient from '../services/apiClient';

const DEFAULT_AVATARS = {
  student: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  hr: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  admin: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
};

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create((set, get) => ({
  user: getStoredUser(),
  token: localStorage.getItem('access_token') || null,
  loading: false,

  // Initialize auth state on app load
  initAuth: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      set({ user: null, token: null });
      return;
    }
    try {
      const res = await apiClient.get('/auth/me');
      if (res.data?.data) {
        const u = res.data.data;
        const updatedUser = {
          id: u.id,
          name: u.full_name,
          email: u.email,
          role: u.role,
          avatar: DEFAULT_AVATARS[u.role] || DEFAULT_AVATARS.student,
          skills: u.role === 'student' ? ['React', 'JavaScript', 'Python', 'FastAPI'] : ['Recruitment', 'ATS'],
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser, token });
      }
    } catch (err) {
      // If /auth/me fails (expired token), clear state
      console.warn('Failed to verify existing session:', err?.message);
    }
  },

  // Login with backend API
  login: async (email, password, role = 'student') => {
    set({ loading: true });
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const authData = response.data?.data || response.data;
      
      const accessToken = authData.access_token;
      const refreshToken = authData.refresh_token;
      
      localStorage.setItem('access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }

      const userRole = authData.role || role;
      const user = {
        id: authData.user_id || 'user-1',
        name: authData.full_name || email.split('@')[0],
        email: email,
        role: userRole,
        avatar: DEFAULT_AVATARS[userRole] || DEFAULT_AVATARS.student,
        title: userRole === 'hr' ? 'Technical Recruiter' : 'Software Engineer Candidate',
        skills: userRole === 'hr' ? ['Talent Sourcing', 'ATS Screening'] : ['React', 'JavaScript', 'Python'],
      };

      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token: accessToken, loading: false });
      return user;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // Admin login
  loginAsAdmin: () => {
    const adminUser = {
      id: 'admin-1',
      name: 'Suresh Kannan',
      email: 'suresh.admin@careerhub.edu',
      role: 'admin',
      avatar: DEFAULT_AVATARS.admin,
      title: 'Chief Platform Administrator',
      skills: ['System Health', 'User Moderation', 'AI Model Routing'],
    };
    localStorage.setItem('user', JSON.stringify(adminUser));
    set({ user: adminUser, loading: false });
    return adminUser;
  },

  // Sign up with backend API
  signUp: async (name, email, password, role = 'student') => {
    set({ loading: true });
    try {
      const response = await apiClient.post('/auth/signup', {
        full_name: name,
        email,
        password,
        role,
      });
      const authData = response.data?.data || response.data;

      const accessToken = authData.access_token;
      const refreshToken = authData.refresh_token;

      localStorage.setItem('access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }

      const user = {
        id: authData.user_id,
        name: authData.full_name || name,
        email: email,
        role: authData.role || role,
        avatar: DEFAULT_AVATARS[authData.role || role] || DEFAULT_AVATARS.student,
        title: role === 'hr' ? 'Technical Recruiter' : 'Software Engineer Candidate',
        skills: role === 'hr' ? ['Talent Sourcing', 'ATS Screening'] : ['React', 'JavaScript', 'Python'],
      };

      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token: accessToken, loading: false });
      return user;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // Switch role (only for testing / development UI)
  switchRole: (role) => {
    if (role === 'admin') return;
    const currentUser = get().user;
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      role,
      avatar: DEFAULT_AVATARS[role] || currentUser.avatar,
    };
    localStorage.setItem('user', JSON.stringify(updated));
    set({ user: updated });
    return updated;
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      set({ user: null, token: null });
    }
  },

  updateProfile: (profileData) => {
    set((state) => {
      const updated = state.user ? { ...state.user, ...profileData } : null;
      if (updated) {
        localStorage.setItem('user', JSON.stringify(updated));
      }
      return { user: updated };
    });
  },
}));
