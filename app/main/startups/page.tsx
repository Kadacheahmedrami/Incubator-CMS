'use client';

import React, { useEffect, useState } from 'react';

interface Startup {
  id: number;
  name: string;
  idea?: string;
  imageUrl?: string;
  createdAt: string;
}

const StartupsPage = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for creating a new startup
  const [newStartup, setNewStartup] = useState({
    name: '',
    idea: '',
    imageUrl: '',
  });

  // State for editing a startup
  const [editingStartup, setEditingStartup] = useState<Startup | null>(null);

  // Fetch all startups from the API
  const fetchStartups = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/main/startups');
      if (!res.ok) throw new Error('Failed to fetch startups');
      const data = await res.json();
      setStartups(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, []);

  // Handle changes in the new startup or edit forms
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (editingStartup) {
      setEditingStartup({ ...editingStartup, [name]: value });
    } else {
      setNewStartup({ ...newStartup, [name]: value });
    }
  };

  // Upload image to Cloudinary via our API endpoint
  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result;
        try {
          const res = await fetch('/api/main/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: base64data,
              type: 'startup',
            }),
          });
          if (!res.ok) throw new Error('Failed to upload image');
          const data = await res.json();
          resolve(data.url);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle file change for new startup form
  const handleNewFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const url = await uploadImage(e.target.files[0]);
        setNewStartup({ ...newStartup, imageUrl: url });
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  // Handle file change for editing form
  const handleEditFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0] && editingStartup) {
      try {
        const url = await uploadImage(e.target.files[0]);
        setEditingStartup({ ...editingStartup, imageUrl: url });
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  // Add a new startup
  const handleAddStartup = async () => {
    try {
      const res = await fetch('/api/main/startups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStartup),
      });
      if (!res.ok) throw new Error('Failed to add startup');
      await res.json();
      setNewStartup({ name: '', idea: '', imageUrl: '' });
      fetchStartups();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Update an existing startup
  const handleUpdate = async () => {
    if (!editingStartup) return;
    try {
      const res = await fetch(`/api/main/startups/${editingStartup.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStartup),
      });
      if (!res.ok) throw new Error('Failed to update startup');
      setEditingStartup(null);
      fetchStartups();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete a startup
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this startup?')) return;
    try {
      const res = await fetch(`/api/main/startups/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete startup');
      fetchStartups();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Startups</h1>

      {loading && <p className="text-center">Loading startups...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Form to add a new startup */}
      <div className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Startup</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            value={newStartup.name}
            onChange={handleInputChange}
            placeholder="Startup Name"
            className="border p-2 rounded"
          />
          <textarea
            name="idea"
            value={newStartup.idea}
            onChange={handleInputChange}
            placeholder="Idea Description"
            className="border p-2 rounded"
          />
          <div className="flex flex-col">
            {newStartup.imageUrl && (
              <img
                src={newStartup.imageUrl}
                alt="Startup"
                className="w-16 h-16 object-cover rounded mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleNewFileChange}
              className="border p-2 rounded"
            />
          </div>
        </div>
        <button
          onClick={handleAddStartup}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Startup
        </button>
      </div>

      {/* Display list of startups */}
      <div className="grid grid-cols-1 gap-6">
        {startups.map((startup) => (
          <div key={startup.id} className="bg-white shadow-md rounded p-6">
            {editingStartup && editingStartup.id === startup.id ? (
              <div>
                <input
                  type="text"
                  name="name"
                  value={editingStartup.name}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full mb-2"
                />
                <textarea
                  name="idea"
                  value={editingStartup.idea || ''}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full mb-2"
                />
                <div className="flex flex-col mb-2">
                  {editingStartup.imageUrl && (
                    <img
                      src={editingStartup.imageUrl}
                      alt="Startup"
                      className="w-16 h-16 object-cover rounded mb-2"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditFileChange}
                    className="border p-2 rounded"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdate}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingStartup(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-4">
                  {startup.imageUrl && (
                    <img
                      src={startup.imageUrl}
                      alt={startup.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <h3 className="text-xl font-bold">{startup.name}</h3>
                </div>
                <p className="mt-2">{startup.idea}</p>
                <p className="mt-2 text-gray-500 text-sm">
                  Created on: {new Date(startup.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => setEditingStartup(startup)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(startup.id)}
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

export default StartupsPage;
