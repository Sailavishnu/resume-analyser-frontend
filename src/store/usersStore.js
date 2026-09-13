import { create } from 'zustand';

const initialUsers = [
  {
    id: 'u-karthik',
    name: 'Karthik Kumar',
    jobRole: 'Technical Recruiter',
    company: 'Zoho Corporation',
    college: 'Anna University Alumni',
    isVerified: true,
    bio: 'Lead technical recruiter specializing in Full Stack, Cloud infrastructure, and DevOps talent.',
    gradYear: '2019'
  },
  {
    id: 'u-meenakshi',
    name: 'Meenakshi Devi',
    jobRole: 'Talent Acquisition Partner',
    company: 'Infosys Limited',
    college: 'NIT Trichy Alumni',
    isVerified: true,
    bio: 'Hiring software engineers and campus graduates for strategic digital innovation projects.',
    gradYear: '2020'
  },
  {
    id: 'u-suresh',
    name: 'Suresh Kannan',
    jobRole: 'Engineering Manager',
    company: 'Freshworks',
    college: 'PSG Tech Alumni',
    isVerified: true,
    bio: 'Overseeing frontend architecture and developer tooling teams. Active campus mentor.',
    gradYear: '2017'
  },
  {
    id: 'u-priya',
    name: 'Priya Lakshmi',
    jobRole: 'Full Stack Candidate',
    company: '',
    college: 'College of Engineering, Guindy',
    isVerified: true,
    bio: 'Final year CSE undergraduate with expertise in React, Node.js, and Docker. 98% ATS score.',
    gradYear: '2026'
  },
  {
    id: 'u-aakash',
    name: 'Aakash Sai',
    jobRole: 'Backend Developer Candidate',
    company: '',
    college: 'Madras Institute of Technology',
    isVerified: false,
    bio: 'Passionate about distributed backend systems, Go, Python, and PostgreSQL query tuning.',
    gradYear: '2026'
  },
  {
    id: 'u-divya',
    name: 'Divya Kannan',
    jobRole: 'Frontend UI/UX Candidate',
    company: '',
    college: 'SSN College of Engineering',
    isVerified: true,
    bio: 'Specializing in design systems, TailwindCSS, Framer Motion, and micro-frontend development.',
    gradYear: '2026'
  },
  {
    id: 'u-swathi',
    name: 'Swathi Ramesh',
    jobRole: 'Data Analytics Candidate',
    company: '',
    college: 'Vellore Institute of Technology',
    isVerified: true,
    bio: 'Data science practitioner with background in SQL, PowerBI, predictive modeling, and ETL.',
    gradYear: '2026'
  }
];

export const useUsersStore = create((set, get) => ({
  users: initialUsers,
  seniors: initialUsers.filter(u => u.company),
  peers: initialUsers.filter(u => !u.company),
  blocked: [],

  getById: (id) => {
    return get().users.find(u => String(u.id) === String(id)) || null;
  },

  block: (userId) => {
    const user = get().getById(userId);
    if (!user) return;
    set(state => ({
      blocked: [...state.blocked.filter(b => b.id !== userId), user],
      users: state.users.filter(u => u.id !== userId),
      seniors: state.seniors.filter(u => u.id !== userId),
      peers: state.peers.filter(u => u.id !== userId)
    }));
  },

  unblockMany: (userIds) => {
    const unblockedUsers = get().blocked.filter(b => userIds.includes(b.id));
    set(state => ({
      blocked: state.blocked.filter(b => !userIds.includes(b.id)),
      users: [...state.users, ...unblockedUsers],
      seniors: [...state.seniors, ...unblockedUsers.filter(u => u.company)],
      peers: [...state.peers, ...unblockedUsers.filter(u => !u.company)]
    }));
  },

  sync: () => {}
}));
