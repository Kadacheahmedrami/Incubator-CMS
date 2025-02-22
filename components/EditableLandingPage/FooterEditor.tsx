// /app/components/FooterEditor.tsx
'use client';

import React, { useState, useEffect } from 'react';
import type { FooterData } from '@/hooks/useLandingPageData';

interface FooterEditorProps {
  footer?: FooterData;
  refresh: () => void;
}

const defaultFooter: FooterData = {
  content: '',
  landingPageId: 1,
};

const FooterEditor: React.FC<FooterEditorProps> = ({ footer, refresh }) => {
  const [formData, setFormData] = useState<FooterData>(footer || defaultFooter);

  useEffect(() => {
    setFormData(footer || defaultFooter);
  }, [footer]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let res;
      if (formData.id) {
        // Update existing footer.
        res = await fetch(`/api/main/landing/footer/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new footer.
        res = await fetch(`/api/main/landing/footer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save footer');
      }
      refresh();
    } catch (err: unknown) {
      alert(err);
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Footer</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block font-medium">Content</label>
          <textarea
            name="content"
            value={formData.content || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
        >
          Save Footer
        </button>
      </form>
    </section>
  );
};

export default FooterEditor;
