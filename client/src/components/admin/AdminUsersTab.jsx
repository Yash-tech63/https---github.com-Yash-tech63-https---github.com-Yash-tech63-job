import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Button } from '../common/Button';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Ban,
  Mail
} from 'lucide-react';

export const AdminUsersTab = ({ onShowToast }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers(roleFilter, search);
      if (res && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (user, field) => {
    setUpdatingId(user._id);
    try {
      const payload = {
        [field]: !user[field]
      };
      await adminService.updateUserStatus(user._id, payload);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, ...payload } : u))
      );
      if (onShowToast) {
        onShowToast(`User ${user.email} updated successfully.`, 'success');
      }
    } catch (err) {
      if (onShowToast) {
        onShowToast(err.message || 'Failed to update user', 'error');
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 text-[#202124]">
      {/* Search & Role Filter Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#202124] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#C6A15B]" />
            User Account Management ({users.length})
          </h2>
          <p className="text-xs text-[#666666] mt-0.5">
            Audit registered candidates, recruiters, and administrators with role-based access control.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#E9E6DF] rounded-xl pl-9 pr-3 py-2 text-xs text-[#202124] placeholder:text-[#666666] focus:bg-[#FFFFFF] focus:border-[#C6A15B] outline-none transition-colors"
            />
          </div>
          <Button variant="secondary" size="sm" type="submit">
            Search
          </Button>
        </form>
      </div>

      {/* Role Filter Pills */}
      <div className="flex items-center gap-2 border-b border-[#E9E6DF] pb-2">
        {[
          { id: '', label: 'All Roles' },
          { id: 'candidate', label: 'Candidates' },
          { id: 'recruiter', label: 'Recruiters' },
          { id: 'admin', label: 'Admins' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setRoleFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              roleFilter === tab.id
                ? 'bg-[#202124] text-[#FAF9F6] border border-[#C6A15B]'
                : 'bg-[#FAF9F6] text-[#666666] hover:text-[#202124] border border-[#E9E6DF]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#E9E6DF] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#666666]">Loading user accounts...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#666666]">No user accounts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F6] border-b border-[#E9E6DF] text-[#202124] uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">User Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Active Status</th>
                  <th className="py-3 px-4">Ban Status</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E6DF] text-[#202124]">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#202124] flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#C6A15B]" />
                      <span>{u.email}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        u.role === 'admin'
                          ? 'bg-[#202124] text-[#C6A15B] border-[#C6A15B]/40'
                          : u.role === 'recruiter'
                          ? 'bg-[#C6A15B]/15 text-[#A98443] border-[#C6A15B]/30'
                          : 'bg-[#FAF9F6] text-[#202124] border-[#E9E6DF]'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {u.isActive !== false ? (
                        <span className="text-[#202124] inline-flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A15B]" /> Active
                        </span>
                      ) : (
                        <span className="text-[#666666] inline-flex items-center gap-1 font-medium">
                          <XCircle className="w-3.5 h-3.5 text-[#666666]" /> Inactive
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {u.isBanned ? (
                        <span className="text-[#202124] inline-flex items-center gap-1 font-bold">
                          <Ban className="w-3.5 h-3.5 text-[#C6A15B]" /> Banned
                        </span>
                      ) : (
                        <span className="text-[#666666] inline-flex items-center gap-1">
                          Clean
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-[#666666]">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.role !== 'admin' && (
                          <>
                            <button
                              onClick={() => handleToggleStatus(u, 'isActive')}
                              disabled={updatingId === u._id}
                              className="px-2.5 py-1 rounded-md text-[10px] font-semibold transition-colors cursor-pointer bg-[#FAF9F6] text-[#202124] border border-[#E9E6DF] hover:bg-[#E9E6DF]"
                            >
                              {u.isActive !== false ? 'Deactivate' : 'Activate'}
                            </button>

                            <button
                              onClick={() => handleToggleStatus(u, 'isBanned')}
                              disabled={updatingId === u._id}
                              className="px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer bg-[#FAF9F6] hover:bg-[#202124] hover:text-[#FAF9F6] text-[#202124] border border-[#E9E6DF]"
                            >
                              {u.isBanned ? 'Unban User' : 'Ban User'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersTab;
