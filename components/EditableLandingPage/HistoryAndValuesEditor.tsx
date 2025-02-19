// /app/components/HistoryAndValuesEditor.tsx
'use client';

import React, { useState, useEffect } from 'react';
import type { HistoryAndValuesData } from '@/hooks/useLandingPageData';

interface HistoryAndValuesEditorProps {
  items: HistoryAndValuesData[];
  refresh: () => void;
}

const HistoryAndValuesEditor: React.FC<HistoryAndValuesEditorProps> = ({ items, refresh }) => {
  const [localItems, setLocalItems] = useState<HistoryAndValuesData[]>(items);

  // Sync local state when items prop changes.
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handleChange = (index: number, field: string, value: string | number) => {
    const newItems = [...localItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setLocalItems(newItems);
  };

  // Save an existing item (using PUT).
  const saveItem = async (item: HistoryAndValuesData) => {
    if (!item.id) return;
    try {
      const res = await fetch(`/api/main/landing/history-values/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update item');
      }
      refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete an item.
  const deleteItem = async (item: HistoryAndValuesData) => {
    if (!item.id) return;
    try {
      const res = await fetch(`/api/main/landing/history-values/${item.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete item');
      }
      refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Add a new item (using POST).
  const addNewItem = async () => {
    const newItem: HistoryAndValuesData = {
      title: '',
      landingImage: '',
      description: '',
      order: localItems.length + 1,
      landingPageId: items.length > 0 ? items[0].landingPageId : 1,
    };
    try {
      const res = await fetch(`/api/main/landing/history-values`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add item');
      }
      refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">History & Values</h2>
      {localItems.map((item, index) => (
        <div key={item.id || index} className="border p-4 rounded mb-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Item {index + 1}</span>
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
          {item.id ? (
            <button
              onClick={() => saveItem(item)}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
            >
              Save Changes
            </button>
          ) : (
            <span className="text-gray-500">New item – click "Add New" to save.</span>
          )}
        </div>
      ))}
      <button onClick={addNewItem} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded">
        Add New History/Value
      </button>
    </section>
  );
};

export default HistoryAndValuesEditor;
