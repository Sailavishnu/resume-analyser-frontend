import React, { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import {
  Users, Search, Filter, Ban, CheckCircle2, AlertTriangle,
  Mail, Building, ShieldCheck, MoreVertical, Trash2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const { users, toggleUserStatus, deleteUser } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handleToggleStatus = (user) => {
    toggleUserStatus(user.id);
    toast.success(`User ${user.name} is now ${user.status === 'active' ? 'suspended' : 'activated'}`);
  };

  const handleDelete = (userId, name) => {
    if (confirm(`Are you sure you want to delete user ${name}?`)) {
      deleteUser(userId);
      toast.success(`User ${name} deleted`);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: 'var(--border-faint)' }}>
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
            User Management & Access Control
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Inspect student candidates, verified HR recruiters, and platform administrators.
          </p>
        </div>
      </div>

      {/* ── Filters & Search ── */}
      <Card className="p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-faint)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name or email address..."
            className="glass-input w-full rounded-xl py-2 pl-9 pr-4 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="glass-input rounded-xl px-3 py-2 text-xs cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="hr">HR Recruiters</option>
            <option value="admin">Administrators</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-input rounded-xl px-3 py-2 text-xs cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </Card>

      {/* ── User Table ── */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-[10px] uppercase font-bold tracking-wider px-4 py-3" style={{ borderColor: 'var(--border-faint)', background: 'var(--nav-hover-bg)', color: 'var(--text-faint)' }}>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Activity</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-faint)' }}>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[var(--nav-hover-bg)] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="h-9 w-9 rounded-xl object-cover border" style={{ borderColor: 'var(--border-light)' }} />
                      <div>
                        <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{u.email}</p>
                        {u.company && <p className="text-[10px] text-brand-blue font-semibold">🏢 {u.company}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={u.role === 'admin' ? 'violet' : u.role === 'hr' ? 'teal' : 'blue'}>
                      {u.role.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      u.status === 'active' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-rose-500/15 text-rose-500'
                    }`}>
                      {u.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {u.joinedDate}
                  </td>
                  <td className="p-4">
                    {u.role === 'student' && (
                      <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                        {u.resumesCount} Resumes · <strong>{u.avgAtsScore}% Avg ATS</strong>
                      </span>
                    )}
                    {u.role === 'hr' && (
                      <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                        {u.jobsPosted} Job Postings
                      </span>
                    )}
                    {u.role === 'admin' && (
                      <span className="text-[11px] text-brand-violet font-semibold">
                        Full Superadmin Rights
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {u.role !== 'admin' && (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant={u.status === 'active' ? 'outline' : 'primary'}
                          onClick={() => handleToggleStatus(u)}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </Button>
                        <button
                          onClick={() => handleDelete(u.id, u.name)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
