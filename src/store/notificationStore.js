import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [],
  sync: () => {},
  markByTarget: () => {},
  receiveNotification: (notif) => {
    set(state => ({
      notifications: [notif, ...state.notifications]
    }));
  }
}));
