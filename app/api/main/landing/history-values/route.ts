import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const historyValues = await prisma.historyAndValues.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(historyValues);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to fetch history and values' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Received data:', data);

    // Check existing landing pages
    const existingLandingPages = await prisma.landingPage.findMany();
    console.log('Existing landing pages:', existingLandingPages);

    let targetLandingPageId: number;

    // If there are no landing pages, create one
    if (existingLandingPages.length === 0) {
      console.log('No landing pages found, creating default...');
      try {
        const defaultLandingPage = await prisma.landingPage.create({
          data: {} // Empty object since all relations are optional
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
      // Use the existing landing page
      targetLandingPageId = existingLandingPages[0].id;
      console.log('Using existing landing page ID:', targetLandingPageId);
    }

    // Create the new history and values record with the determined landing page ID
    console.log('Creating history and values record with landing page ID:', targetLandingPageId);
    const newHistoryValue = await prisma.historyAndValues.create({
      data: {
        title: data.title || '',
        landingImage: data.landingImage || '',
        description: data.description || '',
        order: data.order || 1,
        landingPageId: targetLandingPageId,
      },
      include: {
        landingPage: true,
      }
    });

    console.log('Successfully created history and values record:', newHistoryValue);
    return NextResponse.json(newHistoryValue, { status: 201 });

  } catch (error) {
    console.error('Detailed error:', error);

    // Handle Prisma-specific errors if available
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A unique constraint violation occurred' },
          { status: 400 }
        );
      }
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: 'Foreign key constraint failed' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create history and values section: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
