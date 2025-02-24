import { getLandingPageData } from '@/app/actions/getLandingPageData';
import LandingPageClient from '@/components/LandingPage';

export const dynamic = 'force-dynamic';

export default async function LandingPagePage() {
  console.time('LandingPageData Load Time');
  const rawData = await getLandingPageData();
  console.timeEnd('LandingPageData Load Time');

  // Destructure join models and transform them into flat arrays
  const {
    featuredHistoryAndValues,
    featuredEvents,
    featuredPrograms,
    featuredNews,
    ...rest
  } = rawData;

  const landingPageData = {
    ...rest,
    historyAndValues: featuredHistoryAndValues.map((item) => ({
      ...item.historyAndValues,
      order: item.order,
      landingPageId: item.landingPageId,
    })),
    events: featuredEvents.map((item) => ({
      ...item.event,
      order: item.order,
      landingPageId: item.landingPageId,
    })),
    programs: featuredPrograms.map((item) => ({
      ...item.program,
      order: item.order,
      landingPageId: item.landingPageId,
    })),
    news: featuredNews.map((item) => ({
      ...item.news,
      order: item.order,
      landingPageId: item.landingPageId,
    })),
  };

  return <LandingPageClient landingPageData={landingPageData} />;
}
