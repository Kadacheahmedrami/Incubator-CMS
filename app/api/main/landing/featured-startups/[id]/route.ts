import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

function parseFeaturedStartupId(id: string): number | null {
  const parsed = Number(id);
  return isNaN(parsed) ? null : parsed;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const featuredId = parseFeaturedStartupId(params.id);
  if (featuredId === null) {
    return NextResponse.json({ error: 'Invalid featured startup id' }, { status: 400 });
  }
  try {
    const featuredStartup = await prisma.featuredStartup.findUnique({
      where: { id: featuredId },
      include: { startup: true, landingPage: true },
    });
    if (!featuredStartup) {
      return NextResponse.json({ error: 'Featured startup not found' }, { status: 404 });
    }
    return NextResponse.json(featuredStartup);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch featured startup';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const featuredId = parseFeaturedStartupId(params.id);
  if (featuredId === null) {
    return NextResponse.json({ error: 'Invalid featured startup id' }, { status: 400 });
  }
  try {
    const data = await request.json();
    const { landingPageId, startupId, order } = data;

    // Optional: Validate that the provided landingPageId and startupId exist
    if (landingPageId) {
      const landingPage = await prisma.landingPage.findUnique({ where: { id: landingPageId } });
      if (!landingPage) {
        return NextResponse.json({ error: 'Landing page not found' }, { status: 400 });
      }
    }
    if (startupId) {
      const startup = await prisma.startup.findUnique({ where: { id: startupId } });
      if (!startup) {
        return NextResponse.json({ error: 'Startup not found' }, { status: 400 });
      }
    }

    const updatedFeatured = await prisma.featuredStartup.update({
      where: { id: featuredId },
      data: { landingPageId, startupId, order },
      include: { startup: true, landingPage: true },
    });
    return NextResponse.json(updatedFeatured);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update featured startup';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const featuredId = parseFeaturedStartupId(params.id);
  if (featuredId === null) {
    return NextResponse.json({ error: 'Invalid featured startup id' }, { status: 400 });
  }
  try {
    await prisma.featuredStartup.delete({ where: { id: featuredId } });
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete featured startup';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
