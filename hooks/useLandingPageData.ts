// /hooks/useLandingPageData.ts
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

export interface FeaturedStartupData {
  id?: number;
  startupId: number;
  order: number;
  landingPageId: number;
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
  hero: HeroData;
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
    hero: {
      landingImage: '',
      title: '',
      description: '',
      landingPageId: 1,
    },
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
 * Transforms the API response (which uses keys like "heroSections")
 * into our expected LandingPageData shape.
 */
function transformLandingPageData(apiData: any): LandingPageData {
  const defaults = initialLandingPageData();
  return {
    // Use the first hero section as our single hero object.
    hero:
      apiData.heroSections && apiData.heroSections.length > 0
        ? apiData.heroSections[0]
        : defaults.hero,
    historyAndValues: apiData.historyAndValues || defaults.historyAndValues,
    events: apiData.events || defaults.events,
    partners: apiData.partners || defaults.partners,
    featuredStartups: apiData.featuredStartups || defaults.featuredStartups,
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
