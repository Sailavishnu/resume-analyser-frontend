import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Bell, Check, Trash2, Calendar, FileText, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'AI Resume Analysis Complete', desc: 'Sarah_Connor_CV_2026.pdf was parsed with a rating of 84%. Review recommendations.', time: 'Today, 2:30 PM', read: false, type: 'file' },
    { id: 2, title: 'Interview Scheduled', desc: 'Vercel scheduled a Frontend Interview for July 28th at 10:00 AM.', time: 'Today, 9:00 AM', read: false, type: 'calendar' },
    { id: 3, title: 'JD Match Alert: Vercel', desc: 'Your profile matches 92% of the keywords on Vercel\'s Senior Developer listing.', time: 'Yesterday', read: true, type: 'briefcase' },
    { id: 4, title: 'Platform Update', desc: 'Antigravity core parser upgraded. Improved response detection rates in Mock Interview simulator.', time: '3 days ago', read: true, type: 'bell' }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read.');
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success('Notifications feed cleared.');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'file':
        return <FileText className="h-4.5 w-4.5 text-brand-blue" />;
      case 'calendar':
        return <Calendar className="h-4.5 w-4.5 text-brand-amber" />;
      case 'briefcase':
        return <Briefcase className="h-4.5 w-4.5 text-brand-emerald" />;
      default:
        return <Bell className="h-4.5 w-4.5 text-brand-violet" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold font-heading text-white">Notifications Panel</h1>
          <p className="text-xs text-gray-400">Review platform logs, match events, and coordinator schedules.</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead} icon={Check}>
              Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-brand-rose" icon={Trash2}>
              Clear Feed
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map(item => (
            <Card
              key={item.id}
              className={`p-4 border transition-all ${
                item.read 
                  ? 'border-white/[0.04] bg-obsidian-900/40 opacity-70' 
                  : 'border-brand-blue/20 bg-brand-blue/5 shadow-[0_0_15px_rgba(59,130,246,0.02)]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-obsidian-950 rounded-xl border border-white/[0.06] shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-xs font-bold text-white font-heading">{item.title}</p>
                    <span className="text-[10px] text-gray-500 shrink-0 font-medium">{item.time}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed mt-1">{item.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-white/[0.08] rounded-xl p-12 text-center text-gray-500 bg-obsidian-900/30 flex flex-col items-center justify-center">
          <div className="p-4 bg-obsidian-800 rounded-full mb-4 border border-white/[0.04]">
            <Bell className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-semibold text-white font-heading">Inbox is Empty</h4>
          <p className="text-xs text-gray-400 mt-1">There are no new notifications at this time.</p>
        </div>
      )}
    </div>
  );
}
