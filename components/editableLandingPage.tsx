'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import useLandingPageData, {
  HistoryAndValuesItem,
  EventItem,
  PartnerItem,
  FeaturedStartupItem,
  FAQItem,
  ProgramItem,
  NewsItem,
  VisionAndMissionItem,
  FooterData,
} from '@/hooks/useLandingPageData';
import imageCompression from 'browser-image-compression';

// Extended data type including hero information
export interface HeroData {
  landingImage: string;
  title: string;
  description: string;
}

// ExtendedLandingPageData includes all sections that you control.
export interface ExtendedLandingPageData {
  hero?: HeroData;
  historyAndValues?: HistoryAndValuesItem[];
  events?: EventItem[];
  partners?: PartnerItem[];
  featuredStartups?: FeaturedStartupItem[];
  faqs?: FAQItem[];
  programs?: ProgramItem[];
  news?: NewsItem[];
  visionAndMission?: VisionAndMissionItem[];
  footer?: FooterData;
}

export default function EditableLandingPage() {
  const { data, loading, saving, message, setData, saveLandingPage } = useLandingPageData();
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Create safe defaults so every section is defined
  const safeData: Required<ExtendedLandingPageData> = {
    hero: data.hero || {
      landingImage: "/placeholder.svg",
      title: "Innovate. Incubate. Accelerate.",
      description: "Empowering the next generation of startups.",
    },
    historyAndValues: data.historyAndValues || [],
    events: data.events || [],
    partners: data.partners || [],
    featuredStartups: data.featuredStartups || [],
    faqs: data.faqs || [],
    programs: data.programs || [],
    news: data.news || [],
    visionAndMission: data.visionAndMission || [],
    footer: data.footer || { content: "" },
  };

  // Helper to update a field for array-based sections
  const handleArrayChange = (
    section: keyof ExtendedLandingPageData,
    index: number,
    field: string,
    value: any
  ) => {
    const sectionData = [...(safeData[section] as any[])];
    sectionData[index] = { ...sectionData[index], [field]: value };
    setData({ ...data, [section]: sectionData });
  };

  // Helper to update a field for object-based sections (like hero or footer)
  const handleObjectChange = (
    section: keyof ExtendedLandingPageData,
    field: string,
    value: any
  ) => {
    setData({ ...data, [section]: { ...data[section], [field]: value } });
  };

  // Convert a File object to a Base64 string
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Generic handler for file upload on array-based sections
  const handleFileUpload = async (
    section: keyof ExtendedLandingPageData,
    index: number,
    field: string,
    file: File
  ) => {
    try {
      setUploading(true);
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const base64Image = await convertFileToBase64(compressedFile);
      // Upload image via /api/upload endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });
      const result = await response.json();
      if (response.ok && result.url) {
        handleArrayChange(section, index, field, result.url);
      } else {
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  // Separate file upload handler for the hero section (object-based)
  const handleHeroFileUpload = async (file: File) => {
    try {
      setUploading(true);
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const base64Image = await convertFileToBase64(compressedFile);
      // Upload image via /api/upload endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });
      const result = await response.json();
      if (response.ok && result.url) {
        handleObjectChange("hero", "landingImage", result.url);
      } else {
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      console.error('Error uploading hero image:', error);
    } finally {
      setUploading(false);
    }
  };

  // Save changes and exit edit mode
  const handleSave = async () => {
    await saveLandingPage(data);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    // Optionally, refetch data to reset unsaved changes.
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Editable Landing Page CMS</h1>

      {/* Global Edit Controls */}
      <div className="mb-4">
        {editing ? (
          <>
            <motion.button
              onClick={handleSave}
              disabled={uploading || saving}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              {uploading || saving ? 'Saving...' : 'Save'}
            </motion.button>
            <motion.button
              onClick={handleCancel}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </motion.button>
          </>
        ) : (
          <motion.button
            onClick={() => setEditing(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit
          </motion.button>
        )}
      </div>

      {/* HERO SECTION */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Hero Section</h2>
        {editing ? (
          <div className="mb-4 p-4 border rounded">
            <input
              type="text"
              value={safeData.hero.title}
              onChange={(e) => handleObjectChange("hero", "title", e.target.value)}
              className="w-full mb-2 p-2 border rounded"
              placeholder="Hero Title"
            />
            <textarea
              value={safeData.hero.description}
              onChange={(e) => handleObjectChange("hero", "description", e.target.value)}
              className="w-full mb-2 p-2 border rounded"
              placeholder="Hero Description"
            />
            <div className="mb-2">
              {safeData.hero.landingImage && (
                <Image
                  src={safeData.hero.landingImage}
                  alt="Hero Image"
                  width={300}
                  height={200}
                  className="object-cover mb-2"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleHeroFileUpload(file);
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <div className="mb-4 p-4 border rounded">
            <h3 className="text-xl font-semibold">{safeData.hero.title}</h3>
            <p>{safeData.hero.description}</p>
            {safeData.hero.landingImage && (
              <Image
                src={safeData.hero.landingImage}
                alt="Hero Image"
                width={300}
                height={200}
                className="object-cover"
              />
            )}
          </div>
        )}
      </section>

      {/* HISTORY & VALUES SECTION */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">History & Values</h2>
        {safeData.historyAndValues.map((item: HistoryAndValuesItem, index: number) => (
          <div key={index} className="mb-4 p-4 border rounded">
            {editing ? (
              <>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleArrayChange('historyAndValues', index, 'title', e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Title"
                />
                <textarea
                  value={item.description}
                  onChange={(e) => handleArrayChange('historyAndValues', index, 'description', e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Description"
                />
                <input
                  type="number"
                  value={item.order}
                  onChange={(e) => handleArrayChange('historyAndValues', index, 'order', Number(e.target.value))}
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Order"
                />
                <div className="mb-2">
                  {item.landingImage && (
                    <Image
                      src={item.landingImage}
                      alt="History Image"
                      width={200}
                      height={120}
                      className="object-cover mb-2"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload('historyAndValues', index, 'landingImage', file);
                      }
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p>{item.description}</p>
                <p className="text-gray-500">Order: {item.order}</p>
                {item.landingImage && (
                  <Image
                    src={item.landingImage}
                    alt="History Image"
                    width={200}
                    height={120}
                    className="object-cover"
                  />
                )}
              </>
            )}
          </div>
        ))}
      </section>

      {/* EVENTS SECTION */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Events</h2>
        {safeData.events.map((item: EventItem, index: number) => (
          <div key={index} className="mb-4 p-4 border rounded">
            {editing ? (
              <>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleArrayChange('events', index, 'title', e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Title"
                />
                <textarea
                  value={item.description}
                  onChange={(e) => handleArrayChange('events', index, 'description', e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Description"
                />
                <input
                  type="number"
                  value={item.order}
                  onChange={(e) => handleArrayChange('events', index, 'order', Number(e.target.value))}
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Order"
                />
                <div className="mb-2">
                  {item.landingImage && (
                    <Image
                      src={item.landingImage}
                      alt="Event Image"
                      width={200}
                      height={120}
                      className="object-cover mb-2"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload('events', index, 'landingImage', file);
                      }
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p>{item.description}</p>
                <p className="text-gray-500">Order: {item.order}</p>
                {item.landingImage && (
                  <Image
                    src={item.landingImage}
                    alt="Event Image"
                    width={200}
                    height={120}
                    className="object-cover"
                  />
                )}
              </>
            )}
          </div>
        ))}
      </section>

      {/* PARTNERS SECTION */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Partners</h2>
        {safeData.partners.map((item: PartnerItem, index: number) => (
          <div key={index} className="mb-4 p-4 border rounded">
            {editing ? (
              <>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleArrayChange('partners', index, 'name', e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Partner Name"
                />
                <input
                  type="text"
                  value={item.url || ''}
                  onChange={(e) => handleArrayChange('partners', index, 'url', e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Partner URL"
                />
                <div className="mb-2">
                  {item.logo && (
                    <Image
                      src={item.logo}
                      alt="Partner Logo"
                      width={200}
                      height={120}
                      className="object-cover mb-2"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload('partners', index, 'logo', file);
                      }
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold">{item.name}</h3>
                {item.url && <p>{item.url}</p>}
                {item.logo && (
                  <Image
                    src={item.logo}
                    alt="Partner Logo"
                    width={200}
                    height={120}
                    className="object-cover"
                  />
                )}
              </>
            )}
          </div>
        ))}
      </section>

      {/* FEATURED STARTUPS SECTION */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Startups</h2>
        {safeData.featuredStartups.map((item: FeaturedStartupItem, index: number) => (
          <div key={index} className="mb-4 p-4 border rounded">
            {editing ? (
              <>
                <input
                  type="number"
                  value={item.startupId}
                  onChange={(e) =>
                    handleArrayChange('featuredStartups', index, 'startupId', Number(e.target.value))
                  }
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Startup ID"
                />
                <input
                  type="number"
                  value={item.order}
                  onChange={(e) =>
                    handleArrayChange('featuredStartups', index, 'order', Number(e.target.value))
                  }
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Order"
                />
              </>
            ) : (
              <>
                <p>
                  <strong>Startup ID:</strong> {item.startupId}
                </p>
                <p>
                  <strong>Order:</strong> {item.order}
                </p>
                {item.startup && <p><strong>Name:</strong> {item.startup.name}</p>}
              </>
            )}
          </div>
        ))}
      </section>

      {/* FAQ SECTION */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">FAQs</h2>
        {safeData.faqs.map((item: FAQItem, index: number) => (
          <div key={index} className="mb-4 p-4 border rounded">
            {editing ? (
              <>
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) => handleArrayChange('faqs', index, 'question', e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Question"
                />
                <textarea
                  value={item.answer}
                  onChange={(e) => handleArrayChange('faqs', index, 'answer', e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Answer"
                />
                <input
                  type="number"
                  value={item.order}
                  onChange={(e) => handleArrayChange('faqs', index, 'order', Number(e.target.value))}
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Order"
                />
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold">{item.question}</h3>
                <p>{item.answer}</p>
                <p className="text-gray-500">Order: {item.order}</p>
              </>
            )}
          </div>
        ))}
      </section>

      {/* PROGRAMS SECTION */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Programs</h2>
        {safeData.programs.map((item: ProgramItem, index: number) => (
          <div key={index} className="mb-4 p-4 border rounded">
            {editing ? (
              <>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleArrayChange('programs', index, 'title', e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Title"
                />
                <textarea
                  value={item.description}
                  onChange={(e) => handleArrayChange('programs', index, 'description', e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Description"
                />
                <input
                  type="number"
                  value={item.order}
                  onChange={(e) => handleArrayChange('programs', index, 'order', Number(e.target.value))}
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Order"
                />
                <div className="mb-2">
                  {item.landingImage && (
                    <Image
                      src={item.landingImage}
                      alt="Program Image"
                      width={200}
                      height={120}
                      className="object-cover mb-2"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload('programs', index, 'landingImage', file);
                      }
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p>{item.description}</p>
                <p className="text-gray-500">Order: {item.order}</p>
                {item.landingImage && (
                  <Image
                    src={item.landingImage}
                    alt="Program Image"
                    width={200}
                    height={120}
                    className="object-cover"
                  />
                )}
              </>
            )}
          </div>
        ))}
      </section>

      {/* NEWS SECTION */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">News</h2>
        {safeData.news.map((item: NewsItem, index: number) => (
          <div key={index} className="mb-4 p-4 border rounded">
            {editing ? (
              <>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleArrayChange('news', index, 'title', e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Title"
                />
                <textarea
                  value={item.description}
                  onChange={(e) => handleArrayChange('news', index, 'description', e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Description"
                />
                <input
                  type="number"
                  value={item.order}
                  onChange={(e) => handleArrayChange('news', index, 'order', Number(e.target.value))}
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Order"
                />
                <div className="mb-2">
                  {item.landingImage && (
                    <Image
                      src={item.landingImage}
                      alt="News Image"
                      width={200}
                      height={120}
                      className="object-cover mb-2"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload('news', index, 'landingImage', file);
                      }
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p>{item.description}</p>
                <p className="text-gray-500">Order: {item.order}</p>
                {item.landingImage && (
                  <Image
                    src={item.landingImage}
                    alt="News Image"
                    width={200}
                    height={120}
                    className="object-cover"
                  />
                )}
              </>
            )}
          </div>
        ))}
      </section>

      {/* VISION & MISSION SECTION */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Vision & Mission</h2>
        {safeData.visionAndMission.map((item: VisionAndMissionItem, index: number) => (
          <div key={index} className="mb-4 p-4 border rounded">
            {editing ? (
              <>
                <textarea
                  value={item.vision}
                  onChange={(e) =>
                    handleArrayChange('visionAndMission', index, 'vision', e.target.value)
                  }
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Vision"
                />
                <textarea
                  value={item.mission}
                  onChange={(e) =>
                    handleArrayChange('visionAndMission', index, 'mission', e.target.value)
                  }
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Mission"
                />
                <input
                  type="number"
                  value={item.order}
                  onChange={(e) =>
                    handleArrayChange('visionAndMission', index, 'order', Number(e.target.value))
                  }
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Order"
                />
              </>
            ) : (
              <>
                <p className="font-semibold">Vision: {item.vision}</p>
                <p className="font-semibold">Mission: {item.mission}</p>
                <p className="text-gray-500">Order: {item.order}</p>
              </>
            )}
          </div>
        ))}
      </section>

      {/* FOOTER SECTION */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Footer</h2>
        <div className="p-4 border rounded">
          {editing ? (
            <textarea
              value={safeData.footer.content}
              onChange={(e) => handleObjectChange('footer', 'content', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Footer Content"
            />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: safeData.footer.content }} />
          )}
        </div>
      </section>

      {message && (
        <div className="fixed bottom-4 left-4 bg-black text-white p-2 rounded">
          {message}
        </div>
      )}
    </div>
  );
}
