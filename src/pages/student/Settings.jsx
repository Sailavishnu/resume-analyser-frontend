import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Settings as SettingsIcon, Bell, Lock, Shield, EyeOff, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    toast.success('Configuration options updated.');
  };

  const handleDelete = () => {
    toast.error('Danger Zone: Account cancellation requires direct security verification.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold font-heading text-white">System Settings</h1>
          <p className="text-xs text-gray-400">Configure profile settings, login credentials, and notification thresholds.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Navigation Categories */}
        <Card className="p-3 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg bg-brand-blue/10 border-l-2 border-brand-blue text-brand-blue text-left">
            <Lock className="h-4.5 w-4.5" />
            <span>Security & Passwords</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.03] text-left">
            <Bell className="h-4.5 w-4.5" />
            <span>Notification Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.03] text-left">
            <Shield className="h-4.5 w-4.5" />
            <span>Privacy Options</span>
          </button>
        </Card>

        {/* Configurations Fields */}
        <div className="md:col-span-2 space-y-6">
          {/* Credentials Update */}
          <Card className="p-6">
            <h3 className="text-sm font-bold text-white font-heading mb-4">Change Password</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <Input label="Current Password" type="password" placeholder="••••••••" />
              <Input label="New Password" type="password" placeholder="••••••••" />
              <Input label="Confirm New Password" type="password" placeholder="••••••••" />
              
              <div className="pt-2">
                <Button type="submit" variant="primary" loading={loading}>
                  Save New Password
                </Button>
              </div>
            </form>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-l-4 border-brand-rose bg-brand-rose/5">
            <div className="flex gap-4">
              <AlertTriangle className="h-6 w-6 text-brand-rose shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white font-heading">Danger Zone</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Permanently remove your candidate profile, parsed resumes, and performance logs from Skynet indexing archives. This action is irreversible.
                </p>
                <div className="pt-2">
                  <Button variant="danger" size="sm" onClick={handleDelete}>
                    Delete Account Permanently
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
