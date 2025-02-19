import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hero = await prisma.hero.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!hero) {
      return NextResponse.json({ error: 'Hero not found' }, { status: 404 });
    }
    return NextResponse.json(hero);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch hero section' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const updatedHero = await prisma.hero.update({
      where: { id: parseInt(params.id) },
      data: {
        landingImage: data.landingImage,
        title: data.title,
        description: data.description,
        landingPageId: data.landingPageId,
      },
    });
    return NextResponse.json(updatedHero);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update hero section' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.hero.delete({
      where: { id: parseInt(params.id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete hero section' },
      { status: 500 }
    );
  }
}
