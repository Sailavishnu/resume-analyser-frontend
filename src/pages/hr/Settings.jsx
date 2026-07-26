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
    toast.success('Recruiter parameters saved.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold font-heading text-white">System Settings</h1>
          <p className="text-xs text-gray-400">Configure recruiter workflow credentials, notification alerts, and security.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Navigation Categories */}
        <Card className="p-3 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg bg-brand-teal/10 border-l-2 border-brand-teal text-brand-teal text-left">
            <Lock className="h-4.5 w-4.5" />
            <span>Security & Passwords</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.03] text-left">
            <Bell className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.03] text-left" />
            <span>Notification Settings</span>
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
                <Button type="submit" variant="teal" loading={loading}>
                  Save Credentials
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
