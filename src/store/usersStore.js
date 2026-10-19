import { create } from 'zustand';

// Messaging contacts are loaded from the authenticated API; this store only caches them for UI lookup.
export const useUsersStore = create((set, get) => ({
  users: [], seniors: [], peers: [], blocked: [],
  getById: (id) => get().users.find(user => String(user.id) === String(id)) || null,
  cacheUsers: (users = []) => set(state => {
    const byId = new Map(state.users.map(user => [String(user.id), user]));
    users.filter(Boolean).forEach(user => byId.set(String(user.id), user));
    const all = [...byId.values()];
    return { users: all, seniors: all.filter(user => user.role === 'hr'), peers: all.filter(user => user.role === 'student') };
  }),
  block: (userId) => {
    const user = get().getById(userId);
    if (!user) return;
    set(state => ({ blocked: [...state.blocked.filter(item => item.id !== user.id), user] }));
  },
  unblockMany: (userIds) => set(state => ({ blocked: state.blocked.filter(user => !userIds.includes(user.id)) })),
  sync: () => {},
}));
