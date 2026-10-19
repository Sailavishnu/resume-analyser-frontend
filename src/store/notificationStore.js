import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import apiClient from '../services/apiClient';

let initializedFor = null;

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  sync: async (userId) => {
    if (!userId || !localStorage.getItem('access_token')) return;
    try {
      const { data } = await apiClient.get('/notifications', { params: { page: 1, page_size: 100, unread_only: true } });
      const next = data.data || [];
      const firstLoad = initializedFor !== userId;
      const existing = new Set(get().notifications.map(n => n.id));
      set({ notifications: next });
      if (!firstLoad) next.filter(n => !existing.has(n.id)).forEach(n => {
        toast(`${n.title}: ${n.message}`, { duration: 8000, icon: '🔔' });
      });
      initializedFor = userId;
    } catch (error) { console.warn('Could not sync notifications:', error.message); }
  },
  dismiss: async (id) => {
    try {
      await apiClient.delete(`/notifications/${id}`);
      set(state => ({ notifications: state.notifications.filter(n => n.id !== id) }));
    } catch (error) { toast.error(error.message || 'Could not dismiss notification.'); }
  },
  dismissAll: async () => {
    try {
      await apiClient.post('/notifications/read-all');
      set({ notifications: [] });
    } catch (error) { toast.error(error.message || 'Could not clear notifications.'); }
  },
  receiveNotification: (notif) => {
    if (!get().notifications.some(n => n.id === notif.id)) toast(`${notif.title}: ${notif.message}`, { duration: 8000, icon: '🔔' });
    set(state => ({ notifications: [notif, ...state.notifications.filter(n => n.id !== notif.id)] }));
  },
  markByTarget: (target) => {
    const chatId = new URLSearchParams((target || '').split('?')[1] || '').get('chat');
    if (chatId) set(state => ({ notifications: state.notifications.filter(n => !(n.type === 'message' && n.related_entity_id === chatId)) }));
  },
}));
