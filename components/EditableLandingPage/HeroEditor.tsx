// /app/components/HeroEditor.tsx
'use client';

import React, { useState, useEffect } from 'react';
import type { HeroData } from '@/hooks/useLandingPageData';

interface HeroEditorProps {
  hero?: HeroData;
  refresh: () => void;
}

const defaultHero: HeroData = {
  landingImage: '',
  title: '',
  description: '',
  landingPageId: 1,
};

const HeroEditor: React.FC<HeroEditorProps> = ({ hero, refresh }) => {
  const [formData, setFormData] = useState<HeroData>(hero || defaultHero);

  useEffect(() => {
    setFormData(hero || defaultHero);
  }, [hero]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let res;
      if (formData.id) {
        // Update existing hero.
        res = await fetch(`/api/main/landing/hero/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new hero.
        res = await fetch(`/api/main/landing/hero`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save hero');
      }
      refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Hero Section</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input name="title" type="text" value={formData.title || ''} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea name="description" value={formData.description || ''} onChange={handleChange} className="w-full p-2 border rounded" rows={3} />
        </div>
        <div>
          <label className="block font-medium">Landing Image URL</label>
          <input name="landingImage" type="text" value={formData.landingImage || ''} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <button type="submit" className="mt-2 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded">
          Save Hero
        </button>
      </form>
    </section>
  );
};

export default HeroEditor;
