// app/api/landing-page/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

/**
 * GET handler
 * Returns the landing page record.
 */
export async function GET() {
  try {
    const landingPage = await prisma.landingPage.findFirst();

    if (!landingPage) {
      return NextResponse.json(
        { error: 'Landing page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(landingPage);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT handler
 * Updates (or creates) the landing page with new data.
 *
 * Expects a JSON body with:
 * - title: string
 * - landingImage: string (a URL or path)
 * - description: string
 */
export async function PUT(request: NextRequest) {
  try {
    const { title, landingImage, description } = await request.json();

    if (!title || !landingImage || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: title, landingImage, and description are required.' },
        { status: 400 }
      );
    }

    let landingPage = await prisma.landingPage.findFirst();

    if (landingPage) {
      landingPage = await prisma.landingPage.update({
        where: { id: landingPage.id },
        data: { title, landingImage, description },
      });
    } else {
      landingPage = await prisma.landingPage.create({
        data: { title, landingImage, description },
      });
    }

    return NextResponse.json(landingPage);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
