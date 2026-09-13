import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

import { useAptitudeStore }  from '../../store/aptitudeStore';
import { useSubjectStore }   from '../../store/subjectStore';
import { useInterviewStore } from '../../store/interviewStore';
import { useAIInterviewStore } from '../../store/aiInterviewStore';
import { useCommunityStore } from '../../store/communityStore';
import { useUIStore }        from '../../store/uiStore';
import { useUsersStore }     from '../../store/usersStore';
import { useNotificationStore } from '../../store/notificationStore';

import { getSocket, connectSocket, disconnectSocket } from '../../services/socket';

export default function AppLayout() {
  const syncAptitude      = useAptitudeStore(s => s.syncFromDB);
  const syncSubject       = useSubjectStore(s => s.syncFromDB);
  const syncInterview     = useInterviewStore(s => s.syncFromDB);
  const syncAIInterview   = useAIInterviewStore(s => s.syncFromDB);
  const syncPosts         = useCommunityStore(s => s.syncPosts);
  const syncConversations = useCommunityStore(s => s.syncConversations);
  const receiveMessage    = useCommunityStore(s => s.receiveMessage);
  const syncPrefs         = useUIStore(s => s.syncFromDB);
  const syncUsers         = useUsersStore(s => s.sync);
  const syncNotifs        = useNotificationStore(s => s.sync);
  const receiveNotif      = useNotificationStore(s => s.receiveNotification);

  useEffect(() => {
    syncAptitude();
    syncSubject();
    syncInterview();
    syncAIInterview();
    syncPosts();
    syncConversations();
    syncPrefs();
    syncUsers();
    syncNotifs(); // Initial fetch

    const socket = getSocket();
    connectSocket();

    const onMessage = ({ message, conversationId }) => receiveMessage(conversationId, message);
    const onNotification = (notif) => receiveNotif(notif);

    socket.on('chat:message_received', onMessage);
    socket.on('notification:new', onNotification);

    return () => {
      socket.off('chat:message_received', onMessage);
      socket.off('notification:new', onNotification);
      disconnectSocket();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <TopBar />
      <Sidebar />
      <main className="pt-[60px] pb-16 sm:pb-0 min-h-screen">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
