import React from 'react';
import { LandingPageData } from '@/hooks/useLandingPageData';
import ImageUpload from '@/components/upload';
import Image from 'next/image';

interface LandingControlFormProps {
  data: LandingPageData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onImageUpload: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  message: string;
}

export default function LandingControlForm({
  data,
  onChange,
  onImageUpload,
  onSubmit,
  saving,
  message,
}: LandingControlFormProps) {
  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Landing Page Control</h2>
      {message && (
        <p style={{ textAlign: 'center', color: message.includes('successfully') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
      <form onSubmit={onSubmit}>
        {/* Title */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={data.title}
            onChange={onChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>

        {/* Landing Image */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Landing Image:</label>
          <ImageUpload onUploadComplete={onImageUpload} />
          
        </div>

        {/* Description */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={data.description}
            onChange={onChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              minHeight: '100px',
            }}
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
