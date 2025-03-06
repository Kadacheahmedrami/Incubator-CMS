import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const featuredEvents = await prisma.featuredEvent.findMany({
      include: {
        landingPage: true,
        event: true,
      },
    });
    return NextResponse.json(featuredEvents);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching featured events';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { landingPageId, eventId, order } = data;

    if (!landingPageId || !eventId) {
      return NextResponse.json(
        { error: 'landingPageId and eventId are required' },
        { status: 400 }
      );
    }

    const landingPage = await prisma.landingPage.findUnique({
      where: { id: landingPageId },
    });
    if (!landingPage) {
      return NextResponse.json({ error: 'Landing page not found' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 400 });
    }

    const featured = await prisma.featuredEvent.create({
      data: {
        landingPageId,
        eventId,
        order: order || 0,
      },
      include: {
        landingPage: true,
        event: true,
      },
    });

    return NextResponse.json(featured);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating featured event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
