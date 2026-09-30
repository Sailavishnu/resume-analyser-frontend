import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../../store/adminStore';
import {
  Users, Search, Filter, Ban, CheckCircle2, AlertTriangle,
  Mail, Building, ShieldCheck, MoreVertical, Trash2, UserPlus, KeyRound, RefreshCcw, TrendingUp, PieChart as PieIcon
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid
} from 'recharts';

const CHART_TOOLTIP_STYLE = { backgroundColor: '#0f0f13', borderColor: '#2d2d3f', color: '#f3f4f6', fontSize: 11, borderRadius: 8 };

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

  // Graphical Data Computations
  const studentCount = users.filter(u => u.role === 'student').length;
  const hrCount = users.filter(u => u.role === 'hr').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  const rolePieData = [
    { name: 'Students', value: studentCount, color: '#0ea5e9' },
    { name: 'HR Recruiters', value: hrCount, color: '#0d9488' },
    { name: 'Admins', value: adminCount, color: '#8b5cf6' },
  ];

  const statusData = [
    { role: 'Students', active: users.filter(u => u.role === 'student' && u.status === 'active').length, suspended: users.filter(u => u.role === 'student' && u.status === 'suspended').length },
    { role: 'HR Recruiters', active: users.filter(u => u.role === 'hr' && u.status === 'active').length, suspended: users.filter(u => u.role === 'hr' && u.status === 'suspended').length },
    { role: 'Admins', active: users.filter(u => u.role === 'admin' && u.status === 'active').length, suspended: users.filter(u => u.role === 'admin' && u.status === 'suspended').length },
  ];

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
    <div className="space-y-6 pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-sky-400" /> Master User Operations & Access Control
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Inspect, create, promote roles, and moderate student, recruiter, and administrator accounts.
          </p>
        </div>

        <Button variant="teal" size="sm" onClick={() => setIsAddModalOpen(true)} icon={UserPlus}>
          Add New User
        </Button>
      </div>

      {/* ── Graphical User Analytics Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Role Distribution Donut Chart */}
        <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-sky-400" /> User Role Breakdown
            </h3>
            <Badge variant="blue">Live Counts</Badge>
          </div>
          <div className="h-40 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={rolePieData} dataKey="value" cx="50%" cy="50%" innerRadius={36} outerRadius={60} paddingAngle={4}>
                  {rolePieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-white/[0.06]">
            <div>
              <p className="text-gray-400 text-[10px]">Students</p>
              <p className="font-extrabold text-sky-400">{studentCount}</p>
            </div>
            <div>
              <p className="text-gray-400 text-[10px]">HR Recruiters</p>
              <p className="font-extrabold text-teal-400">{hrCount}</p>
            </div>
            <div>
              <p className="text-gray-400 text-[10px]">Admins</p>
              <p className="font-extrabold text-purple-400">{adminCount}</p>
            </div>
          </div>
        </Card>

        {/* Account Activity Status Bar Chart */}
        <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08] lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-teal-400" /> Account Moderation Status
            </h3>
            <Badge variant="teal">Active vs Suspended</Badge>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="role" stroke="#6b7280" fontSize={10} />
                <YAxis stroke="#6b7280" fontSize={10} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="active" fill="#10b981" radius={[4, 4, 0, 0]} name="Active Accounts" />
                <Bar dataKey="suspended" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Suspended Accounts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ── Filters & Search ── */}
      <Card className="p-4 flex flex-col md:flex-row gap-3 items-center justify-between border border-white/[0.08] bg-obsidian-900/90">
        <div className="relative flex-1 w-full">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name or email address..."
            className="w-full bg-obsidian-950 border border-white/[0.08] rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-teal-400"
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
      <Card className="p-0 overflow-hidden border border-white/[0.08] bg-obsidian-900/90">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] uppercase font-bold tracking-wider p-4 bg-obsidian-950 text-gray-400">
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
                        {u.company && <p className="text-[10px] text-teal-400 font-semibold">🏢 {u.company}</p>}
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
                      <span className="text-[11px] text-teal-400 font-semibold">
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
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-400"
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
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Assign User Role</label>
              <select
                value={newUserData.role}
                onChange={e => setNewUserData({...newUserData, role: e.target.value})}
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-400"
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
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-400"
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
