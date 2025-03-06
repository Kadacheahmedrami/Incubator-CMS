"use client";

import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Upload } from 'lucide-react';

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

  // Form state for both adding and editing entries
  const [formData, setFormData] = useState({
    title: '',
    landingImage: '',
    description: '',
  });
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<HistoryAndValues | null>(null);

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

  // Function to upload an image using the provided /api/main/upload route
  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
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
          setUploading(false);
          resolve(data.url);
        } catch (err) {
          setUploading(false);
          reject(err);
        }
      };
      reader.onerror = (error) => {
        setUploading(false);
        reject(error);
      };
    });
  };

  // Handle file change (works for both new and edit)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const url = await uploadImage(e.target.files[0]);
        setFormData((prev) => ({ ...prev, landingImage: url }));
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  // Handle input changes for the form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission for add/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.landingImage || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      const url = isEditing
        ? `/api/main/HistoryAndValues/${currentEntry?.id}`
        : '/api/main/HistoryAndValues';
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(isEditing ? 'Failed to update entry' : 'Failed to add entry');
      await res.json();
      setSuccessMsg(isEditing ? 'Entry updated successfully' : 'Entry added successfully');
      resetForm();
      fetchEntries();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Prepare form for editing an entry
  const handleEdit = (entry: HistoryAndValues) => {
    setIsEditing(true);
    setCurrentEntry(entry);
    setFormData({
      title: entry.title,
      landingImage: entry.landingImage,
      description: entry.description,
    });
  };

  // Delete an entry
  const handleDelete = async (id: number) => {
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

  // Reset the form to default state
  const resetForm = () => {
    setIsEditing(false);
    setCurrentEntry(null);
    setFormData({ title: '', landingImage: '', description: '' });
  };

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">Manage History &amp; Values</h1>

      {error && <p className="text-center text-red-500">{error}</p>}
      {successMsg && <p className="text-center text-green-500">{successMsg}</p>}
      {loading && <p className="text-center">Loading...</p>}

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload-history"
            />
            <label
              htmlFor="image-upload-history"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>{uploading ? 'Uploading...' : 'Choose Image'}</span>
            </label>
            {formData.landingImage && (
              <div className="flex items-center space-x-2">
                <img
                  src={formData.landingImage}
                  alt="Preview"
                  className="w-10 h-10 object-cover rounded"
                />
                <span className="text-sm text-gray-500">Uploaded</span>
              </div>
            )}
          </div>
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
        />

        <div className="flex space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isEditing ? 'Update Entry' : 'Add Entry'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Entries Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap">{entry.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entry.landingImage && (
                    <img
                      src={entry.landingImage}
                      alt={entry.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">{entry.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
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
    </div>
  );
};

export default HistoryAndValuesPage;
