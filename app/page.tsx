import { LandingPage } from '@/components/LandingPage';

async function getLandingPage() {
  const res = await fetch('http://localhost:3000/api/main/landing', {
    next: { revalidate: 3600 }, // Revalidate every hour
  });

  if (!res.ok) {
    throw new Error('Failed to fetch landing page content');
  }

  return res.json();
}

export default async function Home() {
  const landingPageData = await getLandingPage();

  return <LandingPage data={landingPageData} />;
}
