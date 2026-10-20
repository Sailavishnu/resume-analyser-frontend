import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../services/apiClient';
import toast from 'react-hot-toast';

const EMPTY = { company_name: '', website: '', industry: '', company_size: '', location: '', description: '', job_title: '', phone: '' };

export default function Company() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setLoading(true);
    api.get('/users/hr/profile').then(res => setForm({ ...EMPTY, ...(res.data?.data || {}) })).catch(e => toast.error(e.message || 'Could not load company details')).finally(() => setLoading(false));
  }, []);
  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const save = async event => {
    event.preventDefault(); setSaving(true);
    try { const res = await api.patch('/users/hr/profile', form); setForm({ ...EMPTY, ...(res.data?.data || {}) }); toast.success('Company profile saved.'); }
    catch (e) { toast.error(e.message || 'Could not save company profile.'); }
    finally { setSaving(false); }
  };
  const fields = [['company_name', 'Company name', true], ['website', 'Website'], ['industry', 'Industry'], ['company_size', 'Company size'], ['location', 'Location', true], ['job_title', 'Your job title'], ['phone', 'Work phone']];
  return <div className="mx-auto max-w-3xl space-y-6">
    <header className="border-b border-white/[0.08] pb-4"><h1 className="text-2xl font-bold text-white">Company profile</h1><p className="mt-1 text-sm text-gray-400">These details appear on job postings and help students understand the employer.</p></header>
    <Card className="p-6"><form onSubmit={save} className="space-y-4">
      {loading ? <p className="text-sm text-gray-400">Loading company details…</p> : <>
        <div className="grid gap-4 sm:grid-cols-2">{fields.map(([key, label, required]) => <label key={key} className="block text-sm text-gray-300">{label}<input required={required} value={form[key] || ''} onChange={e => update(key, e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-obsidian-950 px-3 py-2 text-white focus:border-brand-teal focus:outline-none" /></label>)}</div>
        <label className="block text-sm text-gray-300">Company overview<textarea rows={4} value={form.description || ''} onChange={e => update('description', e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-obsidian-950 px-3 py-2 text-white focus:border-brand-teal focus:outline-none" placeholder="What does your company do? What is its mission or product?" /></label>
        <Button type="submit" variant="teal" loading={saving}>Save company details</Button>
      </>}
    </form></Card>
  </div>;
}
