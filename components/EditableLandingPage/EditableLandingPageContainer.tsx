'use client';

import React, { useState } from 'react';

import useLandingPageData from '@/hooks/useLandingPageData';

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

const EditableLandingPageContainer: React.FC = () => {
  const { data, loading, message, refreshData } = useLandingPageData();
  const [globalMessage, ] = useState('');
  
  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Editable Landing Page CMS</h1>
      {globalMessage && (
        <div className="fixed bottom-4 left-4 bg-green-600 text-white p-2 rounded shadow">
          {globalMessage}
        </div>
      )}
      <HeroEditor heroSections={data.heroSections} refresh={refreshData} />
      <HistoryAndValuesEditor items={data.historyAndValues} refresh={refreshData} />
      <EventsEditor items={data.events} refresh={refreshData} />
      <PartnersEditor items={data.partners} refresh={refreshData} />
      <FeaturedStartupsEditor items={data.featuredStartups} refresh={refreshData} />
      <FAQsEditor items={data.faqs} refresh={refreshData} />
      <ProgramsEditor items={data.programs} refresh={refreshData} />
      <NewsEditor items={data.news} refresh={refreshData} />
      <VisionAndMissionEditor items={data.visionAndMission} refresh={refreshData} />
      <FooterEditor footer={data.footer} refresh={refreshData} />
      {message && <div className="mt-4 text-center text-red-600">{message}</div>}
    </div>
  );
};

export default EditableLandingPageContainer;
