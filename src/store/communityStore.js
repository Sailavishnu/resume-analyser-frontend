import { create } from 'zustand';

const initialConversations = [
  {
    id: 'c-karthik',
    type: 'direct',
    peerId: 'u-karthik',
    participants: ['me', 'u-karthik'],
    unread: 1
  },
  {
    id: 'c-meenakshi',
    type: 'direct',
    peerId: 'u-meenakshi',
    participants: ['me', 'u-meenakshi'],
    unread: 0
  },
  {
    id: 'c-campus-channel',
    type: 'group',
    name: 'campus-placement-2026',
    company: 'Placement Cell',
    participants: ['me', 'u-karthik', 'u-meenakshi', 'u-suresh', 'u-aakash'],
    unread: 2
  },
  {
    id: 'c-suresh',
    type: 'direct',
    peerId: 'u-suresh',
    participants: ['me', 'u-suresh'],
    unread: 0
  }
];

const now = Date.now();
const minAgo = (m) => new Date(now - m * 60 * 1000).toISOString();
const hourAgo = (h) => new Date(now - h * 60 * 60 * 1000).toISOString();
const dayAgo = (d) => new Date(now - d * 24 * 60 * 60 * 1000).toISOString();

const initialMessages = {
  'c-karthik': [
    {
      id: 'm1',
      authorId: 'u-karthik',
      body: 'Hello! I reviewed your profile and analyzed CV on the placement portal. Your 98% ATS score was among the top in this drive.',
      createdAt: dayAgo(1),
      readBy: ['me', 'u-karthik'],
      deleted: false
    },
    {
      id: 'm2',
      authorId: 'me',
      body: 'Thank you Karthik sir! I spent considerable time optimizing the project descriptions and quantifying the impact metrics.',
      createdAt: hourAgo(4),
      readBy: ['u-karthik'],
      deleted: false
    },
    {
      id: 'm3',
      authorId: 'u-karthik',
      body: 'That clearly shows. Are you available for a 45-minute technical discussion this Thursday at 3:00 PM?',
      createdAt: minAgo(15),
      readBy: [],
      deleted: false
    }
  ],
  'c-meenakshi': [
    {
      id: 'm4',
      authorId: 'u-meenakshi',
      body: 'Hi, we noticed your strong background with React and Node.js. Infosys Digital is hiring for our core engineering lab.',
      createdAt: dayAgo(2),
      readBy: ['me', 'u-meenakshi'],
      deleted: false
    },
    {
      id: 'm5',
      authorId: 'me',
      body: 'Hello Meenakshi mam, thank you for reaching out! Yes, I would love to explore the opportunities.',
      createdAt: dayAgo(1),
      readBy: ['u-meenakshi'],
      deleted: false
    }
  ],
  'c-campus-channel': [
    {
      id: 'm6',
      authorId: 'u-suresh',
      body: 'Welcome everyone! Freshworks campus hackathon and direct interview registrations are now live on the portal.',
      createdAt: hourAgo(6),
      readBy: ['me', 'u-suresh'],
      deleted: false
    },
    {
      id: 'm7',
      authorId: 'u-karthik',
      body: 'Zoho technical shortlist round 1 will conclude tomorrow at 6 PM. Make sure your latest ATS resume is set to Primary.',
      createdAt: minAgo(40),
      readBy: [],
      deleted: false
    }
  ],
  'c-suresh': [
    {
      id: 'm8',
      authorId: 'u-suresh',
      body: 'Impressive work on your resume projects. Make sure to keep your GitHub pinned repositories updated.',
      createdAt: dayAgo(3),
      readBy: ['me', 'u-suresh'],
      deleted: false
    }
  ]
};

export const useCommunityStore = create((set, get) => ({
  conversations: initialConversations,
  messages: initialMessages,
  activeChatId: 'c-karthik',

  setActiveChat: (chatId) => {
    set(state => {
      // Mark unread as 0 when opening chat
      const updatedConvs = state.conversations.map(c =>
        c.id === chatId ? { ...c, unread: 0 } : c
      );
      return { activeChatId: chatId, conversations: updatedConvs };
    });
  },

  sendMessage: (chatId, body) => {
    if (!chatId || !body) return;
    const newMsg = {
      id: 'm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      authorId: 'me',
      body,
      createdAt: new Date().toISOString(),
      readBy: [],
      deleted: false
    };

    set(state => {
      const current = state.messages[chatId] || [];
      return {
        messages: {
          ...state.messages,
          [chatId]: [...current, newMsg]
        }
      };
    });

    // Simulate peer read receipt & realistic response after 2 seconds if direct message
    const conv = get().conversations.find(c => c.id === chatId);
    if (conv && conv.type === 'direct') {
      setTimeout(() => {
        set(state => {
          const list = state.messages[chatId] || [];
          const updated = list.map(m => m.id === newMsg.id ? { ...m, readBy: [conv.peerId] } : m);
          return {
            messages: { ...state.messages, [chatId]: updated }
          };
        });
      }, 1500);

      setTimeout(() => {
        const replyMsg = {
          id: 'm_reply_' + Date.now(),
          authorId: conv.peerId,
          body: 'Noted! I have updated our recruitment notes accordingly. Looking forward to speaking soon.',
          createdAt: new Date().toISOString(),
          readBy: ['me', conv.peerId],
          deleted: false
        };
        set(state => {
          const list = state.messages[chatId] || [];
          return {
            messages: { ...state.messages, [chatId]: [...list, replyMsg] }
          };
        });
      }, 3500);
    }
  },

  loadMessages: () => {},

  deleteMessage: (chatId, messageId, mode) => {
    set(state => {
      const list = state.messages[chatId] || [];
      const updated = list.map(m => {
        if (m.id !== messageId) return m;
        if (mode === 'everyone') return { ...m, deleted: true };
        return null;
      }).filter(Boolean);

      return {
        messages: { ...state.messages, [chatId]: updated }
      };
    });
  },

  hideConversation: (chatId) => {
    set(state => ({
      conversations: state.conversations.filter(c => c.id !== chatId),
      activeChatId: state.activeChatId === chatId ? null : state.activeChatId
    }));
  },

  clearAllChats: () => {
    set({
      conversations: [],
      messages: {},
      activeChatId: null
    });
  },

  startDM: (userId) => {
    const existing = get().conversations.find(c => c.type === 'direct' && String(c.peerId) === String(userId));
    if (existing) {
      get().setActiveChat(existing.id);
      return existing.id;
    }

    const newId = 'c_dm_' + Date.now();
    const newConv = {
      id: newId,
      type: 'direct',
      peerId: userId,
      participants: ['me', userId],
      unread: 0
    };

    set(state => ({
      conversations: [newConv, ...state.conversations],
      messages: { ...state.messages, [newId]: [] },
      activeChatId: newId
    }));

    return newId;
  },

  receiveMessage: (chatId, message) => {
    set(state => {
      const current = state.messages[chatId] || [];
      return {
        messages: { ...state.messages, [chatId]: [...current, message] }
      };
    });
  },

  syncConversations: () => {},
  syncPosts: () => {}
}));
