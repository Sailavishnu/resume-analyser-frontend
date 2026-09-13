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
      email: 'admin@placementhub.edu',
      role: 'admin',
      status: 'active',
      joinedDate: '2026-01-01',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    },
    {
      id: 'u-6',
      name: 'Murugan Test',
      email: 'test.murugan@tempmail.com',
      role: 'student',
      status: 'suspended',
      joinedDate: '2026-09-02',
      resumesCount: 0,
      avgAtsScore: 0,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    }
  ],

  auditLogs: [
    { id: 1, action: 'User Suspended', target: 'test.murugan@tempmail.com', by: 'System AI Security', time: '10 mins ago', type: 'warning' },
    { id: 2, action: 'New HR Account Verified', target: 'karthik.k@zoho.com (Zoho Corporation)', by: 'Suresh Kannan', time: '1 hour ago', type: 'success' },
    { id: 3, action: 'Batch ATS Re-index', target: '142 resumes updated', by: 'Automated Worker', time: '3 hours ago', type: 'info' },
    { id: 4, action: 'Job Moderated', target: 'Senior Full Stack Engineer', by: 'Suresh Kannan', time: 'Yesterday', type: 'info' },
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
