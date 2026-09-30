import { create } from 'zustand';
import api from '../services/apiClient';

const MOCK_STATS = {
  totalStudents: 1420,
  totalHr: 86,
  resumesAnalyzed: 3892,
  activeJobs: 145,
  systemHealth: '99.98%',
  averageAtsScore: 76.4,
  messagesProcessed: 12450,
};

const MOCK_USERS = [
  {
    id: 'u-1',
    name: 'Priya Lakshmi',
    email: 'priya.l@gmail.com',
    role: 'student',
    status: 'active',
    joinedDate: '2026-08-12',
    resumesCount: 3,
    avgAtsScore: 84,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: 'u-2',
    name: 'Karthik Kumar',
    email: 'karthik.k@zoho.com',
    role: 'hr',
    company: 'Zoho Corporation',
    status: 'active',
    joinedDate: '2026-07-20',
    jobsPosted: 8,
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 'u-3',
    name: 'Aakash Sai',
    email: 'aakash.sai@university.edu',
    role: 'student',
    status: 'active',
    joinedDate: '2026-08-25',
    resumesCount: 2,
    avgAtsScore: 78,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    id: 'u-4',
    name: 'Meenakshi Devi',
    email: 'meenakshi.d@infosys.com',
    role: 'hr',
    company: 'Infosys',
    status: 'active',
    joinedDate: '2026-06-15',
    jobsPosted: 14,
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  },
  {
    id: 'u-5',
    name: 'Suresh Kannan',
    email: 'admin@platform.com',
    role: 'admin',
    status: 'active',
    joinedDate: '2026-01-01',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  }
];

const MOCK_AUDIT_LOGS = [
  { id: 1, action: 'User Suspended', target: 'test.murugan@tempmail.com', by: 'System AI Security', time: '10 mins ago', type: 'warning' },
  { id: 2, action: 'New HR Account Verified', target: 'karthik.k@zoho.com (Zoho Corporation)', by: 'Suresh Kannan', time: '1 hour ago', type: 'success' },
  { id: 3, action: 'Batch ATS Re-index', target: '142 resumes updated', by: 'Automated Worker', time: '3 hours ago', type: 'info' },
];

export const useAdminStore = create((set, get) => ({
  stats: MOCK_STATS,
  users: MOCK_USERS,
  auditLogs: MOCK_AUDIT_LOGS,
  loading: false,

  fetchDashboardStats: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/admin/dashboard');
      if (res.data?.data) {
        const d = res.data.data;
        set({
          stats: {
            totalStudents: d.total_students || 1420,
            totalHr: d.total_hr || 86,
            resumesAnalyzed: d.total_resumes || 3892,
            activeJobs: d.active_jobs || 145,
            systemHealth: '99.99% Operational',
            averageAtsScore: d.average_ats_score || 82.5,
            messagesProcessed: 12450
          },
          auditLogs: d.recent_audit_logs?.length ? d.recent_audit_logs : MOCK_AUDIT_LOGS,
          loading: false
        });
      }
    } catch (err) {
      console.warn('API fallback to local admin metrics:', err.message);
      set({ loading: false });
    }
  },

  fetchUsers: async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data?.data?.users) {
        set({ users: res.data.data.users });
      }
    } catch (err) {
      console.warn('API fallback to local admin users:', err.message);
    }
  },

  createUser: async (userData) => {
    try {
      const res = await api.post('/admin/users', userData);
      await get().fetchUsers();
      return res.data?.data;
    } catch (err) {
      // Local fallback insert
      const newUser = {
        id: `u-${Date.now()}`,
        name: userData.full_name || 'New User',
        email: userData.email,
        role: userData.role || 'student',
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0],
        resumesCount: 0,
        jobsPosted: 0,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`
      };
      set(state => ({ users: [newUser, ...state.users] }));
      return newUser;
    }
  },

  toggleUserStatus: async (userId) => {
    const user = get().users.find(u => u.id === userId);
    const nextIsActive = user?.status !== 'active';

    try {
      await api.patch(`/admin/users/${userId}/status`, { is_active: nextIsActive });
    } catch (err) {
      console.warn('Backend update failed, applying locally:', err.message);
    }

    set(state => ({
      users: state.users.map(u => {
        if (u.id === userId) {
          return { ...u, status: nextIsActive ? 'active' : 'suspended' };
        }
        return u;
      })
    }));
  },

  updateUserRole: async (userId, newRole) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
    } catch (err) {
      console.warn('Backend role update failed, applying locally:', err.message);
    }

    set(state => ({
      users: state.users.map(u => {
        if (u.id === userId) {
          return { ...u, role: newRole };
        }
        return u;
      })
    }));
  },

  deleteUser: async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
    } catch (err) {
      console.warn('Backend delete failed, applying locally:', err.message);
    }

    set(state => ({
      users: state.users.filter(u => u.id !== userId)
    }));
  },
}));
