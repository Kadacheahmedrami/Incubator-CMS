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
    console.log('Received hero data:', data);

    // Check if any landing pages exist
    const existingLandingPages = await prisma.landingPage.findMany();
    let targetLandingPageId: number;

    if (existingLandingPages.length === 0) {
      console.log('No landing pages found, creating default landing page...');
      try {
        const defaultLandingPage = await prisma.landingPage.create({
          data: {} // Adjust this object based on required fields
        });
        console.log('Created default landing page:', defaultLandingPage);
        targetLandingPageId = defaultLandingPage.id;
      } catch (createError) {
        console.error('Error creating default landing page:', createError);
        return NextResponse.json(
          { error: 'Failed to create default landing page' },
          { status: 500 }
        );
      }
    } else {
      targetLandingPageId = existingLandingPages[0].id;
      console.log('Using existing landing page ID:', targetLandingPageId);
    }

    // Create the hero section using the target landing page ID
    const newHero = await prisma.hero.create({
      data: {
        landingImage: data.landingImage || '',
        title: data.title || '',
        description: data.description || '',
        landingPageId: targetLandingPageId,
      },
    });

    console.log('Successfully created hero section:', newHero);
    return NextResponse.json(newHero, { status: 201 });
  } catch (error) {
    console.error('Error creating hero section:', error);
    return NextResponse.json(
      { error: 'Failed to create hero section' },
      { status: 500 }
    );
  }
}