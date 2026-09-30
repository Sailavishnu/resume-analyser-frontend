import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Calendar as CalendarIcon, Video, Plus, User, Clock, Check, X, Edit2, Mail, Sparkles, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Interviews() {
  const [isOpen, setIsOpen] = useState(false);
  const [candidate, setCandidate] = useState('Aravind Swaminathan');
  const [email, setEmail] = useState('aravind.security@xavier.edu');
  const [interviewType, setInterviewType] = useState('Technical Deep-Dive');
  const [date, setDate] = useState('2026-10-02');
  const [time, setTime] = useState('14:30');

  const [meetings, setMeetings] = useState([
    { id: 'meet-1', candidate: 'Aravind Swaminathan', email: 'aravind.security@xavier.edu', role: 'Cyber Security Specialist', type: 'Technical Deep-Dive', date: '2026-10-02', time: '14:30', link: 'https://meet.google.com/xyz-cyber-sec' },
    { id: 'meet-2', candidate: 'Priya Lakshmi', email: 'priya.l@gmail.com', role: 'Fullstack Engineer', type: 'System Architecture', date: '2026-10-03', time: '11:00', link: 'https://meet.google.com/abc-fullstack' },
    { id: 'meet-3', candidate: 'Karthik Kumar', email: 'karthik.k@zoho.com', role: 'Frontend Software Engineer', type: 'HR Behavioral', date: '2026-10-04', time: '16:00', link: 'https://meet.google.com/hr-behavioral' },
  ]);

  const handleCreateMeeting = (e) => {
    e.preventDefault();
    if (!candidate || !date) {
      toast.error('Please enter candidate name and interview date.');
      return;
    }
    const newMeet = {
      id: `meet-${Date.now()}`,
      candidate,
      email: email || `${candidate.toLowerCase().replace(' ', '.')}@gmail.com`,
      role: 'Shortlisted Candidate',
      type: interviewType,
      date,
      time,
      link: `https://meet.google.com/${Math.random().toString(36).substr(2, 8)}`
    };

    setMeetings(prev => [newMeet, ...prev]);
    setIsOpen(false);
    toast.success(`Interview scheduled & notification email sent to ${newMeet.email}!`);
  };

  const handleCancel = (id, name) => {
    setMeetings(prev => prev.filter(m => m.id !== id));
    toast.error(`Interview with ${name} was cancelled.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-white">Interview Coordination & Dispatcher</h1>
            <Badge variant="teal">Automated Calendar</Badge>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Schedule technical rounds, video interviews, and send automated invite dispatches to shortlisted applicants.
          </p>
        </div>
        <Button variant="teal" size="sm" onClick={() => setIsOpen(true)} icon={Plus}>
          Schedule New Interview
        </Button>
      </div>

      {/* Grid of Scheduled Meetings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {meetings.length > 0 ? (
          meetings.map(item => (
            <Card key={item.id} className="p-5 flex flex-col justify-between border border-white/[0.08] bg-obsidian-900/90 h-60 hover:border-white/20 transition-all">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400 bg-teal-500/15 px-2.5 py-0.5 rounded-full border border-teal-500/30">
                    {item.type}
                  </span>
                  
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
                    <Clock className="h-3 w-3 text-sky-400" />
                    <span>{item.date} • {item.time}</span>
                  </div>
                </div>

                <div className="pt-1">
                  <h3 className="text-base font-bold text-white font-heading">{item.candidate}</h3>
                  <p className="text-xs text-teal-400 font-medium">{item.role}</p>
                  <p className="text-[10px] text-gray-400">{item.email}</p>
                </div>
                
                <p className="text-[11px] text-sky-400 truncate bg-obsidian-950 p-2 rounded-lg border border-white/[0.04] mt-2">
                  🔗 {item.link}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCancel(item.id, item.candidate)}
                  className="text-rose-400 border-rose-500/20 hover:bg-rose-500/10 text-xs"
                  icon={X}
                >
                  Cancel
                </Button>
                <Button
                  variant="teal"
                  size="sm"
                  onClick={() => window.open(item.link, '_blank')}
                  className="text-xs"
                  icon={Video}
                >
                  Join Call
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="md:col-span-3 border border-dashed border-white/[0.08] rounded-xl p-12 text-center text-gray-500 bg-obsidian-900/30 flex flex-col items-center justify-center">
            <div className="p-4 bg-obsidian-800 rounded-full mb-4 border border-white/[0.04]">
              <CalendarIcon className="h-6 w-6 text-teal-400" />
            </div>
            <h4 className="text-sm font-semibold text-white font-heading">No interviews scheduled</h4>
            <p className="text-xs text-gray-400 mt-1">Click "Schedule New Interview" to coordinate candidate calls.</p>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Schedule Interview Call & Send Email Invite"
          size="md"
        >
          <form onSubmit={handleCreateMeeting} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Candidate Name</label>
              <input
                type="text"
                value={candidate}
                onChange={e => setCandidate(e.target.value)}
                placeholder="e.g. Anand Kumar"
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Candidate Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. anand@university.edu"
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Interview Round Type</label>
              <select
                value={interviewType}
                onChange={e => setInterviewType(e.target.value)}
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-400"
              >
                <option value="Technical Deep-Dive">Technical Deep-Dive Round</option>
                <option value="System Architecture">System Architecture & Coding</option>
                <option value="HR Behavioral">HR & Cultural Fit</option>
                <option value="Executive Final">Executive Leadership Final</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-400"
                  required
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-obsidian-950 border border-white/[0.06] text-gray-300 space-y-1">
              <p className="font-bold text-teal-400 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Automated Email Dispatch Preview:
              </p>
              <p className="text-[11px] text-gray-400">
                "Dear {candidate || 'Candidate'}, you are invited for a {interviewType} on {date || 'Selected Date'} at {time || 'Selected Time'}. The meeting link will be attached."
              </p>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="teal" size="sm" type="submit" icon={Send}>
                Schedule & Dispatch Invite
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
