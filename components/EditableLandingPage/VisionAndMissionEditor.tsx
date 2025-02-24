'use client';

import React, { useState, useEffect } from 'react';
import type { VisionAndMissionData } from '@/hooks/useLandingPageData';

interface VisionAndMissionEditorProps {
  items: VisionAndMissionData[];
  refresh: () => void;
}

const defaultVM: VisionAndMissionData = {
  vision: '',
  mission: '',
  order: 0,
  landingPageId: 1,
};

const VisionAndMissionEditor: React.FC<VisionAndMissionEditorProps> = ({ items, refresh }) => {
  const [localItems, setLocalItems] = useState<VisionAndMissionData[]>(
    items && items.length > 0 ? items : [defaultVM]
  );

  useEffect(() => {
    setLocalItems(items && items.length > 0 ? items : [defaultVM]);
  }, [items]);

  const handleChange = (index: number, field: keyof VisionAndMissionData, value: string | number) => {
    const newItems = [...localItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setLocalItems(newItems);
  };

  const saveItem = async (item: VisionAndMissionData) => {
    try {
      let res;
      if (item.id) {
        res = await fetch(`/api/main/landing/vision-mission/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      } else {
        res = await fetch(`/api/main/landing/vision-mission`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save vision & mission');
      }
      refresh();
    } catch (err: any) {
      alert(err.message || 'Error saving vision & mission');
    }
  };

  const deleteItem = async (item: VisionAndMissionData) => {
    if (!item.id) {
      setLocalItems(localItems.filter((i) => i !== item));
      return;
    }
    try {
      const res = await fetch(`/api/main/landing/vision-mission/${item.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete vision & mission');
      }
      refresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting vision & mission');
    }
  };

  const addNewItem = async () => {
    const newItem: VisionAndMissionData = { ...defaultVM };
    try {
      const res = await fetch(`/api/main/landing/vision-mission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add vision & mission');
      }
      refresh();
    } catch (err: any) {
      alert(err.message || 'Error adding vision & mission');
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Vision & Mission</h2>
      {localItems.map((item, index) => (
        <div key={item.id ?? index} className="border p-4 rounded mb-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Vision & Mission {index + 1}</span>
            {item.id && (
              <button onClick={() => deleteItem(item)} className="text-red-500">
                Delete
              </button>
            )}
          </div>
          <div className="mt-2">
            <label className="block font-medium">Vision</label>
            <input
              type="text"
              value={item.vision}
              onChange={(e) => handleChange(index, 'vision', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mt-2">
            <label className="block font-medium">Mission</label>
            <input
              type="text"
              value={item.mission}
              onChange={(e) => handleChange(index, 'mission', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mt-2">
            <label className="block font-medium">Order</label>
            <input
              type="number"
              value={item.order}
              onChange={(e) => handleChange(index, 'order', Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={() => saveItem(item)}
            className="mt-2 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
          >
            Save Changes
          </button>
        </div>
      ))}
      <button
        onClick={addNewItem}
        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
      >
        Add New Vision & Mission
      </button>
    </section>
  );
};

export default VisionAndMissionEditor;
