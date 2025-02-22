import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newEvent = await prisma.event.create({
      data: {
        title: data.title,
        landingImage: data.landingImage,
        description: data.description,
        order: data.order,
        landingPageId: data.landingPageId,
      },
    });
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
