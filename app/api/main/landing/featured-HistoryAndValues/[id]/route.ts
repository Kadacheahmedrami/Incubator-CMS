import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

function parseFeaturedHistoryId(id: string): number | null {
  const parsed = Number(id);
  return isNaN(parsed) ? null : parsed;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const featuredId = parseFeaturedHistoryId(params.id);
  if (featuredId === null) {
    return NextResponse.json({ error: 'Invalid featured HistoryAndValues id' }, { status: 400 });
  }
  try {
    const featured = await prisma.featuredHistoryAndValues.findUnique({
      where: { id: featuredId },
      include: {
        landingPage: true,
        historyAndValues: true,
      },
    });
    if (!featured) {
      return NextResponse.json({ error: 'Featured HistoryAndValues not found' }, { status: 404 });
    }
    return NextResponse.json(featured);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Error fetching featured HistoryAndValues';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const featuredId = parseFeaturedHistoryId(params.id);
  if (featuredId === null) {
    return NextResponse.json({ error: 'Invalid featured HistoryAndValues id' }, { status: 400 });
  }
  try {
    const data = await request.json();

    // Optionally validate new landingPageId or historyAndValuesId if provided
    if (data.landingPageId) {
      const landingPage = await prisma.landingPage.findUnique({
        where: { id: data.landingPageId },
      });
      if (!landingPage) {
        return NextResponse.json({ error: 'Landing page not found' }, { status: 400 });
      }
    }
    if (data.historyAndValuesId) {
      const historyEntry = await prisma.historyAndValues.findUnique({
        where: { id: data.historyAndValuesId },
      });
      if (!historyEntry) {
        return NextResponse.json(
          { error: 'HistoryAndValues entry not found' },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.featuredHistoryAndValues.update({
      where: { id: featuredId },
      data,
      include: {
        landingPage: true,
        historyAndValues: true,
      },
    });
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Error updating featured HistoryAndValues';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const featuredId = parseFeaturedHistoryId(params.id);
  if (featuredId === null) {
    return NextResponse.json({ error: 'Invalid featured HistoryAndValues id' }, { status: 400 });
  }
  try {
    await prisma.featuredHistoryAndValues.delete({ where: { id: featuredId } });
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Error deleting featured HistoryAndValues';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
