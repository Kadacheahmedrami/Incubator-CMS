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
    const { name, idea, founderIds, imageUrl } = data;

    // Validate required fields: name, idea and at least one founder in founderIds
    if (!name || !idea || !founderIds || !Array.isArray(founderIds) || founderIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: name, idea and at least one founder' },
        { status: 400 }
      );
    }

    // Validate each founderId corresponds to a user with role 'USER'
    for (const founderId of founderIds) {
      const user = await prisma.user.findUnique({ where: { id: founderId } });
      if (!user || user.role !== 'USER') {
        return NextResponse.json(
          { error: 'Each founder must exist and have role USER' },
          { status: 400 }
        );
      }
    }

    // Create the startup and create nested founder relations using the provided founderIds
    const startup = await prisma.startup.create({
      data: {
        name,
        idea,
        imageUrl: imageUrl || null,
        founders: {
          create: founderIds.map((id: string) => ({
            founder: {
              connect: { id },
            },
          })),
        },
      },
      include: {
        founders: true,
      },
    });

    return NextResponse.json(startup);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating startup';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
