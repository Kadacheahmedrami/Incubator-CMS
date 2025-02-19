import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { HeroData } from '@/hooks/useLandingPageData';

interface HeroEditorProps {
  hero: HeroData;
  onSave: (newHero: HeroData) => void;
}

const HeroEditor: React.FC<HeroEditorProps> = ({ hero, onSave }) => {
  const [localHero, setLocalHero] = useState<HeroData>(hero);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result as string;
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image }),
        });
        const result = await response.json();
        if (response.ok && result.url) {
          setLocalHero({ ...localHero, landingImage: result.url });
        }
        setUploading(false);
      };
      reader.onerror = () => setUploading(false);
    }
  };

  const handleSave = () => {
    onSave(localHero);
    setEditing(false);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Hero Section</h2>
      {editing ? (
        <div className="p-4 border rounded">
          <input
            type="text"
            value={localHero.title}
            onChange={(e) => setLocalHero({ ...localHero, title: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Hero Title"
          />
          <textarea
            value={localHero.description}
            onChange={(e) => setLocalHero({ ...localHero, description: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Hero Description"
          />
          <div className="mb-2">
            {localHero.landingImage && (
              <Image src={localHero.landingImage} alt="Hero Image" width={300} height={200} className="object-cover mb-2" />
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <div className="flex space-x-2">
            <button onClick={handleSave} disabled={uploading} className="bg-green-600 text-white px-4 py-2 rounded">
              Save
            </button>
            <button onClick={() => { setLocalHero(hero); setEditing(false); }} className="bg-red-600 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 border rounded">
          <h3 className="text-xl font-semibold">{localHero.title}</h3>
          <p>{localHero.description}</p>
          {localHero.landingImage && (
            <Image src={localHero.landingImage} alt="Hero Image" width={300} height={200} className="object-cover" />
          )}
          <button onClick={() => setEditing(true)} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default HeroEditor;
