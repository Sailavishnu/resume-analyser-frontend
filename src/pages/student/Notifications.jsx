import React from 'react';
import Card from '../../components/ui/Card';
import { Bell } from 'lucide-react';

export default function Notifications() {
  return <div className="max-w-4xl space-y-5"><header><h1 className="text-xl font-bold text-white">Notifications</h1><p className="text-sm text-gray-400">Account and application updates.</p></header><Card className="p-10 text-center"><Bell className="h-9 w-9 mx-auto text-sky-400 mb-3"/><h2 className="text-base font-semibold text-white">No notifications available</h2><p className="text-sm text-gray-400 max-w-lg mx-auto mt-2">This account does not have a connected notifications feed yet.</p></Card></div>;
}
