// /app/components/ProgramsEditor.tsx
'use client';

import React, { useState, useEffect } from 'react';
import type { ProgramData } from '@/hooks/useLandingPageData';

interface ProgramsEditorProps {
  items: ProgramData[];
  refresh: () => void;
}

const ProgramsEditor: React.FC<ProgramsEditorProps> = ({ items, refresh }) => {
  const [localItems, setLocalItems] = useState<ProgramData[]>(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handleChange = (index: number, field: string, value: string | number) => {
    const newItems = [...localItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setLocalItems(newItems);
  };

  const saveItem = async (item: ProgramData) => {
    if (!item.id) return;
    try {
      const res = await fetch(`/api/main/landing/programs/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update program');
      }
      refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteItem = async (item: ProgramData) => {
    if (!item.id) return;
    try {
      const res = await fetch(`/api/main/landing/programs/${item.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete program');
      }
      refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const addNewItem = async () => {
    const newItem: ProgramData = {
      title: '',
      landingImage: '',
      description: '',
      order: localItems.length + 1,
      landingPageId: items.length > 0 ? items[0].landingPageId : 1,
    };
    try {
      const res = await fetch(`/api/main/landing/programs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add program');
      }
      refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Programs</h2>
      {localItems.map((item, index) => (
        <div key={item.id || index} className="border p-4 rounded mb-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Program {index + 1}</span>
            {item.id && (
              <button onClick={() => deleteItem(item)} className="text-red-500">
                Delete
              </button>
            )}
          </div>
          <div>
            <label className="block font-medium">Title</label>
            <input
              name="title"
              type="text"
              value={item.title}
              onChange={(e) => handleChange(index, 'title', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={item.description}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              className="w-full p-2 border rounded"
              rows={2}
            />
          </div>
          <div>
            <label className="block font-medium">Landing Image URL</label>
            <input
              name="landingImage"
              type="text"
              value={item.landingImage}
              onChange={(e) => handleChange(index, 'landingImage', e.target.value)}
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
      <button onClick={addNewItem} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded">
        Add New Program
      </button>
    </section>
  );
};

export default ProgramsEditor;
