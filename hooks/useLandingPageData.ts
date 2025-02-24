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
  startup?: StartupData; // optional if it might not always be included
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
    heroSections: [] as HeroData[],
    historyAndValues: [] as HistoryAndValuesData[],
    events: [] as EventData[],
    partners: [] as PartnerData[],
    featuredStartups: [] as FeaturedStartupData[],
    faqs: [] as FAQData[],
    programs: [] as ProgramData[],
    news: [] as NewsData[],
    visionAndMission: [] as VisionAndMissionData[],
    footer: {
      content: '',
      landingPageId: 1,
    },
  };
}

/**
 * Transforms the API response into our expected LandingPageData shape.
 * The new API returns join models for some sections:
 * - featuredHistoryAndValues → historyAndValues
 * - featuredEvents → events
 * - featuredPrograms → programs
 * - featuredNews → news
 */
function transformLandingPageData(apiData: any): LandingPageData {
  const defaults = initialLandingPageData();
  return {
    heroSections: apiData.heroSections || defaults.heroSections,
    historyAndValues: (apiData.featuredHistoryAndValues || []).map((fhv: any) => ({
      id: fhv.id,
      title: fhv.historyAndValues?.title,
      landingImage: fhv.historyAndValues?.landingImage,
      description: fhv.historyAndValues?.description,
      order: fhv.order,
      landingPageId: fhv.landingPageId,
    })),
    events: (apiData.featuredEvents || []).map((fe: any) => ({
      id: fe.id,
      title: fe.event?.title,
      landingImage: fe.event?.landingImage,
      description: fe.event?.description,
      order: fe.order,
      landingPageId: fe.landingPageId,
    })),
    partners: apiData.partners || defaults.partners,
    featuredStartups: (apiData.featuredStartups || []).map((fs: any) => ({
      id: fs.id,
      startupId: fs.startupId,
      order: fs.order,
      landingPageId: fs.landingPageId,
      startup: fs.startup,
    })),
    // FAQs should be an array of FAQData. If the API returns it correctly, no mapping is needed.
    faqs: apiData.faqs || ([] as FAQData[]),
    programs: (apiData.featuredPrograms || []).map((fp: any) => ({
      id: fp.id,
      title: fp.program?.title,
      landingImage: fp.program?.landingImage,
      description: fp.program?.description,
      order: fp.order,
      landingPageId: fp.landingPageId,
    })),
    news: (apiData.featuredNews || []).map((fn: any) => ({
      id: fn.id,
      title: fn.news?.title,
      landingImage: fn.news?.landingImage,
      description: fn.news?.description,
      order: fn.order,
      landingPageId: fn.landingPageId,
    })),
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
      console.log("API data:", json);
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
