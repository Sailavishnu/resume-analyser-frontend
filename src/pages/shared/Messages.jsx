import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Send, Hash, ArrowLeft, Search, BadgeCheck,
  MoreVertical, Plus, Trash2, UserX, X, Ban,
  Settings as SettingsIcon, Check, CheckCheck, Copy, Info
} from 'lucide-react';
import { useCommunityStore } from '../../store/communityStore';
import { useAuthStore } from '../../store/authStore';
import { useUsersStore } from '../../store/usersStore';
import { useNotificationStore } from '../../store/notificationStore';
import { getCompanyColor } from '../../utils/uiMeta';
import apiClient from '../../services/apiClient';
import toast from 'react-hot-toast';

const EMPTY_MESSAGES = [];
const UNSEND_WINDOW_MS = 60 * 60 * 1000;

// ── helpers ───────────────────────────────────────────────────────────────────

function formatTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function timeAgo(iso) {
  if (!iso) return '';
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60)        return 'now';
  if (d < 3600)      return `${Math.floor(d / 60)}m`;
  if (d < 86400)     return `${Math.floor(d / 3600)}h`;
  if (d < 86400 * 7) return `${Math.floor(d / 86400)}d`;
  return new Date(iso).toLocaleDateString();
}

function dateLabel(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
  const same = (a, b) => a.toDateString() === b.toDateString();
  if (same(d, today))     return 'Today';
  if (same(d, yesterday)) return 'Yesterday';
  const diff = (today - d) / (1000 * 60 * 60 * 24);
  if (diff < 7) return d.toLocaleDateString([], { weekday: 'long' });
  return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: d.getFullYear() === today.getFullYear() ? undefined : 'numeric' });
}

function initials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || name[0].toUpperCase();
}

function getConversationMeta(conv, myId, lookupUser) {
  if (!conv) return null;
  if (conv.type === 'group') {
    const count = (conv.participants?.length) ?? (conv.members?.length) ?? 0;
    return {
      title: `#${conv.name || 'channel'}`,
      subtitle: `${count} member${count === 1 ? '' : 's'}`,
      color: getCompanyColor(conv.company || conv.name),
      letter: '#',
      isGroup: true,
      peer: null,
    };
  }
  const peerId = conv.peerId ?? (conv.participants || []).find(id => String(id) !== String(myId));
  const peer = (lookupUser ? lookupUser(peerId) : null) || conv.peer || null;
  return {
    title: peer?.name || 'Recruitment Chat',
    subtitle: peer?.username
      ? `@${peer.username} · ${peer.role === 'hr' ? 'HR' : 'Student'}`
      : (peer?.college || 'Placement Candidate'),
    color: '#6366f1',
    letter: initials(peer?.name),
    isGroup: false,
    verified: peer?.isVerified ?? true,
    peer,
    peerId,
  };
}

// ── Top action bar (above the whole messages page) ───────────────────────────

function TopActionBar({ onNewChat, onOpenSettings }) {
  const me = useAuthStore(s => s.user);
  const totalUnread = useCommunityStore(
    s => s.conversations.reduce((sum, c) => sum + (c.unread || 0), 0)
  );

  return (
    <>
    <div className="flex items-center gap-3 px-4 py-3 bg-[#F8F9FF] dark:bg-[#13131f] border-b border-[#E2E6F0] dark:border-[#272A38]">
      {/* My identity */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {initials(me?.name)}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[#07090f] dark:text-[#F0F2FF] truncate">{me?.name || 'You'}</div>
          <div className="text-xs text-[#8890A8] truncate">
            {totalUnread > 0 ? `${totalUnread} unread message${totalUnread === 1 ? '' : 's'}` : 'All caught up'}
          </div>
        </div>
      </div>

      {/* Actions */}
      <button onClick={onNewChat}
        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors cursor-pointer">
        <Plus size={14} /> New chat
      </button>
      <button onClick={onNewChat} title="New chat"
        className="sm:hidden w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors cursor-pointer">
        <Plus size={16} />
      </button>
      <button onClick={onOpenSettings} title="Settings"
        className="w-10 h-10 rounded-xl border border-[#E2E6F0] dark:border-[#272A38] text-[#3d4468] dark:text-[#8890A8] hover:bg-white dark:hover:bg-[#1a1a2e] flex items-center justify-center transition-colors cursor-pointer">
        <SettingsIcon size={16} />
      </button>
    </div>
    <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/30 text-xs text-indigo-600 dark:text-indigo-400">
      <Info size={14} className="shrink-0" />
      <span>Message students and HR directly. New messages sync in real time.</span>
    </div>
    </>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function ConversationList({ onSelect, activeId, search, setSearch }) {
  const conversations = useCommunityStore(s => s.conversations);
  const messages      = useCommunityStore(s => s.messages);
  const myId          = useAuthStore(s => s.user?.id) || 'me';
  const lookupUser    = useUsersStore(s => s.getById);

  const sorted = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const aMsgs = messages[a.id] || [];
      const bMsgs = messages[b.id] || [];
      const aLast = aMsgs[aMsgs.length - 1] || a.lastMessage;
      const bLast = bMsgs[bMsgs.length - 1] || b.lastMessage;
      const aTime = aLast ? new Date(aLast.createdAt).getTime() : 0;
      const bTime = bLast ? new Date(bLast.createdAt).getTime() : 0;
      return bTime - aTime;
    });
  }, [conversations, messages]);

  const filtered = sorted.filter(c => {
    if (!search.trim()) return true;
    const meta = getConversationMeta(c, myId, lookupUser);
    return meta?.title.toLowerCase().includes(search.toLowerCase()) ||
           meta?.subtitle.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-[#E2E6F0] dark:border-[#272A38]">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8890A8]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search chats…"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E6F0] dark:border-[#272A38] bg-[#F8F9FF] dark:bg-[#13131f] text-sm outline-none focus:border-indigo-500 text-[#07090f] dark:text-[#F0F2FF]" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="text-center py-12 px-4 text-xs text-[#8890A8]">
            {conversations.length === 0 ? 'No chats yet. Tap + to start one.' : 'No chats match.'}
          </div>
        )}
        {filtered.map(c => {
          const meta = getConversationMeta(c, myId, lookupUser);
          if (!meta) return null;
          const msgs = messages[c.id] || [];
          const last = msgs[msgs.length - 1] || c.lastMessage;
          const isActive = c.id === activeId;
          const lastIsMine = last && (String(last.authorId) === String(myId) || last.authorId === 'me');
          return (
            <button key={c.id} onClick={() => onSelect(c.id)}
              className={`w-full flex items-start gap-3 p-3 border-b border-[#E2E6F0] dark:border-[#272A38] text-left transition-colors cursor-pointer
                ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-[#F8F9FF] dark:hover:bg-[#13131f]'}`}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: meta.color }}>
                {meta.isGroup ? <Hash size={16} /> : meta.letter}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="font-semibold text-sm text-[#07090f] dark:text-[#F0F2FF] truncate">{meta.title}</span>
                    {meta.verified && <BadgeCheck size={12} className="text-indigo-500 flex-shrink-0" />}
                  </div>
                  {last && <span className="text-xs text-[#8890A8] flex-shrink-0">{timeAgo(last.createdAt)}</span>}
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="text-xs text-[#3d4468] dark:text-[#8890A8] truncate">
                    {last
                      ? (last.deleted
                          ? <span className="italic">message deleted</span>
                          : `${lastIsMine ? 'You: ' : ''}${last.body}`)
                      : meta.subtitle}
                  </p>
                  {c.unread > 0 && (
                    <span className="bg-indigo-500 text-white text-[10px] font-bold rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Tick receipts (WhatsApp-style) ───────────────────────────────────────────

function TickReceipt({ m, conversation, myId }) {
  // Only for messages I sent
  const isMe = String(m.authorId) === String(myId) || m.authorId === 'me';
  if (!isMe || m.deleted) return null;

  const readers = (m.readBy || []).filter(id => String(id) !== String(myId) && id !== 'me');
  const otherParticipants = (conversation?.participants || []).filter(id => String(id) !== String(myId) && id !== 'me');
  const everyoneRead = otherParticipants.length > 0
    && otherParticipants.every(uid => readers.some(r => String(r) === String(uid)));

  if (typeof m.id === 'string' && m.id.startsWith('m_')) {
    if (readers.length > 0) return <CheckCheck size={13} className="text-sky-300 inline" />;
    return <Check size={13} className="text-white/60 inline" />;
  }
  if (everyoneRead) return <CheckCheck size={13} className="text-sky-300 inline" />;
  if (readers.length > 0) return <CheckCheck size={13} className="text-white/70 inline" />;
  return <Check size={13} className="text-white/70 inline" />;
}

// ── Context menu (right-click / long-press) ─────────────────────────────────

function useContextMenu() {
  const [menu, setMenu] = useState(null);
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    document.addEventListener('mousedown', close);
    document.addEventListener('scroll', close, true);
    document.addEventListener('keydown', e => e.key === 'Escape' && close());
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('scroll', close, true);
    };
  }, [menu]);
  return [menu, setMenu];
}

function ContextMenu({ menu }) {
  if (!menu) return null;
  return (
    <div onMouseDown={e => e.stopPropagation()}
      className="fixed z-50 min-w-[180px] bg-white dark:bg-[#13131f] border border-[#E2E6F0] dark:border-[#272A38] rounded-xl shadow-xl overflow-hidden"
      style={{ top: menu.y, left: menu.x }}>
      {menu.items.map((it, i) => (
        <button key={i} onClick={(e) => { e.stopPropagation(); it.onClick(); }}
          className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors cursor-pointer
            ${it.danger
              ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
              : 'text-[#1e2340] dark:text-[#c8cce0] hover:bg-[#F8F9FF] dark:hover:bg-[#1a1a2e]'}`}>
          {it.icon && <it.icon size={14} />} {it.label}
        </button>
      ))}
    </div>
  );
}

// ── Message bubble ──────────────────────────────────────────────────────────

function MessageBubble({ m, isMe, showAvatar, showAuthor, author, conversation, myId, onContext, highlighted }) {
  function handleContext(e) {
    e.preventDefault();
    onContext({ x: e.clientX, y: e.clientY, msg: m, isMe });
  }
  return (
    <div className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
      {!isMe && (
        <div className="w-7 h-7 flex-shrink-0">
          {showAvatar && (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
              {initials(author?.name)}
            </div>
          )}
        </div>
      )}
      <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
        {showAuthor && <span className="text-xs text-[#8890A8] mb-0.5 px-2">{author?.name || 'Unknown'}</span>}
        <div onContextMenu={handleContext}
          className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed select-text transition-colors
            ${highlighted ? 'ring-2 ring-amber-400' : ''}
            ${m.deleted
              ? 'bg-[#F0F2FF] dark:bg-[#1a1a2e] text-[#8890A8] italic'
              : isMe
                ? 'bg-indigo-600 text-white rounded-br-sm'
                : 'bg-white dark:bg-[#13131f] border border-[#E2E6F0] dark:border-[#272A38] text-[#1e2340] dark:text-[#c8cce0] rounded-bl-sm'}`}>
          {m.deleted ? 'This message was deleted' : m.body}
          {isMe && !m.deleted && (
            <span className="inline-flex items-center gap-0.5 ml-2 align-middle">
              <span className="text-[10px] text-white/70">{formatTime(m.createdAt)}</span>
              <TickReceipt m={m} conversation={conversation} myId={myId} />
            </span>
          )}
        </div>
        {!isMe && (
          <span className="text-[10px] text-[#8890A8] mt-0.5 px-2">{formatTime(m.createdAt)}</span>
        )}
      </div>
    </div>
  );
}

// ── Chat window ──────────────────────────────────────────────────────────────

function ChatWindow({ chatId, onBack, onViewProfile }) {
  const conversation     = useCommunityStore(s => s.conversations.find(c => c.id === chatId));
  const messages         = useCommunityStore(s => s.messages[chatId]) ?? EMPTY_MESSAGES;
  const sendMessage      = useCommunityStore(s => s.sendMessage);
  const loadMessages     = useCommunityStore(s => s.loadMessages);
  const deleteMessage    = useCommunityStore(s => s.deleteMessage);
  const hideConversation = useCommunityStore(s => s.hideConversation);
  const blockUser        = useUsersStore(s => s.block);
  const markNotifsByTarget = useNotificationStore(s => s.markByTarget);
  const myId             = useAuthStore(s => s.user?.id) || 'me';
  const lookupUser       = useUsersStore(s => s.getById);
  const [text, setText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [highlightId, setHighlightId] = useState(null);
  const endRef = useRef(null);
  const [menu, setMenu] = useContextMenu();

  useEffect(() => {
    if (!chatId) return;
    loadMessages(chatId);
    markNotifsByTarget(`/messages?chat=${chatId}`);
  }, [chatId, loadMessages, markNotifsByTarget]);

  useEffect(() => {
    if (!showSearch) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, showSearch]);

  const meta = getConversationMeta(conversation, myId, lookupUser);

  function handleSend() {
    if (!text.trim()) return;
    sendMessage(chatId, text.trim()).then(() => setText('')).catch(error => toast.error(error.message || 'Message could not be sent.'));
  }

  function handleDeleteConvo() {
    if (!confirm('Delete this conversation? It will disappear from your list.')) return;
    hideConversation(chatId);
  }

  function handleBlock() {
    if (!meta.peer) return;
    if (!confirm(`Block ${meta.peer.name}? They won't be able to message you.`)) return;
    blockUser(meta.peer.id);
    hideConversation(chatId);
  }

  function openContext({ x, y, msg, isMe }) {
    const canUnsend = isMe && !msg.deleted && (Date.now() - new Date(msg.createdAt).getTime()) < UNSEND_WINDOW_MS;
    const items = [
      { label: 'Copy', icon: Copy, onClick: () => { navigator.clipboard.writeText(msg.body || ''); setMenu(null); } },
    ];
    if (!msg.deleted) {
      items.push({ label: 'Delete for me', icon: Trash2, danger: true, onClick: () => { deleteMessage(chatId, msg.id, 'me'); setMenu(null); } });
      if (canUnsend) {
        items.push({ label: 'Delete for everyone', icon: Trash2, danger: true, onClick: () => { deleteMessage(chatId, msg.id, 'everyone'); setMenu(null); } });
      }
    }
    setMenu({ x, y, items });
  }

  const rendered = useMemo(() => {
    const out = [];
    let lastDate = '';
    messages.forEach((m, i) => {
      const d = dateLabel(m.createdAt);
      if (d !== lastDate) {
        out.push({ type: 'date', key: 'd-' + i, label: d });
        lastDate = d;
      }
      const prev = messages[i - 1];
      const next = messages[i + 1];
      const sameDayAsPrev = prev && dateLabel(prev.createdAt) === d;
      const sameAuthorAsPrev = sameDayAsPrev && String(prev?.authorId) === String(m.authorId);
      const sameAuthorAsNext = next && dateLabel(next.createdAt) === d && String(next?.authorId) === String(m.authorId);
      out.push({
        type: 'msg', key: m.id || i, m,
        showAvatar: !sameAuthorAsNext,
        showAuthor: !!meta?.isGroup && !sameAuthorAsPrev,
      });
    });
    return out;
  }, [messages, meta?.isGroup]);

  const searchMatches = useMemo(() => {
    if (!showSearch || !searchQ.trim()) return [];
    const q = searchQ.toLowerCase();
    return messages.filter(m => !m.deleted && (m.body || '').toLowerCase().includes(q));
  }, [showSearch, searchQ, messages]);

  function jumpTo(msgId) {
    setHighlightId(msgId);
    const el = document.getElementById(`msg-${msgId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => setHighlightId(null), 1500);
  }

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center text-center p-8 bg-[#FAFBFF] dark:bg-[#0a0a14]">
        <div className="space-y-2">
          <div className="text-4xl">💬</div>
          <p className="text-sm font-semibold text-[#07090f] dark:text-[#F0F2FF]">Select a conversation</p>
          <p className="text-xs text-[#8890A8]">Pick a chat from the left panel or click New Chat to message a recruiter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-[#E2E6F0] dark:border-[#272A38] bg-[#F8F9FF] dark:bg-[#13131f]">
        <button onClick={onBack} className="md:hidden text-[#3d4468] dark:text-[#8890A8] cursor-pointer">
          <ArrowLeft size={18} />
        </button>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ background: meta.color }}>
          {meta.isGroup ? <Hash size={16} /> : meta.letter}
        </div>
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => meta.peer && onViewProfile(meta.peer)}>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-sm text-[#07090f] dark:text-[#F0F2FF] truncate">{meta.title}</span>
            {meta.verified && <BadgeCheck size={13} className="text-indigo-500" />}
          </div>
          <div className="text-xs text-[#8890A8] truncate">{meta.subtitle}</div>
        </div>
        <button onClick={() => setShowSearch(v => !v)} title="Search in chat"
          className="w-9 h-9 rounded-lg hover:bg-[#F0F2FF] dark:hover:bg-[#1a1a2e] text-[#3d4468] dark:text-[#8890A8] flex items-center justify-center cursor-pointer">
          <Search size={16} />
        </button>
        <HeaderMenu peer={meta.peer}
          onViewProfile={() => meta.peer && onViewProfile(meta.peer)}
          onBlock={handleBlock}
          onDelete={handleDeleteConvo} />
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="border-b border-[#E2E6F0] dark:border-[#272A38] bg-amber-50/40 dark:bg-amber-900/10 p-2 space-y-2">
          <div className="flex items-center gap-2">
            <Search size={14} className="text-[#8890A8] flex-shrink-0" />
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)} autoFocus
              placeholder="Find messages in this chat…"
              className="flex-1 px-2 py-1 rounded border border-[#E2E6F0] dark:border-[#272A38] bg-white dark:bg-[#0a0a14] text-sm outline-none text-[#07090f] dark:text-[#F0F2FF]" />
            <button onClick={() => { setShowSearch(false); setSearchQ(''); }} className="text-[#8890A8] hover:text-[#3d4468] cursor-pointer">
              <X size={14} />
            </button>
          </div>
          {searchQ.trim() && (
            <div className="max-h-32 overflow-y-auto text-xs">
              {searchMatches.length === 0
                ? <div className="text-[#8890A8] text-center py-2">No matches.</div>
                : searchMatches.map(m => (
                    <button key={m.id} onClick={() => jumpTo(m.id)}
                      className="w-full text-left px-2 py-1.5 hover:bg-white dark:hover:bg-[#13131f] rounded text-[#3d4468] dark:text-[#8890A8] truncate cursor-pointer">
                      <span className="text-[#07090f] dark:text-[#F0F2FF]">{m.body}</span>
                      <span className="ml-2 text-[10px]">· {formatTime(m.createdAt)}</span>
                    </button>
                  ))}
            </div>
          )}
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1.5 bg-[#FAFBFF] dark:bg-[#0a0a14]">
        {messages.length === 0 && (
          <div className="text-center text-xs text-[#8890A8] py-8">No messages yet — say hi!</div>
        )}
        {rendered.map(item => {
          if (item.type === 'date') {
            return (
              <div key={item.key} className="flex justify-center my-3">
                <span className="text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-full bg-[#E2E6F0] dark:bg-[#272A38] text-[#3d4468] dark:text-[#8890A8] font-semibold">
                  {item.label}
                </span>
              </div>
            );
          }
          const m = item.m;
          const isMe = String(m.authorId) === String(myId) || m.authorId === 'me';
          const author = lookupUser(m.authorId) || conversation?.peer;
          return (
            <div id={`msg-${m.id}`} key={item.key}>
              <MessageBubble
                m={m}
                isMe={isMe}
                showAvatar={item.showAvatar}
                showAuthor={item.showAuthor && !isMe}
                author={author}
                conversation={conversation}
                myId={myId}
                onContext={openContext}
                highlighted={highlightId === m.id}
              />
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[#E2E6F0] dark:border-[#272A38] bg-[#F8F9FF] dark:bg-[#13131f]">
        <div className="flex gap-2">
          <input value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            placeholder={meta.isGroup ? `Message #${conversation.name}` : `Message ${meta.title}…`}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E6F0] dark:border-[#272A38] bg-white dark:bg-[#0a0a14] text-sm outline-none focus:border-indigo-500 text-[#07090f] dark:text-[#F0F2FF]" />
          <button onClick={handleSend} disabled={!text.trim()}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors cursor-pointer">
            <Send size={16} />
          </button>
        </div>
      </div>

      <ContextMenu menu={menu} />
    </div>
  );
}

// ── Header 3-dot menu ────────────────────────────────────────────────────────

function HeaderMenu({ peer, onViewProfile, onBlock, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    if (open) document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v => !v)}
        className="w-9 h-9 rounded-lg hover:bg-[#F0F2FF] dark:hover:bg-[#1a1a2e] text-[#3d4468] dark:text-[#8890A8] flex items-center justify-center cursor-pointer">
        <MoreVertical size={18} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-[#13131f] border border-[#E2E6F0] dark:border-[#272A38] rounded-xl shadow-lg overflow-hidden z-10">
          {peer && (
            <button onClick={() => { setOpen(false); onViewProfile(); }}
              className="w-full px-3 py-2.5 text-left text-sm hover:bg-[#F8F9FF] dark:hover:bg-[#1a1a2e] text-[#1e2340] dark:text-[#c8cce0] cursor-pointer">
              View profile
            </button>
          )}
          {peer && (
            <button onClick={() => { setOpen(false); onBlock(); }}
              className="w-full px-3 py-2.5 text-left text-sm hover:bg-[#F8F9FF] dark:hover:bg-[#1a1a2e] text-amber-600 flex items-center gap-2 cursor-pointer">
              <Ban size={14} /> Block {peer.name}
            </button>
          )}
          <button onClick={() => { setOpen(false); onDelete(); }}
            className="w-full px-3 py-2.5 text-left text-sm hover:bg-[#F8F9FF] dark:hover:bg-[#1a1a2e] text-red-500 flex items-center gap-2 cursor-pointer">
            <Trash2 size={14} /> Delete conversation
          </button>
        </div>
      )}
    </div>
  );
}

// ── New chat picker ──────────────────────────────────────────────────────────

function NewChatPicker({ onClose, onPick }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q.trim().length < 2) { setResults([]); return undefined; }
    let alive = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get('/messages/users', { params: { query: q.trim() } });
        if (alive) setResults(data.data || []);
      } catch (error) {
        if (alive) toast.error(error.message || 'Could not search users.');
      } finally { if (alive) setLoading(false); }
    }, 250);
    return () => { alive = false; clearTimeout(timer); };
  }, [q]);

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-[#13131f] rounded-2xl border border-[#E2E6F0] dark:border-[#272A38] max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-[#E2E6F0] dark:border-[#272A38]">
          <h3 className="text-base font-semibold text-[#07090f] dark:text-[#F0F2FF]">New conversation</h3>
          <button onClick={onClose} className="text-[#8890A8] hover:text-[#07090f] dark:hover:text-white cursor-pointer"><X size={18} /></button>
        </div>
        <div className="p-3 border-b border-[#E2E6F0] dark:border-[#272A38]">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8890A8]" />
            <input value={q} onChange={e => setQ(e.target.value)} autoFocus
              placeholder="Search by username, name, or email…"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E6F0] dark:border-[#272A38] bg-[#F8F9FF] dark:bg-[#13131f] text-sm outline-none focus:border-indigo-500 text-[#07090f] dark:text-[#F0F2FF]" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading && <div className="text-center py-8 text-xs text-[#8890A8]">Searching…</div>}
          {!loading && q.trim().length < 2 && <div className="text-center py-12 text-xs text-[#8890A8]">Enter at least 2 characters to search active students and HR users.</div>}
          {!loading && q.trim().length >= 2 && results.length === 0 && <div className="text-center py-12 text-xs text-[#8890A8]">No users match that username or name.</div>}
          {results.map(u => <PickerRow key={u.id} user={u} onPick={onPick} />)}
        </div>
      </div>
    </div>
  );
}

function PickerRow({ user, onPick }) {
  return (
    <button onClick={() => onPick(user)}
      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-[#F8F9FF] dark:hover:bg-[#1a1a2e] border-b border-[#E2E6F0] dark:border-[#272A38] cursor-pointer">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        {initials(user.name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-sm text-[#07090f] dark:text-[#F0F2FF] truncate">{user.name}</span>
          {user.isVerified && <BadgeCheck size={12} className="text-indigo-500" />}
        </div>
        <div className="text-xs text-[#8890A8] truncate">
          @{user.username} · {user.role === 'hr' ? 'HR' : 'Student'}
        </div>
      </div>
    </button>
  );
}

// ── Profile peek ─────────────────────────────────────────────────────────────

function ProfilePeek({ user, onClose, onBlock }) {
  if (!user) return null;
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-[#13131f] rounded-2xl border border-[#E2E6F0] dark:border-[#272A38] max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {initials(user.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="text-lg font-bold text-[#07090f] dark:text-[#F0F2FF]">{user.name}</h3>
              {user.isVerified && <BadgeCheck size={16} className="text-indigo-500" />}
            </div>
            <p className="text-sm text-[#3d4468] dark:text-[#8890A8]">
              {user.jobRole ? `${user.jobRole}${user.company ? ` at ${user.company}` : ''}` : (user.college || '—')}
            </p>
            {user.gradYear && <p className="text-xs text-[#8890A8] mt-0.5">Class of {user.gradYear}</p>}
          </div>
          <button onClick={onClose} className="text-[#8890A8] hover:text-[#07090f] dark:hover:text-white cursor-pointer"><X size={18} /></button>
        </div>
        {user.bio && <p className="text-sm text-[#1e2340] dark:text-[#c8cce0] leading-relaxed">{user.bio}</p>}
        {onBlock && (
          <div className="flex gap-2 pt-2">
            <button onClick={onBlock}
              className="flex-1 py-2 rounded-xl border border-amber-500/30 text-amber-600 text-sm font-semibold hover:bg-amber-50 dark:hover:bg-amber-900/20 flex items-center justify-center gap-1 cursor-pointer">
              <UserX size={14} /> Block
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Settings panel (gear icon) ──────────────────────────────────────────────

function SettingsPanel({ onClose }) {
  const me        = useAuthStore(s => s.user);
  const blocked   = useUsersStore(s => s.blocked);
  const syncUsers = useUsersStore(s => s.sync);
  const unblockMany = useUsersStore(s => s.unblockMany);
  const clearAllChats = useCommunityStore(s => s.clearAllChats);
  const navigate  = useNavigate();
  const [selected, setSelected] = useState(new Set());

  useEffect(() => { syncUsers(); }, [syncUsers]);

  function toggleSel(id) {
    setSelected(s => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  function selectAll() {
    setSelected(new Set(blocked.map(b => b.id)));
  }
  async function unblockSelected() {
    if (!selected.size) return;
    if (!confirm(`Unblock ${selected.size} user${selected.size === 1 ? '' : 's'}?`)) return;
    await unblockMany([...selected]);
    setSelected(new Set());
  }
  async function clearAll() {
    if (!confirm('Delete all your chats? They disappear from your sidebar. Cannot be undone.')) return;
    await clearAllChats();
    onClose();
  }

  const role = me?.role || 'student';

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-[#13131f] rounded-2xl border border-[#E2E6F0] dark:border-[#272A38] max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-[#E2E6F0] dark:border-[#272A38]">
          <h3 className="text-base font-semibold text-[#07090f] dark:text-[#F0F2FF] flex items-center gap-2">
            <SettingsIcon size={16} /> Messaging Settings
          </h3>
          <button onClick={onClose} className="text-[#8890A8] hover:text-[#07090f] dark:hover:text-white cursor-pointer"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* My profile card */}
          <section>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F9FF] dark:bg-[#0a0a14] border border-[#E2E6F0] dark:border-[#272A38]">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                {initials(me?.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#07090f] dark:text-[#F0F2FF] truncate">{me?.name}</div>
                <div className="text-xs text-[#8890A8] truncate">{me?.email}</div>
                <div className="text-xs text-[#3d4468] dark:text-[#c8cce0] mt-1 capitalize font-medium">{role} Account</div>
              </div>
              <button onClick={() => { onClose(); navigate(`/${role}/profile`); }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 px-2 py-1 cursor-pointer">Profile</button>
            </div>
          </section>

          {/* Blocked users */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-[#07090f] dark:text-[#F0F2FF] flex items-center gap-1.5">
                <Ban size={14} className="text-red-500" /> Blocked users ({blocked.length})
              </h4>
              {blocked.length > 0 && (
                <button onClick={selectAll} className="text-[11px] text-indigo-500 hover:text-indigo-600 font-medium cursor-pointer">
                  Select all
                </button>
              )}
            </div>

            {blocked.length === 0 ? (
              <div className="text-xs text-[#8890A8] text-center py-4">You haven't blocked anyone.</div>
            ) : (
              <>
                <ul className="space-y-1 max-h-48 overflow-y-auto">
                  {blocked.map(u => (
                    <li key={u.id}>
                      <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F8F9FF] dark:hover:bg-[#1a1a2e] cursor-pointer">
                        <input type="checkbox" checked={selected.has(u.id)} onChange={() => toggleSel(u.id)}
                          className="w-4 h-4 accent-indigo-600" />
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {initials(u.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-[#07090f] dark:text-[#F0F2FF] truncate">{u.name}</div>
                          <div className="text-[11px] text-[#8890A8] truncate">{[u.jobRole, u.company, u.college].filter(Boolean).join(' · ') || '—'}</div>
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
                {selected.size > 0 && (
                  <button onClick={unblockSelected}
                    className="mt-2 w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold cursor-pointer">
                    Unblock {selected.size} selected
                  </button>
                )}
              </>
            )}
          </section>

          {/* Danger zone */}
          <section className="pt-3 border-t border-[#E2E6F0] dark:border-[#272A38]">
            <h4 className="text-sm font-semibold text-red-500 mb-2">Danger zone</h4>
            <button onClick={clearAll}
              className="w-full py-2 rounded-xl border border-red-500/30 text-red-500 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-2 cursor-pointer">
              <Trash2 size={14} /> Clear all chats
            </button>
            <p className="text-[11px] text-[#8890A8] mt-2 text-center">
              Removes every chat from your sidebar. The other side keeps the history. New messages will reopen the chat.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Messages() {
  const activeChatId  = useCommunityStore(s => s.activeChatId);
  const setActiveChat = useCommunityStore(s => s.setActiveChat);
  const startDM       = useCommunityStore(s => s.startDM);
  const blockUser     = useUsersStore(s => s.block);
  const [search, setSearch] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const userId = useAuthStore(s => s.user?.id);
  const syncConversations = useCommunityStore(s => s.syncConversations);

  useEffect(() => {
    syncConversations();
  }, [userId, syncConversations]);

  useEffect(() => {
    const target = searchParams.get('chat');
    if (target && target !== activeChatId) {
      setActiveChat(target);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, activeChatId, setActiveChat, setSearchParams]);

  async function handlePick(user) {
    setPickerOpen(false);
    try {
      const id = await startDM(user.id);
      if (id) setActiveChat(id);
    } catch (error) { toast.error(error.message || 'Could not start conversation.'); }
  }

  return (
    <div className="h-[calc(100vh-8.5rem)] min-h-[580px] w-full rounded-2xl border border-[#E2E6F0] dark:border-[#272A38] bg-white dark:bg-[#0a0a14] shadow-2xl flex flex-col overflow-hidden relative">
      <TopActionBar
        onNewChat={() => setPickerOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="flex-1 grid grid-cols-1 md:grid-cols-[340px_1fr] border-t border-[#E2E6F0] dark:border-[#272A38] overflow-hidden min-h-0">
        <div className={`border-r border-[#E2E6F0] dark:border-[#272A38] bg-[#FAFBFF] dark:bg-[#0a0a14] ${activeChatId ? 'hidden md:block' : 'block'}`}>
          <ConversationList
            onSelect={setActiveChat}
            activeId={activeChatId}
            search={search}
            setSearch={setSearch}
          />
        </div>

        <div className={`${activeChatId ? 'block' : 'hidden md:block'}`}>
          <ChatWindow
            chatId={activeChatId}
            onBack={() => setActiveChat(null)}
            onViewProfile={(p) => setProfile(p)}
          />
        </div>
      </div>

      {pickerOpen && <NewChatPicker onClose={() => setPickerOpen(false)} onPick={handlePick} />}
      {profile && (
        <ProfilePeek user={profile} onClose={() => setProfile(null)}
          onBlock={() => {
            if (!confirm(`Block ${profile.name}?`)) return;
            blockUser(profile.id);
            setProfile(null);
          }} />
      )}
      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
