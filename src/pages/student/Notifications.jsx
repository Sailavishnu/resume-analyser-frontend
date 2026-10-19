import React, { useEffect } from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import Card from '../../components/ui/Card';

export default function Notifications() {
  const userId = useAuthStore(s => s.user?.id);
  const notifications = useNotificationStore(s => s.notifications);
  const sync = useNotificationStore(s => s.sync);
  const dismiss = useNotificationStore(s => s.dismiss);
  const dismissAll = useNotificationStore(s => s.dismissAll);

  useEffect(() => { sync(userId); }, [sync, userId]);

  return <div className="max-w-4xl space-y-5">
    <header className="flex items-center justify-between gap-4">
      <div><h1 className="text-xl font-bold text-white">Notifications</h1><p className="text-sm text-gray-400">New notifications appear here until you dismiss them.</p></div>
      {notifications.length > 0 && <button onClick={dismissAll} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 hover:bg-white/5"><CheckCheck size={15}/> Clear all</button>}
    </header>
    {notifications.length === 0 ? <Card className="p-10 text-center"><Bell className="h-9 w-9 mx-auto text-sky-400 mb-3"/><h2 className="text-base font-semibold text-white">You are all caught up</h2></Card> : <div className="space-y-3">
      {notifications.map(n => <Card key={n.id} className="p-4 flex items-start gap-4">
        <Bell className="mt-1 h-4 w-4 shrink-0 text-sky-400"/>
        <div className="min-w-0 flex-1"><p className="font-semibold text-white">{n.title}</p><p className="mt-1 text-sm text-gray-400">{n.message}</p><p className="mt-2 text-xs text-gray-500">{n.created_at ? new Date(n.created_at).toLocaleString() : ''}</p></div>
        <button aria-label="Dismiss notification" onClick={() => dismiss(n.id)} className="rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white"><Trash2 size={15}/></button>
      </Card>)}
    </div>}
  </div>;
}
