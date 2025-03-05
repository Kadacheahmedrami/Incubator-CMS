// app/api/main/startups/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const startups = await prisma.startup.findMany({
      orderBy: { createdAt: 'desc' },
      include: { 
        mentors: { include: { mentor: true } },
        founders: { include: { founder: true } }
      },
    });
    return NextResponse.json(startups);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching startups';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    const { name, idea, founderId, imageUrl } = data;
    if (!name || !idea || !founderId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, idea and founderId' },
        { status: 400 }
      );
    }

    // Check that the founder exists and that their role is USER
    const user = await prisma.user.findUnique({
      where: { id: founderId },
    });
    if (!user || user.role !== 'USER') {
      return NextResponse.json(
        { error: 'Founder must exist and have role USER' },
        { status: 400 }
      );
    }

    // Create the startup with nested founder creation
    const startup = await prisma.startup.create({
      data: {
        name,
        idea,
        imageUrl: imageUrl || null,
        founders: {
          create: {
            founder: {
              connect: { id: founderId },
            },
          },
        },
      },
      include: {
        founders: true, // Include the founders relation in the response
      },
    });

    return NextResponse.json(startup);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Error creating startup';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}