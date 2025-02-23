import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET(request: NextRequest) {
  try {
    const startups = await prisma.startup.findMany({
      include: {
        featuredIn: true
      }
    });
    return NextResponse.json(startups);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch startups' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const startup = await prisma.startup.create({
      data: {
        name: data.name,
        description: data.description
      }
    });
    
    return NextResponse.json(startup, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create startup' },
      { status: 500 }
    );
  }
}
