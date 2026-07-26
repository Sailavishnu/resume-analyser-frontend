import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Calendar as CalendarIcon, Video, Plus, User, Clock, Check, X, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Interviews() {
  const [isOpen, setIsOpen] = useState(false);
  const [candidate, setCandidate] = useState('Sarah Connor');
  const [date, setDate] = useState('2026-07-28');
  const [time, setTime] = useState('15:00');

  const [meetings, setMeetings] = useState([
    { id: 'meet-1', candidate: 'Sarah Connor', role: 'Senior React Developer', date: '2026-07-28', time: '15:00', link: 'https://meet.google.com/xyz' },
    { id: 'meet-2', candidate: 'Ellen Ripley', role: 'Fullstack Engineer', date: '2026-07-29', time: '11:00', link: 'https://meet.google.com/abc' },
  ]);

  const handleCreateMeeting = (e) => {
    e.preventDefault();
    const newMeet = {
      id: `meet-${Math.random().toString(36).substr(2, 9)}`,
      candidate,
      role: 'Software Developer candidate',
      date,
      time,
      link: 'https://meet.google.com/new'
    };

    setMeetings(prev => [...prev, newMeet]);
    setIsOpen(false);
    toast.success('Interview scheduled successfully! Meeting link dispatched.');
  };

  const handleCancel = (id, name) => {
    setMeetings(prev => prev.filter(m => m.id !== id));
    toast.error(`Interview with ${name} was cancelled.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold font-heading text-white">Interview Coordination Calendar</h1>
          <p className="text-xs text-gray-400">Coordinate and schedule candidate evaluations and video conferences.</p>
        </div>
        <Button variant="teal" size="sm" onClick={() => setIsOpen(true)} icon={Plus}>
          Schedule Interview
        </Button>
      </div>

      {/* Grid of Scheduled Meetings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meetings.length > 0 ? (
          meetings.map(item => (
            <Card key={item.id} className="p-5 flex flex-col justify-between h-48">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded border border-brand-teal/20">
                    Video Interview
                  </span>
                  
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 font-semibold">
                    <Clock className="h-3 w-3" />
                    <span>{item.date} • {item.time}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white font-heading">{item.candidate}</h3>
                <p className="text-xs text-gray-400">{item.role}</p>
                
                <p className="text-[11px] text-brand-blue truncate mt-1">Link: {item.link}</p>
              </div>

              <div className="pt-3 border-t border-white/[0.04] flex justify-end gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCancel(item.id, item.candidate)}
                  className="text-brand-rose border-brand-rose/20 hover:bg-brand-rose/10 !py-1 text-xs"
                  icon={X}
                >
                  Cancel Call
                </Button>
                <Button
                  variant="teal"
                  size="sm"
                  onClick={() => window.open(item.link, '_blank')}
                  className="!py-1 text-xs"
                  icon={Video}
                >
                  Join Meeting
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="md:col-span-2 border border-dashed border-white/[0.08] rounded-xl p-12 text-center text-gray-500 bg-obsidian-900/30 flex flex-col items-center justify-center">
            <div className="p-4 bg-obsidian-800 rounded-full mb-4 border border-white/[0.04]">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-white font-heading">No meetings scheduled</h4>
            <p className="text-xs text-gray-400 mt-1">There are no calls scheduled in this period.</p>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Schedule Interview Call"
        footerActions={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button variant="teal" size="sm" onClick={handleCreateMeeting}>Schedule Interview</Button>
          </>
        }
      >
        <form onSubmit={handleCreateMeeting} className="space-y-4">
          <Input
            label="Candidate Name"
            value={candidate}
            onChange={e => setCandidate(e.target.value)}
            placeholder="e.g. Sarah Connor"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
            <Input
              label="Time"
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
