// hooks/useLandingPageData.ts
import { useState, useEffect } from 'react';

export interface LandingPageData {
  title: string;
  landingImage: string;
  description: string;
}

export default function useLandingPageData() {
  const [data, setData] = useState<LandingPageData>({
    title: '',
    landingImage: '',
    description: '',
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
      const fetchedData = await res.json();
      setData({
        title: fetchedData.title || '',
        landingImage: fetchedData.landingImage || '',
        description: fetchedData.description || '',
      });
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
      const res = await fetch('/api/main/landing', {
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
