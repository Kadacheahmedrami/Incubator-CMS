import { prisma } from '@/prisma/prismaClient';

export async function getLandingPageData() {
  'use server';
  const landingPageData = await prisma.landingPage.findFirst({
    include: {
      heroSections: { orderBy: { id: 'asc' } },
      featuredHistoryAndValues: {
        orderBy: { order: 'asc' },
        include: { historyAndValues: true },
      },
      featuredEvents: {
        orderBy: { order: 'asc' },
        include: { event: true },
      },
      partners: true,
      featuredStartups: {
        orderBy: { order: 'asc' },
        include: { startup: true },
      },
      faqs: { orderBy: { order: 'asc' } },
      featuredPrograms: {
        orderBy: { order: 'asc' },
        include: { program: true },
      },
      featuredNews: {
        orderBy: { order: 'asc' },
        include: { news: true },
      },
      visionAndMission: { orderBy: { order: 'asc' } },
      footer: true,
    },
  });

  if (!landingPageData) {
    throw new Error('Landing page not found');
  }

  return landingPageData;
}
