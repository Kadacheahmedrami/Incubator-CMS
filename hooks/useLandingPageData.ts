// hooks/useLandingPageData.ts
import { useState, useEffect } from 'react';

// Section interfaces
export interface HistoryAndValuesItem {
  id?: number;
  title: string;
  landingImage: string;
  description: string;
  order: number;
}

export interface EventItem {
  id?: number;
  title: string;
  landingImage: string;
  description: string;
  order: number;
}

export interface PartnerItem {
  id?: number;
  name: string;
  logo: string;
  url?: string;
}

export interface StartupItem {
  id: number;
  name: string;
  description?: string;
}

export interface FeaturedStartupItem {
  id?: number;
  startupId: number;
  order: number;
  startup?: StartupItem;
}

export interface FAQItem {
  id?: number;
  question: string;
  answer: string;
  order: number;
}

export interface ProgramItem {
  id?: number;
  title: string;
  landingImage: string;
  description: string;
  order: number;
}

export interface NewsItem {
  id?: number;
  title: string;
  landingImage: string;
  description: string;
  order: number;
}

export interface VisionAndMissionItem {
  id?: number;
  vision: string;
  mission: string;
  order: number;
}

export interface FooterData {
  id?: number;
  content: string;
}

// The complete landing page data structure now includes a hero property.
export interface LandingPageData {
  hero: { 
    landingImage: string; 
    title: string; 
    description: string; 
  };
  historyAndValues: HistoryAndValuesItem[];
  events: EventItem[];
  partners: PartnerItem[];
  featuredStartups: FeaturedStartupItem[];
  faqs: FAQItem[];
  programs: ProgramItem[];
  news: NewsItem[];
  visionAndMission: VisionAndMissionItem[];
  footer: FooterData | null;
}

export default function useLandingPageData() {
  const [data, setData] = useState<LandingPageData>({
    hero: {
      landingImage: '/placeholder.svg',
      title: 'Innovate. Incubate. Accelerate.',
      description: 'Empowering the next generation of startups.',
    },
    historyAndValues: [],
    events: [],
    partners: [],
    featuredStartups: [],
    faqs: [],
    programs: [],
    news: [],
    visionAndMission: [],
    footer: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchLandingPage = async () => {
    try {
      const res = await fetch('/api/main/landing');
      if (!res.ok) {
        setMessage('Failed to load landing page content.');
        return;
      }
      const fetchedData: LandingPageData = await res.json();
      setData(fetchedData);
    } catch (error) {
      setMessage('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const saveLandingPage = async (newData: LandingPageData) => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/landing-page', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });
      const result = await res.json();
      if (!res.ok) {
        setMessage(result.error || 'Error saving data');
      } else {
        setMessage('Landing page updated successfully.');
        setData(newData);
      }
    } catch (error: any) {
      setMessage(error.message || 'An error occurred');
    }
    setSaving(false);
  };

  useEffect(() => {
    fetchLandingPage();
  }, []);

  return { data, loading, saving, message, setData, saveLandingPage };
}
