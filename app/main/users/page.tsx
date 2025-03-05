'use client';

import React, { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  createdAt: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for creating a new user
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    password: '',
    role: 'USER',
  });

  // State for editing a user; note that password is handled separately
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingPassword, setEditingPassword] = useState('');

  // Fetch all users from the API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/main/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle changes in the new user form
  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  // Create a new user
  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password) {
      alert('Email and password are required');
      return;
    }
    try {
      const res = await fetch('/api/main/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) throw new Error('Failed to add user');
      await res.json();
      setNewUser({ email: '', name: '', password: '', role: 'USER' });
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Handle changes in the edit form
  const handleEditUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value });
    }
  };

  // Update an existing user; if password is provided, include it, otherwise omit
  const handleUpdateUser = async () => {
    if (!editingUser) return;
    const updateData: any = {
      email: editingUser.email,
      name: editingUser.name,
      role: editingUser.role,
    };
    if (editingPassword.trim() !== '') {
      updateData.password = editingPassword;
    }
    try {
      const res = await fetch(`/api/main/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) throw new Error('Failed to update user');
      await res.json();
      setEditingUser(null);
      setEditingPassword('');
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete a user by ID
  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/main/users/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete user');
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Users</h1>

      {loading && <p className="text-center">Loading users...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* New User Form */}
      <div className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New User</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleNewUserChange}
            placeholder="Email"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleNewUserChange}
            placeholder="Name"
            className="border p-2 rounded"
          />
          <input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleNewUserChange}
            placeholder="Password"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="role"
            value={newUser.role}
            onChange={handleNewUserChange}
            placeholder="Role"
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={handleAddUser}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add User
        </button>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white shadow-md rounded p-6">
            {editingUser && editingUser.id === user.id ? (
              <div>
                <input
                  type="email"
                  name="email"
                  value={editingUser.email}
                  onChange={handleEditUserChange}
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  name="name"
                  value={editingUser.name || ''}
                  onChange={handleEditUserChange}
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  name="role"
                  value={editingUser.role}
                  onChange={handleEditUserChange}
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="password"
                  placeholder="New Password (leave blank to keep current)"
                  value={editingPassword}
                  onChange={(e) => setEditingPassword(e.target.value)}
                  className="border p-2 rounded w-full mb-2"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdateUser}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingUser(null);
                      setEditingPassword('');
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{user.email}</h3>
                  {user.name && <p>Name: {user.name}</p>}
                  <p>Role: {user.role}</p>
                  <p className="text-gray-500 text-sm">
                    Created: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setEditingPassword('');
                    }}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
