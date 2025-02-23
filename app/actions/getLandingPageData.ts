import { prisma } from '@/prisma/prismaClient';

export async function getLandingPageData() {
  'use server';
  const landingPageData = await prisma.landingPage.findFirst({
    include: {
      heroSections: { orderBy: { id: 'asc' } },
      historyAndValues: { orderBy: { order: 'asc' } },
      events: { orderBy: { order: 'asc' } },
      partners: true,
      featuredStartups: {
        orderBy: { order: 'asc' },
        include: { startup: true },
      },
      faqs: { orderBy: { order: 'asc' } },
      programs: { orderBy: { order: 'asc' } },
      news: { orderBy: { order: 'asc' } },
      visionAndMission: { orderBy: { order: 'asc' } },
      footer: true,
    },
  });

  if (!landingPageData) {
    throw new Error('Landing page not found');
  }

  return landingPageData;
}
