'use client';

import React, { useState, useEffect } from 'react';
import type { PartnerData } from '@/hooks/useLandingPageData';
import HeroImageUploader from './HeroImageUploader';

interface PartnersEditorProps {
  items: PartnerData[];
  refresh: () => void;
}

const defaultPartner: PartnerData = {
  name: '',
  logo: '',
  url: '',
  landingPageId: 1,
};

const PartnersEditor: React.FC<PartnersEditorProps> = ({ items, refresh }) => {
  const [localItems, setLocalItems] = useState<PartnerData[]>(
    items && items.length > 0 ? items : [defaultPartner]
  );

  useEffect(() => {
    setLocalItems(items && items.length > 0 ? items : [defaultPartner]);
  }, [items]);

  const handleChange = (index: number, field: keyof PartnerData, value: string) => {
    const newItems = [...localItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setLocalItems(newItems);
  };

  const saveItem = async (item: PartnerData) => {
    try {
      let res;
      if (item.id) {
        res = await fetch(`/api/main/landing/partners/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      } else {
        res = await fetch(`/api/main/landing/partners`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save partner');
      }
      refresh();
    } catch (err: any) {
      alert(err.message || 'Error saving partner');
    }
  };

  const deleteItem = async (item: PartnerData) => {
    if (!item.id) {
      setLocalItems(localItems.filter((i) => i !== item));
      return;
    }
    try {
      const res = await fetch(`/api/main/landing/partners/${item.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete partner');
      }
      refresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting partner');
    }
  };

  const addNewItem = async () => {
    const newPartner: PartnerData = { ...defaultPartner };
    try {
      const res = await fetch(`/api/main/landing/partners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPartner),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add partner');
      }
      refresh();
    } catch (err: any) {
      alert(err.message || 'Error adding partner');
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Partners</h2>
      {localItems.map((item, index) => (
        <div key={item.id ?? index} className="border p-4 rounded mb-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Partner {index + 1}</span>
            {item.id && (
              <button onClick={() => deleteItem(item)} className="text-red-500">
                Delete
              </button>
            )}
          </div>
          <div className="mt-2">
            <label className="block font-medium">Name</label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mt-2">
            <label className="block font-medium">Logo URL</label>
            <input
              type="text"
              value={item.logo}
              onChange={(e) => handleChange(index, 'logo', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mt-2">
            <HeroImageUploader 
              onUpload={(url) => handleChange(index, 'logo', url)}
              publicId={item.id ? `partner-${item.id}` : `partner-temp-${index}`}
            />
          </div>
          <div className="mt-2">
            <label className="block font-medium">Website URL</label>
            <input
              type="text"
              value={item.url}
              onChange={(e) => handleChange(index, 'url', e.target.value)}
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
        Add New Partner
      </button>
    </section>
  );
};

export default PartnersEditor;
