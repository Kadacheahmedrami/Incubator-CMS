'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useLandingPageData from '@/hooks/useLandingPageData';
import type { HeroData, FooterData } from '@/hooks/useLandingPageData';

import HeroEditor from './HeroEditor';
import HistoryAndValuesEditor from './HistoryAndValuesEditor';
import EventsEditor from './EventsEditor';
import PartnersEditor from './PartnersEditor';
import FeaturedStartupsEditor from './FeaturedStartupsEditor';
import FAQsEditor from './FAQsEditor';
import ProgramsEditor from './ProgramsEditor';
import NewsEditor from './NewsEditor';
import VisionAndMissionEditor from './VisionAndMissionEditor';
import FooterEditor from './FooterEditor';

export default function EditableLandingPageContainer() {
  const { data, loading, saving, message, setData, saveLandingPage } = useLandingPageData();
  const [globalMessage, setGlobalMessage] = useState('');

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  const handleSaveSection = (section: keyof typeof data, newData: any) => {
    setData({ ...data, [section]: newData });
    setGlobalMessage(`${section} updated successfully.`);
    setTimeout(() => setGlobalMessage(''), 3000);
  };

  const handleSaveFooter = (newFooter: FooterData) => {
    setData({ ...data, footer: newFooter });
    setGlobalMessage('Footer updated successfully.');
    setTimeout(() => setGlobalMessage(''), 3000);
  };

  const handleSaveHero = (newHero: HeroData) => {
    setData({ ...data, hero: newHero });
    setGlobalMessage('Hero updated successfully.');
    setTimeout(() => setGlobalMessage(''), 3000);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Editable Landing Page CMS</h1>
      {globalMessage && (
        <div className="fixed bottom-4 left-4 bg-black text-white p-2 rounded">
          {globalMessage}
        </div>
      )}
      <HeroEditor hero={data.hero!} onSave={handleSaveHero} />
      <HistoryAndValuesEditor items={data.historyAndValues || []} onSave={(newItems) => handleSaveSection('historyAndValues', newItems)} />
      <EventsEditor items={data.events || []} onSave={(newItems) => handleSaveSection('events', newItems)} />
      <PartnersEditor items={data.partners || []} onSave={(newItems) => handleSaveSection('partners', newItems)} />
      <FeaturedStartupsEditor items={data.featuredStartups || []} onSave={(newItems) => handleSaveSection('featuredStartups', newItems)} />
      <FAQsEditor items={data.faqs || []} onSave={(newItems) => handleSaveSection('faqs', newItems)} />
      <ProgramsEditor items={data.programs || []} onSave={(newItems) => handleSaveSection('programs', newItems)} />
      <NewsEditor items={data.news || []} onSave={(newItems) => handleSaveSection('news', newItems)} />
      <VisionAndMissionEditor items={data.visionAndMission || []} onSave={(newItems) => handleSaveSection('visionAndMission', newItems)} />
      <FooterEditor footer={data.footer!} onSave={handleSaveFooter} />
      <div className="mt-8">
        <motion.button
          onClick={() => saveLandingPage(data)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save All Changes
        </motion.button>
      </div>
      {saving && <div className="mt-4 text-center">Saving...</div>}
      {message && <div className="mt-4 text-center text-red-600">{message}</div>}
    </div>
  );
}
