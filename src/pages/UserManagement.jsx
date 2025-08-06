import React, { useState, useEffect } from 'react';
import {
  fetchUsers,
  createUserAPI,
  updateUserAPI,
  deleteUserAPI,
} from '../utils/api.js';
import { toast } from 'react-toastify';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: '', username: '', password: '', role: 'user' });
  const [editingEmail, setEditingEmail] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const res = await fetchUsers();
    if (!res.error) setUsers(res.data);
    else toast.error(res.message);
  }

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingEmail) {
      const res = await updateUserAPI(editingEmail, form);
      res.error ? toast.error(res.message) : toast.success('User updated');
    } else {
      const res = await createUserAPI(form);
      res.error ? toast.error(res.message) : toast.success('User created');
    }
    setForm({ email: '', username: '', password: '', role: 'user' });
    setEditingEmail(null);
    loadUsers();
  };

  const handleEdit = user => {
    setForm({ ...user, password: '' });
    setEditingEmail(user.email);
  };

  const handleDelete = async email => {
    if (confirm(`Hapus user ${email}?`)) {
      const res = await deleteUserAPI(email);
      res.error ? toast.error(res.message) : toast.success('User deleted');
      loadUsers();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>

      {/* Form Create/Edit */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            required
            disabled={!!editingEmail}
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Username</label>
          <input
            required
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Password{editingEmail && ' (ubah jika diperlukan)'}</label>
          <input
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder={editingEmail ? 'Kosongkan jika tidak diubah' : ''}
            required={!editingEmail}
          />
        </div>
        <div>
          <label className="block mb-1">Role</label>
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editingEmail ? 'Update User' : 'Create User'}
        </button>
        {editingEmail && (
          <button
            type="button"
            onClick={() => {
              setEditingEmail(null);
              setForm({ email: '', username: '', password: '', role: 'user' });
            }}
            className="ml-2 px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Daftar Users */}
      <div className="overflow-auto bg-white rounded shadow">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Email</th>
              <th className="p-2">Username</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.email} className="border-t">
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(u)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(u.email)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!users.length && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  Tidak ada user.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}