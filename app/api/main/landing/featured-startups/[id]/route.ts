// app/api/main/landing/featured-startups/[id]/route.ts
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
  const fsId = parseFeaturedStartupId(params.id);
  if (fsId === null) {
    return NextResponse.json({ error: 'Invalid featured startup id' }, { status: 400 });
  }

  try {
    const featuredStartup = await prisma.featuredStartup.findUnique({
      where: { id: fsId },
      include: { startup: true },
    });
    if (!featuredStartup) {
      return NextResponse.json({ error: 'Featured startup not found' }, { status: 404 });
    }
    return NextResponse.json(featuredStartup);
  } catch (error) {
    console.error('GET featured startup error:', error);
    return NextResponse.json({ error: 'Failed to fetch featured startup' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const fsId = parseFeaturedStartupId(params.id);
  if (fsId === null) {
    return NextResponse.json({ error: 'Invalid featured startup id' }, { status: 400 });
  }
  
  try {
    const data = await request.json();
    if (
      typeof data.startupId !== 'number' ||
      typeof data.landingPageId !== 'number' ||
      typeof data.order !== 'number'
    ) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
    }
    const updatedFS = await prisma.featuredStartup.update({
      where: { id: fsId },
      data,
    });
    return NextResponse.json(updatedFS);
  } catch (error) {
    console.error('PUT featured startup error:', error);
    return NextResponse.json({ error: 'Failed to update featured startup' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const fsId = parseFeaturedStartupId(params.id);
  if (fsId === null) {
    return NextResponse.json({ error: 'Invalid featured startup id' }, { status: 400 });
  }
  
  try {
    const record = await prisma.featuredStartup.findUnique({ where: { id: fsId } });
    if (!record) {
      return NextResponse.json({ error: 'Featured startup not found' }, { status: 404 });
    }
    await prisma.featuredStartup.delete({ where: { id: fsId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE featured startup error:', error);
    return NextResponse.json({ error: 'Failed to delete featured startup' }, { status: 500 });
  }
}
