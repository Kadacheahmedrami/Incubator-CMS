import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const featuredHistory = await prisma.featuredHistoryAndValues.findMany({
      include: {
        landingPage: true,
        historyAndValues: true,
      },
    });
    return NextResponse.json(featuredHistory);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Error fetching featured HistoryAndValues';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { landingPageId, historyAndValuesId, order } = data;

    // Validate required fields
    if (!landingPageId || !historyAndValuesId) {
      return NextResponse.json(
        { error: 'landingPageId and historyAndValuesId are required' },
        { status: 400 }
      );
    }

    // Check that the landing page exists
    const landingPage = await prisma.landingPage.findUnique({
      where: { id: landingPageId },
    });
    if (!landingPage) {
      return NextResponse.json({ error: 'Landing page not found' }, { status: 400 });
    }

    // Check that the HistoryAndValues entry exists
    const historyEntry = await prisma.historyAndValues.findUnique({
      where: { id: historyAndValuesId },
    });
    if (!historyEntry) {
      return NextResponse.json(
        { error: 'HistoryAndValues entry not found' },
        { status: 400 }
      );
    }

    const featured = await prisma.featuredHistoryAndValues.create({
      data: {
        landingPageId,
        historyAndValuesId,
        order: order || 0,
      },
      include: {
        landingPage: true,
        historyAndValues: true,
      },
    });

    return NextResponse.json(featured);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Error creating featured HistoryAndValues';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
