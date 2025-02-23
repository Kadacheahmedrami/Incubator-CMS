// app/api/main/landing/partners/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(partners);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Received data:', data);

    // Check for existing landing pages
    const existingLandingPages = await prisma.landingPage.findMany();
    console.log('Existing landing pages:', existingLandingPages);

    let targetLandingPageId: number;

    // Create a default landing page if none exist
    if (existingLandingPages.length === 0) {
      console.log('No landing pages found, creating default...');
      try {
        const defaultLandingPage = await prisma.landingPage.create({
          data: {} // Using an empty object as relations are optional
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
      // Use the first existing landing page
      targetLandingPageId = existingLandingPages[0].id;
      console.log('Using existing landing page ID:', targetLandingPageId);
    }

    // Create the new partner with the determined landing page ID
    console.log('Creating partner with landing page ID:', targetLandingPageId);
    const newPartner = await prisma.partner.create({
      data: {
        name: data.name || '',
        logo: data.logo || '',
        url: data.url || '',
        landingPageId: targetLandingPageId,
      },
      include: {
        landingPage: true,
      }
    });

    console.log('Successfully created partner:', newPartner);
    return NextResponse.json(newPartner, { status: 201 });

  } catch (error) {
    console.error('Detailed error:', error);

    // Handle specific Prisma errors if applicable
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
      { error: 'Failed to create partner: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
