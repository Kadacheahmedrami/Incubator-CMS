'use client';

import React, { useEffect, useState } from 'react';

interface HistoryAndValues {
  id: number;
  title: string;
  landingImage: string;
  description: string;
}

const HistoryAndValuesPage = () => {
  const [entries, setEntries] = useState<HistoryAndValues[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // State for adding a new entry
  const [newEntry, setNewEntry] = useState({
    title: '',
    landingImage: '',
    description: '',
  });

  // State for editing an entry
  const [editingEntry, setEditingEntry] = useState<HistoryAndValues | null>(null);

  // Fetch all entries
  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/main/HistoryAndValues');
      if (!res.ok) throw new Error('Failed to fetch entries');
      const data = await res.json();
      setEntries(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Handle input changes for both new and editing forms
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (editingEntry) {
      setEditingEntry({ ...editingEntry, [name]: value });
    } else {
      setNewEntry({ ...newEntry, [name]: value });
    }
  };

  // Function to upload an image using the provided /api/main/upload route
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
              type: 'HistoryAndValues',
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

  // Handle file change for new entry
  const handleNewFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const url = await uploadImage(e.target.files[0]);
        setNewEntry({ ...newEntry, landingImage: url });
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  // Handle file change for editing entry
  const handleEditFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0] && editingEntry) {
      try {
        const url = await uploadImage(e.target.files[0]);
        setEditingEntry({ ...editingEntry, landingImage: url });
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  // Add a new entry
  const handleAddEntry = async () => {
    if (!newEntry.title || !newEntry.landingImage || !newEntry.description) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      const res = await fetch('/api/main/HistoryAndValues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });
      if (!res.ok) throw new Error('Failed to add entry');
      await res.json();
      setNewEntry({ title: '', landingImage: '', description: '' });
      setSuccessMsg('Entry added successfully');
      fetchEntries();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Update an existing entry
  const handleUpdateEntry = async () => {
    if (!editingEntry) return;
    try {
      const res = await fetch(`/api/main/HistoryAndValues/${editingEntry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEntry),
      });
      if (!res.ok) throw new Error('Failed to update entry');
      await res.json();
      setEditingEntry(null);
      setSuccessMsg('Entry updated successfully');
      fetchEntries();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Delete an entry
  const handleDeleteEntry = async (id: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    try {
      const res = await fetch(`/api/main/HistoryAndValues/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete entry');
      setSuccessMsg('Entry deleted successfully');
      fetchEntries();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-bold text-center">History & Values</h1>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {successMsg && <p className="text-center text-green-500">{successMsg}</p>}

      {/* Form to add a new entry */}
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">Add New Entry</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={newEntry.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="border p-2 rounded"
          />
          <textarea
            name="description"
            value={newEntry.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="border p-2 rounded"
          />
          <div className="flex flex-col">
            {newEntry.landingImage && (
              <img
                src={newEntry.landingImage}
                alt="Preview"
                className="w-20 h-20 object-cover rounded mb-2"
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
          onClick={handleAddEntry}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
        >
          Add Entry
        </button>
      </div>

      {/* List of entries */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white shadow-md rounded p-4 flex flex-col md:flex-row md:items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              {entry.landingImage && (
                <img
                  src={entry.landingImage}
                  alt={entry.title}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <h3 className="text-xl font-bold">{entry.title}</h3>
                <p className="text-gray-600">{entry.description}</p>
              </div>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button
                onClick={() => setEditingEntry(entry)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteEntry(entry.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit entry form */}
      {editingEntry && (
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-2xl font-semibold mb-4">Edit Entry</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              value={editingEntry.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="border p-2 rounded"
            />
            <textarea
              name="description"
              value={editingEntry.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="border p-2 rounded"
            />
            <div className="flex flex-col">
              {editingEntry.landingImage && (
                <img
                  src={editingEntry.landingImage}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded mb-2"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleEditFileChange}
                className="border p-2 rounded"
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleUpdateEntry}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditingEntry(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryAndValuesPage;
