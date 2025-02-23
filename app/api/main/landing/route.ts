// app/api/landing-page/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const landingPageData = await prisma.landingPage.findFirst({
      include: {
        heroSections: { orderBy: { id: 'asc' } },
        historyAndValues: { orderBy: { order: 'asc' } },
        events: { orderBy: { order: 'asc' } },
        partners: true,
        featuredStartups: { 
          orderBy: { order: 'asc' },
          include: { startup: true }
        },
        faqs: { orderBy: { order: 'asc' } },
        programs: { orderBy: { order: 'asc' } },
        news: { orderBy: { order: 'asc' } },
        visionAndMission: { orderBy: { order: 'asc' } },
        footer: true,
      },
    });

    if (!landingPageData) {
      return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
    }

    return NextResponse.json(landingPageData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Expect a JSON body with keys for each section:
    // heroSections, historyAndValues, events, partners, featuredStartups, faqs, programs, news, visionAndMission, footer
    const {
      heroSections,
      historyAndValues,
      events,
      partners,
      featuredStartups,
      faqs,
      programs,
      news,
      visionAndMission,
      footer,
    } = await request.json();

    // Use a transaction to update all sections atomically
    await prisma.$transaction(async (tx) => {
      if (heroSections) {
        await tx.hero.deleteMany();
        await tx.hero.createMany({ data: heroSections });
      }
      if (historyAndValues) {
        await tx.historyAndValues.deleteMany();
        await tx.historyAndValues.createMany({ data: historyAndValues });
      }
      if (events) {
        await tx.event.deleteMany();
        await tx.event.createMany({ data: events });
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
      if (programs) {
        await tx.program.deleteMany();
        await tx.program.createMany({ data: programs });
      }
      if (news) {
        await tx.news.deleteMany();
        await tx.news.createMany({ data: news });
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
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
