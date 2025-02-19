import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(programs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newProgram = await prisma.program.create({
      data: {
        title: data.title,
        landingImage: data.landingImage,
        description: data.description,
        order: data.order,
        landingPageId: data.landingPageId,
      },
    });
    return NextResponse.json(newProgram, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create program' },
      { status: 500 }
    );
  }
}
