import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import {
  Send, Paperclip, Search, MoreVertical, Phone, Video, CheckCheck,
  Building2, User, Sparkles, MessageSquare, ShieldCheck
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function Messages() {
  const { user } = useAuthStore();
  const isHr = user?.role === 'hr';
  const isAdmin = user?.role === 'admin';

  // Seed conversation threads
  const initialThreads = isHr ? [
    {
      id: 'thread-1',
      name: 'Sarah Connor',
      role: 'Student · Full Stack Candidate',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      lastMessage: "I've updated my resume with the Docker and TypeScript metrics we discussed!",
      time: '10:42 AM',
      unread: 1,
      online: true,
      context: 'Applied for Senior React Developer (94% ATS Match)',
      messages: [
        { id: 1, sender: 'them', text: 'Hello Marcus, thank you for shortlisting my application!', time: '10:30 AM' },
        { id: 2, sender: 'me',   text: 'Hi Sarah! Your ATS score was among the top 5% of candidates. We are excited about your project work.', time: '10:35 AM' },
        { id: 3, sender: 'them', text: "I've updated my resume with the Docker and TypeScript metrics we discussed!", time: '10:42 AM' },
      ]
    },
    {
      id: 'thread-2',
      name: 'David Chen',
      role: 'Student · Backend Developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      lastMessage: 'Will the technical round include system design questions?',
      time: 'Yesterday',
      unread: 0,
      online: false,
      context: 'Applied for Cloud Backend Engineer (88% ATS Match)',
      messages: [
        { id: 1, sender: 'me', text: 'Hi David, checking in regarding your interview slot.', time: 'Yesterday' },
        { id: 2, sender: 'them', text: 'Will the technical round include system design questions?', time: 'Yesterday' },
      ]
    }
  ] : [
    {
      id: 'thread-1',
      name: 'Marcus Vance',
      role: 'Technical Recruiter @ Stripe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      lastMessage: 'Your resume was among the top 5% of applicants. Are you available for a screening call this Thursday?',
      time: '11:15 AM',
      unread: 1,
      online: true,
      context: 'Application: Frontend Engineer (94% ATS Match)',
      messages: [
        { id: 1, sender: 'them', text: 'Hello Sarah! I reviewed your analyzed resume on the Antigravity platform.', time: '11:00 AM' },
        { id: 2, sender: 'me',   text: 'Hi Marcus! Thank you for reviewing my profile.', time: '11:05 AM' },
        { id: 3, sender: 'them', text: 'Your resume was among the top 5% of applicants. Are you available for a screening call this Thursday?', time: '11:15 AM' },
      ]
    },
    {
      id: 'thread-2',
      name: 'Campus Placement Cell',
      role: 'Placement Coordinator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      lastMessage: 'Reminder: Google placement drive registration closes tonight at 11:59 PM.',
      time: '9:20 AM',
      unread: 0,
      online: true,
      context: 'University Placement Office',
      messages: [
        { id: 1, sender: 'them', text: 'Reminder: Google placement drive registration closes tonight at 11:59 PM.', time: '9:20 AM' },
      ]
    },
    {
      id: 'thread-3',
      name: 'Elena Rostova',
      role: 'Talent Acquisition @ Amazon',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      lastMessage: 'We received your mock interview scorecard. Looks impressive!',
      time: '2 days ago',
      unread: 0,
      online: false,
      context: 'Application: SDE-1 Intern',
      messages: [
        { id: 1, sender: 'them', text: 'We received your mock interview scorecard. Looks impressive!', time: '2 days ago' },
      ]
    }
  ];

  const [threads, setThreads] = useState(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState(initialThreads[0].id);
  const [inputText, setInputText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          lastMessage: newMsg.text,
          time: newMsg.time,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    }));

    setInputText('');
    toast.success('Message sent');
  };

  const filteredThreads = threads.filter(t =>
    t.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    t.role.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--border-faint)' }}>
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
            Messages & Recruiter Chat
          </h1>
          <p className="text-xs text-gray-400">
            {isHr
              ? 'Connect directly with shortlisted student applicants and schedule interviews.'
              : 'Direct communication line with HR recruiters, company talent partners, and placement officers.'}
          </p>
        </div>
        <div className="glass px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-blue flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          End-to-End Verified
        </div>
      </div>

      {/* ── Chat Container ── */}
      <div className="glass-card overflow-hidden grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[650px]">
        {/* Thread Sidebar (Left) */}
        <div className="border-r flex flex-col h-full" style={{ borderColor: 'var(--border-light)' }}>
          {/* Search */}
          <div className="p-3.5 border-b" style={{ borderColor: 'var(--border-faint)' }}>
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-faint)' }} />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search conversations..."
                className="glass-input w-full rounded-xl py-1.5 pl-8 pr-3 text-xs"
              />
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredThreads.map((t) => {
              const isActive = t.id === activeThreadId;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setActiveThreadId(t.id);
                    // Clear unread
                    setThreads(prev => prev.map(item => item.id === t.id ? { ...item, unread: 0 } : item));
                  }}
                  className={`p-3 rounded-xl transition-all cursor-pointer flex gap-3 items-start ${
                    isActive
                      ? 'border-l-2 border-brand-blue bg-brand-blue/10 shadow-sm'
                      : 'hover:bg-[var(--nav-hover-bg)]'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={t.avatar} alt={t.name} className="h-9 w-9 rounded-xl object-cover border" style={{ borderColor: 'var(--border-light)' }} />
                    {t.online && (
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-white dark:ring-[#080810]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                      <span className="text-[10px]" style={{ color: 'var(--text-faint)' }}>{t.time}</span>
                    </div>
                    <p className="text-[10px] text-brand-blue truncate mt-0.5">{t.role}</p>
                    <p className="text-[11px] truncate mt-1 leading-snug" style={{ color: 'var(--text-muted)' }}>{t.lastMessage}</p>
                  </div>

                  {t.unread > 0 && (
                    <span className="h-4 w-4 rounded-full bg-brand-blue text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                      {t.unread}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Chat Pane (Right) */}
        <div className="md:col-span-2 lg:col-span-3 flex flex-col h-full">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center justify-between shrink-0" style={{ borderColor: 'var(--border-faint)', background: 'var(--nav-hover-bg)' }}>
            <div className="flex items-center gap-3">
              <img src={activeThread.avatar} alt={activeThread.name} className="h-10 w-10 rounded-xl object-cover border" style={{ borderColor: 'var(--border-light)' }} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{activeThread.name}</h3>
                  {activeThread.online ? (
                    <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
                    </span>
                  ) : (
                    <span className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Offline</span>
                  )}
                </div>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{activeThread.context}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button className="p-2 rounded-xl glass hover:bg-indigo-500/10 transition-colors cursor-pointer" title="Audio Call">
                <Phone className="h-4 w-4 text-brand-blue" />
              </button>
              <button className="p-2 rounded-xl glass hover:bg-indigo-500/10 transition-colors cursor-pointer" title="Video Meeting">
                <Video className="h-4 w-4 text-brand-violet" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            <div className="text-center my-2">
              <span className="text-[10px] px-3 py-1 rounded-full glass" style={{ color: 'var(--text-faint)' }}>
                Direct Messaging · Verified via Antigravity Placement Platform
              </span>
            </div>

            {activeThread.messages.map((m) => {
              const isMe = m.sender === 'me';
              return (
                <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-gradient-to-r from-brand-blue to-brand-indigo text-white rounded-tr-none shadow-md shadow-brand-blue/15'
                        : 'glass text-[var(--text-primary)] rounded-tl-none border'
                    }`}
                    style={{ borderColor: isMe ? undefined : 'var(--border-light)' }}
                  >
                    {m.text}
                  </div>
                  <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[9px]" style={{ color: 'var(--text-faint)' }}>{m.time}</span>
                    {isMe && <CheckCheck className="h-3 w-3 text-brand-blue" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 border-t shrink-0" style={{ borderColor: 'var(--border-faint)' }}>
            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-xl glass hover:bg-indigo-500/10 transition-colors cursor-pointer text-[var(--text-muted)]" title="Attach Resume or Document">
                <Paperclip className="h-4 w-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Type a message to ${activeThread.name.split(' ')[0]}...`}
                className="glass-input flex-1 rounded-xl py-2.5 px-4 text-xs"
              />

              <Button
                variant="primary"
                size="sm"
                onClick={handleSendMessage}
                icon={Send}
                disabled={!inputText.trim()}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
