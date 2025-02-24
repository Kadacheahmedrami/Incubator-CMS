// app/api/main/landing/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const landingPageData = await prisma.landingPage.findFirst({
      include: {
        heroSections: { orderBy: { id: 'asc' } },
        visionAndMission: { orderBy: { order: 'asc' } },
        faqs: { orderBy: { order: 'asc' } },
        partners: true,
        footer: true,
        featuredStartups: {
          orderBy: { order: 'asc' },
          include: { startup: true },
        },
        featuredHistoryAndValues: {
          orderBy: { order: 'asc' },
          include: { historyAndValues: true },
        },
        featuredEvents: {
          orderBy: { order: 'asc' },
          include: { event: true },
        },
        featuredPrograms: {
          orderBy: { order: 'asc' },
          include: { program: true },
        },
        featuredNews: {
          orderBy: { order: 'asc' },
          include: { news: true },
        },
      },
    });

    if (!landingPageData) {
      return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
    }
    return NextResponse.json(landingPageData);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      heroSections,
      featuredHistoryAndValues,
      featuredEvents,
      partners,
      featuredStartups,
      faqs,
      featuredPrograms,
      featuredNews,
      visionAndMission,
      footer,
    } = await request.json();

    await prisma.$transaction(async (tx) => {
      if (heroSections) {
        await tx.hero.deleteMany();
        await tx.hero.createMany({ data: heroSections });
      }
      if (featuredHistoryAndValues) {
        await tx.featuredHistoryAndValues.deleteMany();
        await tx.featuredHistoryAndValues.createMany({ data: featuredHistoryAndValues });
      }
      if (featuredEvents) {
        await tx.featuredEvent.deleteMany();
        await tx.featuredEvent.createMany({ data: featuredEvents });
      }
      if (partners) {
        await tx.partner.deleteMany();
        await tx.partner.createMany({ data: partners });
      }
      if (featuredStartups) {
        await tx.featuredStartup.deleteMany();
        await tx.featuredStartup.createMany({ data: featuredStartups });
      }
      if (faqs) {
        await tx.fAQ.deleteMany();
        await tx.fAQ.createMany({ data: faqs });
      }
      if (featuredPrograms) {
        await tx.featuredProgram.deleteMany();
        await tx.featuredProgram.createMany({ data: featuredPrograms });
      }
      if (featuredNews) {
        await tx.featuredNews.deleteMany();
        await tx.featuredNews.createMany({ data: featuredNews });
      }
      if (visionAndMission) {
        await tx.visionAndMission.deleteMany();
        await tx.visionAndMission.createMany({ data: visionAndMission });
      }
      if (footer) {
        await tx.footer.deleteMany();
        await tx.footer.create({ data: footer });
      }
    });

    // Return the updated landing page data
    return await GET();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
