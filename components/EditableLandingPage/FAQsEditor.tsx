'use client';

import React, { useState, useEffect } from 'react';
import type { FAQData } from '@/hooks/useLandingPageData';

interface FAQsEditorProps {
  items: FAQData[];
  refresh: () => void;
}

const defaultFAQ: FAQData = {
  question: '',
  answer: '',
  order: 0,
  landingPageId: 1,
};

const FAQsEditor: React.FC<FAQsEditorProps> = ({ items, refresh }) => {
  const [localItems, setLocalItems] = useState<FAQData[]>(
    items && items.length > 0 ? items : [defaultFAQ]
  );

  useEffect(() => {
    setLocalItems(items && items.length > 0 ? items : [defaultFAQ]);
  }, [items]);

  const handleChange = (index: number, field: keyof FAQData, value: string | number) => {
    const newItems = [...localItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setLocalItems(newItems);
  };

  const saveItem = async (item: FAQData) => {
    try {
      let res;
      if (item.id) {
        res = await fetch(`/api/main/landing/faqs/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      } else {
        res = await fetch(`/api/main/landing/faqs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save FAQ');
      }
      refresh();
    } catch (err: any) {
      alert(err.message || 'Error saving FAQ');
    }
  };

  const deleteItem = async (item: FAQData) => {
    if (!item.id) {
      setLocalItems(localItems.filter((i) => i !== item));
      return;
    }
    try {
      const res = await fetch(`/api/main/landing/faqs/${item.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete FAQ');
      }
      refresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting FAQ');
    }
  };

  const addNewItem = async () => {
    const newFAQ: FAQData = { ...defaultFAQ };
    try {
      const res = await fetch(`/api/main/landing/faqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFAQ),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add FAQ');
      }
      refresh();
    } catch (err: any) {
      alert(err.message || 'Error adding FAQ');
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">FAQs</h2>
      {localItems.map((item, index) => (
        <div key={item.id ?? index} className="border p-4 rounded mb-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">FAQ {index + 1}</span>
            {item.id && (
              <button onClick={() => deleteItem(item)} className="text-red-500">
                Delete
              </button>
            )}
          </div>
          <div className="mt-2">
            <label className="block font-medium">Question</label>
            <input
              type="text"
              value={item.question}
              onChange={(e) => handleChange(index, 'question', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mt-2">
            <label className="block font-medium">Answer</label>
            <textarea
              value={item.answer}
              onChange={(e) => handleChange(index, 'answer', e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
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
        Add New FAQ
      </button>
    </section>
  );
};

export default FAQsEditor;
