import { create } from 'zustand';
import apiClient from '../services/apiClient';
import { useNotificationStore } from './notificationStore';
import { useUsersStore } from './usersStore';

let socket;
let reconnectTimer;
let connectedUser;
const apiRoot = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(/\/api\/v1\/?$/, '');

function openSocket(token, onEvent) {
  const ws = new WebSocket(`${apiRoot.replace(/^http/, 'ws')}/socket.io/?EIO=4&transport=websocket`);
  ws.onmessage = ({ data }) => {
    if (data.startsWith('0')) {
      ws.send(`40${JSON.stringify({ token })}`);
    } else if (data === '2') {
      ws.send('3');
    } else if (data.startsWith('42')) {
      try {
        const [event, payload] = JSON.parse(data.slice(2));
        onEvent(event, payload);
      } catch { /* Ignore malformed event frames. */ }
    }
  };
  return ws;
}

export const useCommunityStore = create((set, get) => ({
  conversations: [], messages: {}, activeChatId: null,
  syncConversations: async () => {
    try {
      const { data } = await apiClient.get('/messages/conversations');
      set({ conversations: data.data || [] });
      useUsersStore.getState().cacheUsers((data.data || []).map(conversation => conversation.peer));
    } catch (error) { console.error('Could not load conversations:', error.message); }
  },
  connectSocket: (userId) => {
    const token = localStorage.getItem('access_token');
    if (!token || !userId || (socket && connectedUser === userId && socket.readyState !== WebSocket.CLOSED)) return;
    socket?.close();
    clearTimeout(reconnectTimer);
    connectedUser = userId;
    const handleEvent = (event, payload) => {
      if (event === 'notification:new') {
        useNotificationStore.getState().receiveNotification(payload);
      } else if (event === 'message:new') {
        const state = get();
        const list = state.messages[payload.conversationId] || [];
        if (!list.some(item => item.id === payload.id)) {
          set({ messages: { ...state.messages, [payload.conversationId]: [...list, payload] } });
        }
        get().syncConversations();
      } else if (event === 'message:deleted') {
        set(state => ({ messages: { ...state.messages,
          [payload.conversationId]: (state.messages[payload.conversationId] || []).map(message =>
            message.id === payload.messageId ? { ...message, deleted: true, body: '' } : message) } }));
      } else if (event === 'message:read') {
        set(state => ({ messages: { ...state.messages,
          [payload.conversationId]: (state.messages[payload.conversationId] || []).map(message =>
            message.id === payload.messageId ? { ...message, readBy: [...new Set([...(message.readBy || []), payload.readerId])] } : message) } }));
      }
    };
    const open = () => {
      if (connectedUser !== userId) return;
      socket = openSocket(token, handleEvent);
      socket.onclose = () => { reconnectTimer = setTimeout(open, 2000); };
    };
    open();
  },
  disconnectSocket: () => { clearTimeout(reconnectTimer); socket?.close(); socket = null; connectedUser = null; },
  setActiveChat: async (chatId) => {
    set({ activeChatId: chatId });
    if (chatId) await get().loadMessages(chatId);
  },
  loadMessages: async (chatId) => {
    try {
      const { data } = await apiClient.get(`/messages/conversations/${chatId}`);
      set(state => ({ messages: { ...state.messages, [chatId]: data.data || [] },
        conversations: state.conversations.map(c => c.id === chatId ? { ...c, unread: 0 } : c) }));
    } catch (error) { console.error('Could not load messages:', error.message); }
  },
  sendMessage: async (chatId, body) => {
    if (!chatId || !body?.trim()) return;
    try {
      const { data } = await apiClient.post(`/messages/conversations/${chatId}/messages`, { body: body.trim() });
      const message = data.data;
      set(state => {
        const list = state.messages[chatId] || [];
        return list.some(m => m.id === message.id) ? state : { messages: { ...state.messages, [chatId]: [...list, message] } };
      });
      get().syncConversations();
    } catch (error) { throw error; }
  },
  deleteMessage: async (chatId, messageId, mode = 'me') => {
    await apiClient.delete(`/messages/conversations/${chatId}/messages/${messageId}`, { params: { mode } });
    if (mode === 'everyone') {
      set(state => ({ messages: { ...state.messages, [chatId]: (state.messages[chatId] || []).map(m => m.id === messageId ? { ...m, deleted: true, body: '' } : m) } }));
    } else {
      set(state => ({ messages: { ...state.messages, [chatId]: (state.messages[chatId] || []).filter(m => m.id !== messageId) } }));
    }
  },
  hideConversation: async (chatId) => {
    await apiClient.delete(`/messages/conversations/${chatId}`);
    set(state => ({ conversations: state.conversations.filter(c => c.id !== chatId), activeChatId: state.activeChatId === chatId ? null : state.activeChatId }));
  },
  clearAllChats: async () => {
    await apiClient.delete('/messages');
    set({ conversations: [], messages: {}, activeChatId: null });
  },
  startDM: async (userId) => {
    const { data } = await apiClient.post(`/messages/conversations/${userId}`);
    const conversation = data.data;
    useUsersStore.getState().cacheUsers([conversation.peer]);
    set(state => ({ conversations: [conversation, ...state.conversations.filter(c => c.id !== conversation.id)],
      messages: { ...state.messages, [conversation.id]: state.messages[conversation.id] || [] }, activeChatId: conversation.id }));
    return conversation.id;
  },
  markNotifsByTarget: () => {},
}));
