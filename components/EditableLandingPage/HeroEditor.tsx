'use client';

import React, { useState, useEffect } from 'react';
import type { HeroData } from '@/hooks/useLandingPageData';

interface HeroEditorProps {
  heroSections?: HeroData[];
  refresh: () => void;
}

const defaultHero: HeroData = {
  landingImage: '',
  title: '',
  description: '',
  landingPageId: 1,
};

const HeroEditor: React.FC<HeroEditorProps> = ({ heroSections, refresh }) => {
  const [localItems, setLocalItems] = useState<HeroData[]>(
    heroSections && heroSections.length > 0 ? heroSections : [defaultHero]
  );

  useEffect(() => {
    setLocalItems(heroSections && heroSections.length > 0 ? heroSections : [defaultHero]);
  }, [heroSections]);

  const handleChange = (index: number, field: string, value: string | number) => {
    const newItems = [...localItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setLocalItems(newItems);
  };

  const saveItem = async (item: HeroData) => {
    try {
      let res;
      if (item.id) {
        // Update an existing hero.
        res = await fetch(`/api/main/landing/hero/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      } else {
        // Create a new hero.
        res = await fetch(`/api/main/landing/hero`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save hero section');
      }
      refresh();
    } catch (err: unknown) {
      alert(err);
    }
  };

  const deleteItem = async (item: HeroData) => {
    // For unsaved hero sections, simply remove them from local state.
    if (!item.id) {
      setLocalItems(localItems.filter((i) => i !== item));
      return;
    }
    try {
      const res = await fetch(`/api/main/landing/hero/${item.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete hero section');
      }
      refresh();
    } catch (err: unknown) {
      alert(err);
    }
  };

  const addNewItem = async () => {
    const newHero: HeroData = {
      title: '',
      landingImage: '',
      description: '',
      landingPageId:
        heroSections && heroSections.length > 0 ? heroSections[0].landingPageId : 1,
    };

    try {
      const res = await fetch(`/api/main/landing/hero`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHero),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add hero section');
      }
      refresh();
    } catch (err: unknown) {
      alert(err);
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Hero Sections</h2>
      {localItems.map((item, index) => (
        <div key={item.id ?? index} className="border p-4 rounded mb-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Hero Section {index + 1}</span>
            {item.id && (
              <button
                onClick={() => deleteItem(item)}
                className="text-red-500"
              >
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
              rows={3}
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
            <HeroImageUploader 
              onUpload={(url) => handleChange(index, 'landingImage', url)}
              publicId={item.id ? `hero-${item.id}` : `hero-temp-${index}`}
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
        Add New Hero Section
      </button>
    </section>
  );
};

export default HeroEditor;

/* --------------------------------------------------------------------------
   HERO IMAGE UPLOADER COMPONENT
   --------------------------------------------------------------------------
   This component provides a drag & drop area, a file input, and a URL input.
   It uses your /api/main/landing/hero/upload endpoint to update the image.
   A publicId prop is provided so that each hero section always uploads to the same
   Cloudinary public ID, ensuring that the previous image is overridden.
-------------------------------------------------------------------------- */
interface HeroImageUploaderProps {
  onUpload: (url: string) => void;
  publicId?: string;
}

const HeroImageUploader: React.FC<HeroImageUploaderProps> = ({ onUpload, publicId }) => {
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
          const res = await fetch('/api/main/landing/hero/upload', {
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
        className={`p-4 border-2 border-dashed rounded mb-2 ${
          dragActive ? 'border-blue-500' : 'border-gray-300'
        }`}
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
