import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const featuredPrograms = await prisma.featuredProgram.findMany({
      include: {
        landingPage: true,
        program: true,
      },
    });
    return NextResponse.json(featuredPrograms);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching featured programs';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { landingPageId, programId, order } = data;

    if (!landingPageId || !programId) {
      return NextResponse.json(
        { error: 'landingPageId and programId are required' },
        { status: 400 }
      );
    }

    const landingPage = await prisma.landingPage.findUnique({
      where: { id: landingPageId },
    });
    if (!landingPage) {
      return NextResponse.json({ error: 'Landing page not found' }, { status: 400 });
    }

    const program = await prisma.program.findUnique({
      where: { id: programId },
    });
    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 400 });
    }

    const featured = await prisma.featuredProgram.create({
      data: {
        landingPageId,
        programId,
        order: order || 0,
      },
      include: {
        landingPage: true,
        program: true,
      },
    });

    return NextResponse.json(featured);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating featured program';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
