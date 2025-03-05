'use client';

import React, { useState } from 'react';
import useLandingPageData from '@/hooks/useLandingPageData';

import HeroEditor from '@/components/EditableLandingPage/HeroEditor';
import FeaturedHistoryAndValuesSelector from '@/components/EditableLandingPage/FeturedHistoryAndValues';
import PartnersEditor from '@/components/EditableLandingPage/PartnersEditor';

import FAQsEditor from '@/components/EditableLandingPage/FAQsEditor';
import FeaturedStartupSelector from '@/components/EditableLandingPage/FeturedStartups';

import VisionAndMissionEditor from '@/components/EditableLandingPage/VisionAndMissionEditor';
import FooterEditor from '@/components/EditableLandingPage/FooterEditor';

const EditableLandingPageContainer: React.FC = () => {
  const { data, loading, message, refreshData } = useLandingPageData();
  const [globalMessage] = useState('');
  
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
  
   
      <PartnersEditor items={data.partners} refresh={refreshData} />

      <FAQsEditor items={data.faqs} refresh={refreshData} />
      <FeaturedStartupSelector></FeaturedStartupSelector>
      <FeaturedHistoryAndValuesSelector></FeaturedHistoryAndValuesSelector>

      <VisionAndMissionEditor items={data.visionAndMission} refresh={refreshData} />
      <FooterEditor footer={data.footer} refresh={refreshData} />
      {message && <div className="mt-4 text-center text-red-600">{message}</div>}
    </div>
  );
};

export default EditableLandingPageContainer;
  