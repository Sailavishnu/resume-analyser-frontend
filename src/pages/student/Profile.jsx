import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { studentService } from '../../services/studentService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function Profile() {
  const user = useAuthStore(state => state.user);
  const updateLocalUser = useAuthStore(state => state.updateProfile);
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => { studentService.getProfile().then(data => { setProfile(data); setRole(data.target_role || ''); }).catch(error => toast.error(error?.response?.data?.detail || 'Could not load your profile.')); }, []);
  const save = async event => {
    event.preventDefault(); setSaving(true);
    try {
      const [updated] = await Promise.all([studentService.updateProfile({ target_role: role.trim() || null }), name.trim() && name.trim() !== user?.name ? studentService.updateUser({ full_name: name.trim() }) : Promise.resolve(null)]);
      setProfile(updated); if (name.trim()) updateLocalUser({ name: name.trim() }); toast.success('Profile saved to your account.');
    } catch (error) { toast.error(error?.response?.data?.detail || error?.message || 'Could not save profile.'); }
    finally { setSaving(false); }
  };
  return <div className="max-w-3xl space-y-5"><header><h1 className="text-xl font-bold text-white">My profile</h1><p className="text-sm text-gray-400">Account and target role details saved on the server.</p></header><Card className="p-6"><form className="space-y-4" onSubmit={save}><Input label="Full name" value={name} onChange={e=>setName(e.target.value)} /><Input label="Email" value={user?.email || ''} disabled /><Input label="Target role" placeholder="What role are you targeting?" value={role} onChange={e=>setRole(e.target.value)} /><p className="text-xs text-gray-500">{profile?.profile_completion != null ? `Profile completeness: ${profile.profile_completion}%` : 'Profile completeness unavailable'}</p><Button type="submit" variant="primary" loading={saving}>Save profile</Button></form></Card></div>;
}
