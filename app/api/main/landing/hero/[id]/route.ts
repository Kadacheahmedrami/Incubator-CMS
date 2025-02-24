// app/api/main/landing/hero/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

function parseHeroId(id: string): number | null {
  const parsed = Number(id);
  return isNaN(parsed) ? null : parsed;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const heroId = parseHeroId(params.id);
  if (heroId === null) {
    return NextResponse.json({ error: 'Invalid hero id' }, { status: 400 });
  }

  try {
    const hero = await prisma.hero.findUnique({ where: { id: heroId } });
    if (!hero) {
      return NextResponse.json({ error: 'Hero not found' }, { status: 404 });
    }
    return NextResponse.json(hero);
  } catch (error) {
    console.error('GET hero error:', error);
    return NextResponse.json({ error: 'Failed to fetch hero section' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const heroId = parseHeroId(params.id);
  if (heroId === null) {
    return NextResponse.json({ error: 'Invalid hero id' }, { status: 400 });
  }

  try {
    const data = await request.json();
    // Basic field validations
    if (
      typeof data.landingImage !== 'string' ||
      typeof data.title !== 'string' ||
      typeof data.description !== 'string' ||
      typeof data.landingPageId !== 'number'
    ) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
    }

    const updatedHero = await prisma.hero.update({
      where: { id: heroId },
      data: {
        landingImage: data.landingImage,
        title: data.title,
        description: data.description,
        landingPageId: data.landingPageId,
      },
    });
    return NextResponse.json(updatedHero);
  } catch (error) {
    console.error('PUT hero error:', error);
    return NextResponse.json({ error: 'Failed to update hero section' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const heroId = parseHeroId(params.id);
  if (heroId === null) {
    return NextResponse.json({ error: 'Invalid hero id' }, { status: 400 });
  }

  try {
    const hero = await prisma.hero.findUnique({ where: { id: heroId } });
    if (!hero) {
      return NextResponse.json({ error: 'Hero not found' }, { status: 404 });
    }
    await prisma.hero.delete({ where: { id: heroId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE hero error:', error);
    return NextResponse.json({ error: 'Failed to delete hero section' }, { status: 500 });
  }
}
