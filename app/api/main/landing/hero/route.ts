import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const heroSections = await prisma.hero.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(heroSections);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to fetch hero sections' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newHero = await prisma.hero.create({
      data: {
        landingImage: data.landingImage,
        title: data.title,
        description: data.description,
        landingPageId: data.landingPageId,
      },
    });
    return NextResponse.json(newHero, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to create hero section' },
      { status: 500 }
    );
  }
}
