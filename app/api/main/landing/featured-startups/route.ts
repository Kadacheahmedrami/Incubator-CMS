import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const startups = await prisma.featuredStartup.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(startups);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch featured startups' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newFeaturedStartup = await prisma.featuredStartup.create({
      data: {
        startupId: data.startupId,
        order: data.order,
        landingPageId: data.landingPageId,
      },
    });
    return NextResponse.json(newFeaturedStartup, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create featured startup' },
      { status: 500 }
    );
  }
}
