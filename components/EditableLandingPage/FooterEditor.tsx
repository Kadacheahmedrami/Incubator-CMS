'use client';

import React, { useState, useEffect } from 'react';
import type { FooterData } from '@/hooks/useLandingPageData';

interface FooterEditorProps {
  footer: FooterData;
  refresh: () => void;
}

const defaultFooter: FooterData = {
  content: '',
  landingPageId: 1,
};

const FooterEditor: React.FC<FooterEditorProps> = ({ footer, refresh }) => {
  const [localFooter, setLocalFooter] = useState<FooterData>(footer || defaultFooter);

  useEffect(() => {
    setLocalFooter(footer || defaultFooter);
  }, [footer]);

  const handleChange = (field: keyof FooterData, value: string | number) => {
    setLocalFooter({ ...localFooter, [field]: value });
  };

  const saveFooter = async () => {
    try {
      let res;
      if (localFooter.id) {
        res = await fetch(`/api/main/landing/footer/${localFooter.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(localFooter),
        });
      } else {
        res = await fetch(`/api/main/landing/footer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(localFooter),
        });
      }
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save footer');
      }
      refresh();
    } catch (err: any) {
      alert(err.message || 'Error saving footer');
    }
  };

  const deleteFooter = async () => {
    if (!localFooter.id) return;
    try {
      const res = await fetch(`/api/main/landing/footer/${localFooter.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete footer');
      }
      refresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting footer');
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Footer</h2>
      <div className="border p-4 rounded mb-4">
        <div className="mt-2">
          <label className="block font-medium">Content</label>
          <textarea
            value={localFooter.content}
            onChange={(e) => handleChange('content', e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>
        <button
          onClick={saveFooter}
          className="mt-2 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
        >
          Save Footer
        </button>
        {localFooter.id && (
          <button
            onClick={deleteFooter}
            className="mt-2 ml-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
          >
            Delete Footer
          </button>
        )}
      </div>
    </section>
  );
};

export default FooterEditor;
