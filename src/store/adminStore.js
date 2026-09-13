import { create } from 'zustand';

export const useAdminStore = create((set, get) => ({
  stats: {
    totalStudents: 1420,
    totalHr: 86,
    resumesAnalyzed: 3892,
    activeJobs: 145,
    systemHealth: '99.98%',
    averageAtsScore: 76.4,
    messagesProcessed: 12450,
  },

  users: [
    {
      id: 'u-1',
      name: 'Sarah Connor',
      email: 'sarah.c@gmail.com',
      role: 'student',
      status: 'active',
      joinedDate: '2026-08-12',
      resumesCount: 3,
      avgAtsScore: 84,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      id: 'u-2',
      name: 'Marcus Vance',
      email: 'marcus.v@stripe.com',
      role: 'hr',
      company: 'Stripe',
      status: 'active',
      joinedDate: '2026-07-20',
      jobsPosted: 8,
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    },
    {
      id: 'u-3',
      name: 'David Chen',
      email: 'david.chen@university.edu',
      role: 'student',
      status: 'active',
      joinedDate: '2026-08-25',
      resumesCount: 2,
      avgAtsScore: 78,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      id: 'u-4',
      name: 'Elena Rostova',
      email: 'elena.r@amazon.com',
      role: 'hr',
      company: 'Amazon',
      status: 'active',
      joinedDate: '2026-06-15',
      jobsPosted: 14,
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
    {
      id: 'u-5',
      name: 'Alex Mercer',
      email: 'admin@antigravity.ai',
      role: 'admin',
      status: 'active',
      joinedDate: '2026-01-01',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    },
    {
      id: 'u-6',
      name: 'Spam Account',
      email: 'bot99@throwaway.net',
      role: 'student',
      status: 'suspended',
      joinedDate: '2026-09-02',
      resumesCount: 0,
      avgAtsScore: 0,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    }
  ],

  auditLogs: [
    { id: 1, action: 'User Suspended', target: 'bot99@throwaway.net', by: 'System AI Security', time: '10 mins ago', type: 'warning' },
    { id: 2, action: 'New HR Account Verified', target: 'marcus.v@stripe.com (Stripe)', by: 'Alex Mercer', time: '1 hour ago', type: 'success' },
    { id: 3, action: 'Batch ATS Re-index', target: '142 resumes updated', by: 'Automated Worker', time: '3 hours ago', type: 'info' },
    { id: 4, action: 'Job Moderated', target: 'Senior Cloud Architect', by: 'Alex Mercer', time: 'Yesterday', type: 'info' },
  ],

  toggleUserStatus: (userId) => {
    set(state => ({
      users: state.users.map(u => {
        if (u.id === userId) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    }));
  },

  deleteUser: (userId) => {
    set(state => ({
      users: state.users.filter(u => u.id !== userId)
    }));
  },
}));
