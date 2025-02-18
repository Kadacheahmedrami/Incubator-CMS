// app/api/landing-page/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    // Fetch the single LandingPage record along with all its related sections.
    const landingPage = await prisma.landingPage.findUnique({
      where: { id: 1 }, // Assumes the one landing page has id = 1
      include: {
        hero: true,
        historyAndValues: { orderBy: { order: 'asc' } },
        events: { orderBy: { order: 'asc' } },
        partners: true,
        featuredStartups: {
          include: { startup: true },
          orderBy: { order: 'asc' },
        },
        // The generated client property for FAQ might be either 'fAQ' or 'faq'
        // depending on your naming. Adjust accordingly.
        faqs: { orderBy: { order: 'asc' } },
        programs: { orderBy: { order: 'asc' } },
        news: { orderBy: { order: 'asc' } },
        visionAndMission: { orderBy: { order: 'asc' } },
        footer: true,
      },
    });

    if (!landingPage) {
      return NextResponse.json(
        { error: 'Landing page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(landingPage);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Expect a JSON body with keys for each section:
    // hero, historyAndValues, events, partners, featuredStartups, fAQ, programs, news, visionAndMission, footer
    const {
      hero,
      historyAndValues,
      events,
      partners,
      featuredStartups,
      fAQ,
      programs,
      news,
      visionAndMission,
      footer,
    } = await request.json();

    await prisma.$transaction(async (tx) => {
      // --- Update Hero (one-to-one) ---
      if (hero) {
        const existingLandingPage = await tx.landingPage.findUnique({
          where: { id: 1 },
          include: { hero: true },
        });
        if (existingLandingPage?.hero) {
          await tx.hero.update({
            where: { id: existingLandingPage.hero.id },
            data: hero,
          });
        } else {
          // If no hero exists, create one and update the landingPage record
          const newHero = await tx.hero.create({ data: hero });
          await tx.landingPage.update({
            where: { id: 1 },
            data: { heroId: newHero.id },
          });
        }
      }

      // --- Update List Sections ---
      // For each list section, we delete existing records (for landingPage id 1)
      // and recreate them with the new data (attaching landingPageId: 1).
      if (historyAndValues) {
        await tx.historyAndValues.deleteMany({ where: { landingPageId: 1 } });
        const dataToInsert = historyAndValues.map((item: any) => ({
          ...item,
          landingPageId: 1,
        }));
        await tx.historyAndValues.createMany({ data: dataToInsert });
      }

      if (events) {
        await tx.event.deleteMany({ where: { landingPageId: 1 } });
        const dataToInsert = events.map((item: any) => ({
          ...item,
          landingPageId: 1,
        }));
        await tx.event.createMany({ data: dataToInsert });
      }

      if (partners) {
        await tx.partner.deleteMany({ where: { landingPageId: 1 } });
        const dataToInsert = partners.map((item: any) => ({
          ...item,
          landingPageId: 1,
        }));
        await tx.partner.createMany({ data: dataToInsert });
      }

      if (featuredStartups) {
        await tx.featuredStartup.deleteMany({ where: { landingPageId: 1 } });
        const dataToInsert = featuredStartups.map((item: any) => ({
          ...item,
          landingPageId: 1,
        }));
        await tx.featuredStartup.createMany({ data: dataToInsert });
      }

      if (fAQ) {
        await tx.fAQ.deleteMany({ where: { landingPageId: 1 } });
        const dataToInsert = fAQ.map((item: any) => ({
          ...item,
          landingPageId: 1,
        }));
        await tx.fAQ.createMany({ data: dataToInsert });
      }

      if (programs) {
        await tx.program.deleteMany({ where: { landingPageId: 1 } });
        const dataToInsert = programs.map((item: any) => ({
          ...item,
          landingPageId: 1,
        }));
        await tx.program.createMany({ data: dataToInsert });
      }

      if (news) {
        await tx.news.deleteMany({ where: { landingPageId: 1 } });
        const dataToInsert = news.map((item: any) => ({
          ...item,
          landingPageId: 1,
        }));
        await tx.news.createMany({ data: dataToInsert });
      }

      if (visionAndMission) {
        await tx.visionAndMission.deleteMany({ where: { landingPageId: 1 } });
        const dataToInsert = visionAndMission.map((item: any) => ({
          ...item,
          landingPageId: 1,
        }));
        await tx.visionAndMission.createMany({ data: dataToInsert });
      }

      if (footer) {
        await tx.footer.deleteMany({ where: { landingPageId: 1 } });
        await tx.footer.create({
          data: { ...footer, landingPageId: 1 },
        });
      }
    });

    // Return the updated landing page data
    return await GET();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
