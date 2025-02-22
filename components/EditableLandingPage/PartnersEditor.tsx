'use client';

import React, { useState, useEffect } from 'react';
import type { PartnerData } from '@/hooks/useLandingPageData';

interface PartnersEditorProps {
  items: PartnerData[];
  refresh: () => void;
}

const PartnersEditor: React.FC<PartnersEditorProps> = ({ items, refresh }) => {
  const [localItems, setLocalItems] = useState<PartnerData[]>(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handleChange = (index: number, field: string, value: string) => {
    const newItems = [...localItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setLocalItems(newItems);
  };

  const saveItem = async (item: PartnerData) => {
    if (!item.id) return;
    try {
      const res = await fetch(`/api/main/landing/partners/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update partner');
      }
      refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteItem = async (item: PartnerData) => {
    if (!item.id) return;
    try {
      const res = await fetch(`/api/main/landing/partners/${item.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete partner');
      }
      refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const addNewItem = async () => {
    const newItem: PartnerData = {
      name: '',
      logo: '',
      url: '',
      landingPageId: items.length > 0 ? items[0].landingPageId : 1,
    };
    try {
      const res = await fetch(`/api/main/landing/partners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add partner');
      }
      refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Partners</h2>
      {localItems.map((item, index) => (
        <div key={item.id || index} className="border p-4 rounded mb-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Partner {index + 1}</span>
            {item.id && (
              <button onClick={() => deleteItem(item)} className="text-red-500">
                Delete
              </button>
            )}
          </div>
          <div>
            <label className="block font-medium">Name</label>
            <input
              name="name"
              type="text"
              value={item.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Logo URL</label>
            <input
              name="logo"
              type="text"
              value={item.logo}
              onChange={(e) => handleChange(index, 'logo', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          {/* Logo Uploader Section */}
          <div className="mt-2">
            <PartnerImageUploader
              onUpload={(url) => handleChange(index, 'logo', url)}
              publicId={item.id ? `partner-${item.id}` : `partner-temp-${index}`}
            />
          </div>
          <div>
            <label className="block font-medium">Website URL</label>
            <input
              name="url"
              type="text"
              value={item.url || ''}
              onChange={(e) => handleChange(index, 'url', e.target.value)}
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
        Add New Partner
      </button>
    </section>
  );
};

export default PartnersEditor;

/* --------------------------------------------------------------------------
   PARTNER IMAGE UPLOADER COMPONENT
   --------------------------------------------------------------------------
   This component provides a drag & drop area, a file input, and a URL input.
   It uses your /api/main/landing/partners/upload endpoint to update the logo.
   A publicId prop is provided so that each partner always uploads to the same Cloudinary public ID,
   ensuring that the previous image is overridden.
-------------------------------------------------------------------------- */
interface PartnerImageUploaderProps {
  onUpload: (url: string) => void;
  publicId?: string;
}

const PartnerImageUploader: React.FC<PartnerImageUploaderProps> = ({ onUpload, publicId }) => {
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      uploadFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      uploadFile(file);
    }
  };

  const uploadFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64data = reader.result;
      if (typeof base64data === 'string') {
        try {
          const res = await fetch('/api/main/landing/partners/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64data, publicId }),
          });
          if (res.ok) {
            const data = await res.json();
            onUpload(data.url);
          } else {
            const errorData = await res.json();
            alert(errorData.error || 'Failed to upload image');
          }
        } catch (err: any) {
          alert(err.message);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onUpload(urlInput.trim());
      setUrlInput('');
    }
  };

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-4 border-2 border-dashed rounded mb-2 ${dragActive ? 'border-blue-500' : 'border-gray-300'}`}
      >
        <p className="text-center">Drag and drop an image file here</p>
      </div>
      <div className="mb-2">
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <form onSubmit={handleUrlSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Or enter image URL"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="border p-2 rounded flex-grow"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Set Image
        </button>
      </form>
    </div>
  );
};
