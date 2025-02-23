'use client';

import React, { useState, useEffect } from 'react';
import type { FeaturedStartupData } from '@/hooks/useLandingPageData';

interface FeaturedStartupsEditorProps {
  items: FeaturedStartupData[];
  refresh: () => void;
}

interface Startup {
  id: number;
  name: string;
  description?: string;
}

// Helper to safely parse JSON from a response.
const safeParseJson = async (res: Response) => {
  try {
    return await res.json();
  } catch (error) {
    return {};
  }
};

const FeaturedStartupsEditor: React.FC<FeaturedStartupsEditorProps> = ({ items, refresh }) => {
  const [localItems, setLocalItems] = useState<FeaturedStartupData[]>(items);
  const [availableStartups, setAvailableStartups] = useState<Startup[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newStartupName, setNewStartupName] = useState('');
  const [newStartupDescription, setNewStartupDescription] = useState('');
  const [selectedStartupId, setSelectedStartupId] = useState<number>(0);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  useEffect(() => {
    fetchAvailableStartups();
  }, []);

  const fetchAvailableStartups = async () => {
    try {
      const res = await fetch('/api/main/startups');
      if (!res.ok) throw new Error('Failed to fetch startups');
      const startups = await res.json();
      setAvailableStartups(startups);
    } catch (error) {
      console.error('Error fetching startups:', error);
      alert('Failed to load startups');
    }
  };

  const handleChange = (
    index: number,
    field: keyof FeaturedStartupData,
    value: string | number
  ) => {
    const newItems = [...localItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setLocalItems(newItems);
  };

  const saveItem = async (item: FeaturedStartupData) => {
    if (!item.id) return;
    try {
      const res = await fetch(`/api/main/landing/featured-startups/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) {
        const errorData = await safeParseJson(res);
        throw new Error(errorData.error || 'Failed to update featured startup');
      }
      refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  const deleteItem = async (item: FeaturedStartupData) => {
    if (!item.id) return;
    try {
      const res = await fetch(`/api/main/landing/featured-startups/${item.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await safeParseJson(res);
        throw new Error(errorData.error || 'Failed to delete featured startup');
      }
      refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  const addNewStartup = async () => {
    if (!newStartupName.trim()) {
      alert('Please enter a startup name');
      return;
    }

    try {
      // First create the startup
      const createRes = await fetch('/api/main/startups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStartupName.trim(),
          description: newStartupDescription.trim() || undefined
        }),
      });

      if (!createRes.ok) {
        const errorData = await createRes.json();
        throw new Error(errorData.error || 'Failed to create startup');
      }

      const newStartup = await createRes.json();

      // Then feature it
      const featureRes = await fetch('/api/main/landing/featured-startups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupId: newStartup.id,
          order: localItems.length + 1,
          landingPageId: items.length > 0 ? items[0].landingPageId : 1,
        }),
      });

      if (!featureRes.ok) {
        const errorData = await featureRes.json();
        throw new Error(errorData.error || 'Failed to feature startup');
      }

      setNewStartupName('');
      setNewStartupDescription('');
      setIsAddingNew(false);
      refresh();
      fetchAvailableStartups();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  const addExistingStartup = async () => {
    if (!selectedStartupId) {
      alert('Please select a startup');
      return;
    }

    try {
      const res = await fetch('/api/main/landing/featured-startups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupId: selectedStartupId,
          order: localItems.length + 1,
          landingPageId: items.length > 0 ? items[0].landingPageId : 1,
        }),
      });

      if (!res.ok) {
        const errorData = await safeParseJson(res);
        throw new Error(errorData.error || 'Failed to add featured startup');
      }

      setSelectedStartupId(0);
      refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Featured Startups</h2>
      
      <div className="border p-4 rounded mb-4">
        <h3 className="text-xl font-semibold mb-4">Add Featured Startup</h3>
        
        {/* Select existing startup */}
        <div className="mb-4">
          <div className="flex gap-4">
            <select
              value={selectedStartupId}
              onChange={(e) => setSelectedStartupId(Number(e.target.value))}
              className="flex-1 p-2 border rounded"
              disabled={isAddingNew}
            >
              <option value={0}>Select existing startup...</option>
              {availableStartups.map(startup => (
                <option key={startup.id} value={startup.id}>
                  {startup.name}
                </option>
              ))}
            </select>
            <button
              onClick={addExistingStartup}
              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
              disabled={isAddingNew}
            >
              Add Selected
            </button>
          </div>
        </div>

        {/* Create new startup */}
        <div className="border-t pt-4">
          {!isAddingNew ? (
            <button
              onClick={() => setIsAddingNew(true)}
              className="text-blue-500 hover:text-blue-600"
            >
              + Create New Startup
            </button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block font-medium">Startup Name *</label>
                <input
                  type="text"
                  value={newStartupName}
                  onChange={(e) => setNewStartupName(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter startup name"
                />
              </div>
              <div>
                <label className="block font-medium">Description (optional)</label>
                <textarea
                  value={newStartupDescription}
                  onChange={(e) => setNewStartupDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter startup description"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addNewStartup}
                  className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
                >
                  Create and Feature
                </button>
                <button
                  onClick={() => {
                    setIsAddingNew(false);
                    setNewStartupName('');
                    setNewStartupDescription('');
                  }}
                  className="text-gray-500 hover:text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* List of featured startups */}
      {localItems.map((item, index) => (
        <div key={item.id || index} className="border p-4 rounded mb-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Featured Startup {index + 1}</span>
            {item.id && (
              <button onClick={() => deleteItem(item)} className="text-red-500">
                Delete
              </button>
            )}
          </div>
          <div>
            <label className="block font-medium">Startup ID</label>
            <input
              name="startupId"
              type="number"
              value={item.startupId}
              onChange={(e) => handleChange(index, 'startupId', Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Order</label>
            <input
              name="order"
              type="number"
              value={item.order}
              onChange={(e) => handleChange(index, 'order', Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          {item.id && (
            <button
              onClick={() => saveItem(item)}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
            >
              Save Changes
            </button>
          )}
        </div>
      ))}
    </section>
  );
};

export default FeaturedStartupsEditor;