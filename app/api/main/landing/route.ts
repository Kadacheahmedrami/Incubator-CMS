// app/api/landing-page/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    // Retrieve all sections from the database
    const heroSections = await prisma.hero.findMany({
      orderBy: { id: 'asc' }, // Adjust ordering as needed
    });
    const historyAndValues = await prisma.historyAndValues.findMany({
      orderBy: { order: 'asc' },
    });
    const events = await prisma.event.findMany({
      orderBy: { order: 'asc' },
    });
    const partners = await prisma.partner.findMany();
    const featuredStartups = await prisma.featuredStartup.findMany({
      include: { startup: true },
      orderBy: { order: 'asc' },
    });
    const faqs = await prisma.fAQ.findMany({
      orderBy: { order: 'asc' },
    });
    const programs = await prisma.program.findMany({
      orderBy: { order: 'asc' },
    });
    const news = await prisma.news.findMany({
      orderBy: { order: 'asc' },
    });
    const visionAndMission = await prisma.visionAndMission.findMany({
      orderBy: { order: 'asc' },
    });
    const footer = await prisma.footer.findFirst();

    // Aggregate the landing page data
    const landingPageData = {
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
    };

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

    // Return the updated landing page data after the update
    return await GET();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
