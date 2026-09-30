import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../../store/adminStore';
import {
  Users, Search, Filter, Ban, CheckCircle2, AlertTriangle,
  Mail, Building, ShieldCheck, MoreVertical, Trash2, UserPlus, KeyRound, RefreshCcw
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const { users, fetchUsers, createUser, toggleUserStatus, updateUserRole, deleteUser } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({ full_name: '', email: '', role: 'student', password: 'Password@123' });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(u => {
    const matchSearch = (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserData.email || !newUserData.full_name) {
      toast.error('Name and Email are required.');
      return;
    }
    toast.loading('Creating user account...', { id: 'create-u' });
    await createUser(newUserData);
    toast.success(`User ${newUserData.full_name} created successfully!`, { id: 'create-u' });
    setIsAddModalOpen(false);
    setNewUserData({ full_name: '', email: '', role: 'student', password: 'Password@123' });
  };

  const handleToggleStatus = (user) => {
    toggleUserStatus(user.id);
    toast.success(`User ${user.name} status updated to ${user.status === 'active' ? 'suspended' : 'active'}`);
  };

  const handleRoleChange = (userId, newRole) => {
    updateUserRole(userId, newRole);
    toast.success(`User role updated to ${newRole.toUpperCase()}`);
  };

  const handleDelete = (userId, name) => {
    if (confirm(`Are you sure you want to permanently delete user ${name}?`)) {
      deleteUser(userId);
      toast.success(`User ${name} deleted from system`);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: 'var(--border-faint)' }}>
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-brand-blue" /> Master User Management & Access Control
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Inspect, create, promote roles, and moderate student, recruiter, and administrator accounts.
          </p>
        </div>

        <Button variant="teal" size="sm" onClick={() => setIsAddModalOpen(true)} icon={UserPlus}>
          Add New User
        </Button>
      </div>

      {/* ── Filters & Search ── */}
      <Card className="p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name or email address..."
            className="w-full bg-obsidian-950 border border-white/[0.08] rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-obsidian-950 border border-white/[0.08] text-xs text-white rounded-xl px-3 py-2 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="hr">HR Recruiters</option>
            <option value="admin">Administrators</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-obsidian-950 border border-white/[0.08] text-xs text-white rounded-xl px-3 py-2 cursor-pointer"
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
              <tr className="border-b text-[10px] uppercase font-bold tracking-wider px-4 py-3 bg-obsidian-950 text-gray-400">
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Activity</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email}`} alt={u.name} className="h-9 w-9 rounded-xl object-cover border border-white/10" />
                      <div>
                        <p className="font-bold text-sm text-white">{u.name}</p>
                        <p className="text-[11px] text-gray-400">{u.email}</p>
                        {u.company && <p className="text-[10px] text-brand-teal font-semibold">🏢 {u.company}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="bg-obsidian-950 text-xs font-semibold text-white border border-white/10 rounded-lg px-2 py-1 cursor-pointer"
                    >
                      <option value="student">STUDENT</option>
                      <option value="hr">HR RECRUITER</option>
                      <option value="admin">ADMIN</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      u.status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}>
                      {(u.status || 'active').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-[11px] text-gray-400">
                    {u.joinedDate || '2026-09-30'}
                  </td>
                  <td className="p-4">
                    {u.role === 'student' && (
                      <span className="text-[11px] text-gray-300">
                        {u.resumesCount || 1} Resumes
                      </span>
                    )}
                    {u.role === 'hr' && (
                      <span className="text-[11px] text-gray-300">
                        {u.jobsPosted || 0} Job Openings
                      </span>
                    )}
                    {u.role === 'admin' && (
                      <span className="text-[11px] text-brand-teal font-semibold">
                        Master Superadmin Rights
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant={u.status === 'active' ? 'outline' : 'teal'}
                        onClick={() => handleToggleStatus(u)}
                        className="text-xs"
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </Button>
                      <button
                        onClick={() => handleDelete(u.id, u.name)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New System User"
          size="md"
        >
          <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                required
                value={newUserData.full_name}
                onChange={e => setNewUserData({...newUserData, full_name: e.target.value})}
                placeholder="e.g. Anand Kumar"
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-teal"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={newUserData.email}
                onChange={e => setNewUserData({...newUserData, email: e.target.value})}
                placeholder="e.g. anand@university.edu"
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-teal"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Assign User Role</label>
              <select
                value={newUserData.role}
                onChange={e => setNewUserData({...newUserData, role: e.target.value})}
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-teal"
              >
                <option value="student">Student / Candidate</option>
                <option value="hr">HR Recruiter</option>
                <option value="admin">System Administrator</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Temporary Password</label>
              <input
                type="text"
                value={newUserData.password}
                onChange={e => setNewUserData({...newUserData, password: e.target.value})}
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="teal" size="sm" type="submit">
                Create User Account
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
