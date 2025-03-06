"use client";
import React, { useState, useEffect } from "react";
import { Edit, Trash2, Upload } from "lucide-react";

interface Startup {
  id: number;
  name: string;
  idea?: string;
  imageUrl?: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  createdAt: string;
}

const StartupsPage = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newStartup, setNewStartup] = useState({
    name: "",
    idea: "",
    imageUrl: "",
  });
  const [editingStartup, setEditingStartup] = useState<Startup | null>(null);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedFounderIds, setSelectedFounderIds] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchStartups = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/main/startups");
      if (!res.ok) throw new Error("Failed to fetch startups");
      const data = await res.json();
      setStartups(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const res = await fetch("/api/main/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data: User[] = await res.json();
      setAvailableUsers(data.filter((user) => user.role === "USER"));
    } catch (err: any) {
      console.error("Error fetching available users:", err.message);
    }
  };

  useEffect(() => {
    fetchStartups();
    fetchAvailableUsers();
  }, []);

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

  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result;
        try {
          const res = await fetch("/api/main/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image: base64data,
              type: "startup",
            }),
          });
          if (!res.ok) throw new Error("Failed to upload image");
          const data = await res.json();
          resolve(data.url);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleNewFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setUploading(true);
        const url = await uploadImage(e.target.files[0]);
        setNewStartup({ ...newStartup, imageUrl: url });
      } catch (err: any) {
        alert(err.message);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleFounderSelection = (
    e: React.ChangeEvent<HTMLInputElement>,
    userId: string
  ) => {
    if (e.target.checked) {
      setSelectedFounderIds((prev) => [...prev, userId]);
    } else {
      setSelectedFounderIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleAddStartup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStartup.name || !newStartup.idea) {
      alert("Please provide a startup name and description");
      return;
    }
    if (selectedFounderIds.length === 0) {
      alert("Please select at least one founder");
      return;
    }
    try {
      const payload = {
        ...newStartup,
        founderIds: selectedFounderIds,
      };
      const res = await fetch("/api/main/startups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add startup");
      await res.json();
      setNewStartup({ name: "", idea: "", imageUrl: "" });
      setSelectedFounderIds([]);
      fetchStartups();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this startup?")) return;
    try {
      const res = await fetch(`/api/main/startups/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete startup");
      fetchStartups();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Startups</h1>

      <form
        onSubmit={handleAddStartup}
        className="space-y-4 bg-white p-6 rounded-lg shadow"
      >
        <input
          type="text"
          name="name"
          value={newStartup.name}
          onChange={handleInputChange}
          placeholder="Startup Name"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleNewFileChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>{uploading ? "Uploading..." : "Choose Image"}</span>
            </label>
            {newStartup.imageUrl && (
              <div className="flex items-center space-x-2">
                <img
                  src={newStartup.imageUrl}
                  alt="Preview"
                  className="w-10 h-10 object-cover rounded"
                />
                <span className="text-sm text-gray-500">Uploaded</span>
              </div>
            )}
          </div>
        </div>

        <textarea
          name="idea"
          value={newStartup.idea}
          onChange={handleInputChange}
          placeholder="Idea Description"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
        />

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Select Founders</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableUsers.map((user) => (
              <label
                key={user.id}
                className="flex items-center p-2 border rounded hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedFounderIds.includes(user.id)}
                  onChange={(e) => handleFounderSelection(e, user.id)}
                  className="mr-2"
                />
                <span>{user.email}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Add Startup
          </button>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Idea</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {startups.map((startup) => (
              <tr key={startup.id}>
                <td className="px-6 py-4 whitespace-nowrap">{startup.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{startup.idea}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {startup.imageUrl && (
                    <img
                      src={startup.imageUrl}
                      alt={startup.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(startup.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingStartup(startup)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(startup.id)}
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

export default StartupsPage;
