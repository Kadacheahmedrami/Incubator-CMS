import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const featuredStartups = await prisma.featuredStartup.findMany({
      include: {
        startup: true,
        landingPage: true,
      },
    });
    return NextResponse.json(featuredStartups);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Error fetching featured startups';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { landingPageId, startupId, order } = data;

    // Validate required fields: landingPageId and startupId are mandatory
    if (!landingPageId || !startupId) {
      return NextResponse.json(
        { error: 'landingPageId and startupId are required' },
        { status: 400 }
      );
    }

    // Check that the startup exists
    const startup = await prisma.startup.findUnique({ where: { id: startupId } });
    if (!startup) {
      return NextResponse.json({ error: 'Startup not found' }, { status: 400 });
    }

    // Optionally, check that the landing page exists
    const landingPage = await prisma.landingPage.findUnique({
      where: { id: landingPageId },
    });
    if (!landingPage) {
      return NextResponse.json(
        { error: 'LandingPage not found' },
        { status: 400 }
      );
    }

    // Create the featured startup record
    const featured = await prisma.featuredStartup.create({
      data: {
        landingPageId,
        startupId,
        order: order || 0, // default order value if not provided
      },
      include: {
        startup: true,
        landingPage: true,
      },
    });

    return NextResponse.json(featured);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Error featuring startup';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
