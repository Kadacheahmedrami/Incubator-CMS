'use client';

import React, { useState, useEffect } from 'react';
import type { NewsData } from '@/hooks/useLandingPageData';

interface NewsEditorProps {
  items: NewsData[];
  refresh: () => void;
}

const NewsEditor: React.FC<NewsEditorProps> = ({ items, refresh }) => {
  const [localItems, setLocalItems] = useState<NewsData[]>(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handleChange = (index: number, field: string, value: string | number) => {
    const newItems = [...localItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setLocalItems(newItems);
  };

  const saveItem = async (item: NewsData) => {
    if (!item.id) return;
    try {
      const res = await fetch(`/api/main/landing/news/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update news item');
      }
      refresh();
    } catch (err: unknown) {
      alert(err);
    }
  };

  const deleteItem = async (item: NewsData) => {
    if (!item.id) return;
    try {
      const res = await fetch(`/api/main/landing/news/${item.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete news item');
      }
      refresh();
    } catch (err: unknown) {
      alert(err);
    }
  };

  const addNewItem = async () => {
    const newItem: NewsData = {
      title: '',
      landingImage: '',
      description: '',
      order: localItems.length + 1,
      landingPageId: items.length > 0 ? items[0].landingPageId : 1,
    };
    try {
      const res = await fetch(`/api/main/landing/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add news item');
      }
      refresh();
    } catch (err: unknown) {
      alert(err);
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">News</h2>
      {localItems.map((item, index) => (
        <div key={item.id || index} className="border p-4 rounded mb-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">News Item {index + 1}</span>
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
          {/* Image Uploader Section */}
          <div className="mt-2">
            <NewsImageUploader
              onUpload={(url) => handleChange(index, 'landingImage', url)}
              publicId={item.id ? `news-${item.id}` : `news-temp-${index}`}
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
        Add New News Item
      </button>
    </section>
  );
};

export default NewsEditor;

/* --------------------------------------------------------------------------
   NEWS IMAGE UPLOADER COMPONENT
   --------------------------------------------------------------------------
   This component provides a drag & drop area, a file input, and a URL input.
   It uses your /api/main/landing/news/upload endpoint to update the image.
   A publicId prop is provided so that each news item always uploads to the same Cloudinary public ID,
   ensuring that the previous image is overridden.
-------------------------------------------------------------------------- */
interface NewsImageUploaderProps {
  onUpload: (url: string) => void;
  publicId?: string;
}

const NewsImageUploader: React.FC<NewsImageUploaderProps> = ({ onUpload, publicId }) => {
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
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
          const res = await fetch('/api/main/landing/news/upload', {
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
        } catch (err: unknown) {
          alert(err);
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
