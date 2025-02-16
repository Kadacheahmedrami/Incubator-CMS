// app/control/landing/page.tsx
'use client';
import React from 'react';
import useLandingPageData from '@/hooks/useLandingPageData';
import LandingControlForm from '@/components/LandingControlForm';

export default function LandingControlPage() {
  const { data, loading, saving, message, setData, saveLandingPage } = useLandingPageData();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveLandingPage(data);
  };

  const handleImageUpload = (url: string) => {
    setData((prev) => ({ ...prev, landingImage: url }));
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <LandingControlForm
      data={data}
      onChange={handleChange}
      onImageUpload={handleImageUpload}
      onSubmit={handleSubmit}
      saving={saving}
      message={message}
    />
  );
}
