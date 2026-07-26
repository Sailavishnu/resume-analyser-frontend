import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Building, Globe, Mail, Users, Plus, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Company() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('Cyberdyne Systems');
  const [website, setWebsite] = useState('https://cyberdyne.com');

  const team = [
    { name: 'Marcus Vance', role: 'Lead Recruiter (Owner)', email: 'm.vance@cyberdyne.com' },
    { name: 'Sarah Connor', role: 'Technical Interviewer', email: 's.connor@cyberdyne.com' }
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    toast.success('Company branding updated.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold font-heading text-white">Company Workspace Profile</h1>
          <p className="text-xs text-gray-400">Manage recruiter workspace settings, logos, and teammate roles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Branding inputs */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-bold text-white font-heading mb-4">Firm Settings</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Company Name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <Input
                label="Corporate Site URL"
                value={website}
                onChange={e => setWebsite(e.target.value)}
              />
              
              <div className="pt-2">
                <Button type="submit" variant="teal" loading={loading}>
                  Save Workspace details
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Recruiting Team list */}
        <Card className="p-5 space-y-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex justify-between items-center">
            <span>Recruiting Team</span>
            <button className="text-[10px] text-brand-teal hover:underline flex items-center gap-1"><Plus className="h-3 w-3" /> Add</button>
          </h3>

          <div className="space-y-3.5">
            {team.map((member, i) => (
              <div key={i} className="p-3 bg-obsidian-950/40 border border-white/[0.04] rounded-lg text-xs space-y-1">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-teal" />
                  <span>{member.name}</span>
                </p>
                <p className="text-[10px] text-gray-400 capitalize">{member.role}</p>
                <p className="text-[9px] text-gray-500">{member.email}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
