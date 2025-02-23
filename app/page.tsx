import { getLandingPageData } from '@/app/actions/getLandingPageData';
import LandingPageClient from '@/components/LandingPage';
export const dynamic = 'force-dynamic';



export default async function LandingPagePage() {
  console.time('LandingPageData Load Time');
  const landingPageData = await getLandingPageData();
  console.timeEnd('LandingPageData Load Time');

  return <LandingPageClient landingPageData={landingPageData} />;
}
