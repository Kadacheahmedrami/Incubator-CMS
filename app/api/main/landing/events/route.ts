  import { NextRequest, NextResponse } from 'next/server';
  import { prisma } from '@/prisma/prismaClient';
  import { Prisma } from '@prisma/client';

  export async function GET() {
    try {
      const events = await prisma.event.findMany({
        orderBy: { order: 'asc' },
        include: {
          landingPage: true
        }
      });
      return NextResponse.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
  }

  export async function POST(request: NextRequest) {
    try {
      const data = await request.json();
      console.log('Received data:', data); // Debug log

      // Check existing landing pages
      const existingLandingPages = await prisma.landingPage.findMany();
      console.log('Existing landing pages:', existingLandingPages); // Debug log

      let targetLandingPageId: number;

      // If there are no landing pages, create one
      if (existingLandingPages.length === 0) {
        console.log('No landing pages found, creating default...'); // Debug log
        try {
          const defaultLandingPage = await prisma.landingPage.create({
            data: {} // Empty object as all relations are optional
          });
          console.log('Created default landing page:', defaultLandingPage); // Debug log
          targetLandingPageId = defaultLandingPage.id;
        } catch (createError) {
          console.error('Error creating default landing page:', createError);
          return NextResponse.json(
            { error: 'Failed to create default landing page' },
            { status: 500 }
          );
        }
      } else {
        // Use existing landing page
        targetLandingPageId = existingLandingPages[0].id;
        console.log('Using existing landing page ID:', targetLandingPageId); // Debug log
      }

      // Create the new event
      console.log('Creating event with landing page ID:', targetLandingPageId); // Debug log
      const newEvent = await prisma.event.create({
        data: {
          title: data.title || '',
          landingImage: data.landingImage || '',
          description: data.description || '',
          order: data.order || 1,
          landingPageId: targetLandingPageId,
        },
        include: {
          landingPage: true
        }
      });

      console.log('Successfully created event:', newEvent); // Debug log
      return NextResponse.json(newEvent, { status: 201 });

    } catch (error) {
      console.error('Detailed error:', error); // Full error details
      
      // Handle Prisma-specific errors
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
        { error: 'Failed to create event: ' + (error instanceof Error ? error.message : 'Unknown error') },
        { status: 500 }
      );
    }
  }