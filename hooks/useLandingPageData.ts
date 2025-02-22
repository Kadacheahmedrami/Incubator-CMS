import { useState, useEffect } from 'react';

export interface HeroData {
  id?: number;
  landingImage: string;
  title: string;
  description: string;
  landingPageId: number;
}

export interface HistoryAndValuesData {
  id?: number;
  title: string;
  landingImage: string;
  description: string;
  order: number;
  landingPageId: number;
}

export interface EventData {
  id?: number;
  title: string;
  landingImage: string;
  description: string;
  order: number;
  landingPageId: number;
}

export interface PartnerData {
  id?: number;
  name: string;
  logo: string;
  url?: string;
  landingPageId: number;
}



export interface StartupData {
  id: number;
  name: string;
  description?: string;
  // add any other fields as needed
}

export interface FeaturedStartupData {
  id?: number;
  startupId: number;
  order: number;
  landingPageId: number;
  startup?: StartupData; // make it optional if it might not always be included
}


export interface FAQData {
  id?: number;
  question: string;
  answer: string;
  order: number;
  landingPageId: number;
}

export interface ProgramData {
  id?: number;
  title: string;
  landingImage: string;
  description: string;
  order: number;
  landingPageId: number;
}

export interface NewsData {
  id?: number;
  title: string;
  landingImage: string;
  description: string;
  order: number;
  landingPageId: number;
}

export interface VisionAndMissionData {
  id?: number;
  vision: string;
  mission: string;
  order: number;
  landingPageId: number;
}

export interface FooterData {
  id?: number;
  content: string;
  landingPageId: number;
}

export interface LandingPageData {
  heroSections: HeroData[];
  historyAndValues: HistoryAndValuesData[];
  events: EventData[];
  partners: PartnerData[];
  featuredStartups: FeaturedStartupData[];
  faqs: FAQData[];
  programs: ProgramData[];
  news: NewsData[];
  visionAndMission: VisionAndMissionData[];
  footer: FooterData;
}

function initialLandingPageData(): LandingPageData {
  return {
    heroSections: [],
    historyAndValues: [],
    events: [],
    partners: [],
    featuredStartups: [],
    faqs: [],
    programs: [],
    news: [],
    visionAndMission: [],
    footer: {
      content: '',
      landingPageId: 1,
    },
  };
}

/**
 * Transforms the API response into our expected LandingPageData shape.
 */
function transformLandingPageData(apiData: any): LandingPageData {
  const defaults = initialLandingPageData();
  return {
    heroSections: apiData.heroSections || defaults.heroSections,
    historyAndValues: apiData.historyAndValues || defaults.historyAndValues,
    events: apiData.events || defaults.events,
    partners: apiData.partners || defaults.partners,
    featuredStartups: (apiData.featuredStartups || defaults.featuredStartups).map((fs: any) => ({
      id: fs.id,
      startupId: fs.startupId,
      order: fs.order,
      landingPageId: fs.landingPageId,
    })),
    faqs: apiData.faqs || defaults.faqs,
    programs: apiData.programs || defaults.programs,
    news: apiData.news || defaults.news,
    visionAndMission: apiData.visionAndMission || defaults.visionAndMission,
    footer: apiData.footer || defaults.footer,
  };
}


export default function useLandingPageData() {
  const [data, setData] = useState<LandingPageData>(initialLandingPageData());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function refreshData() {
    try {
      const res = await fetch('/api/main/landing');
      if (!res.ok) throw new Error('Failed to load landing page data');
      const json = await res.json();
      console.log("data == ", json);
      const transformed = transformLandingPageData(json);
      setData(transformed);
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Error loading data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshData();
  }, []);

  return { data, loading, saving, message, setData, refreshData };
}
