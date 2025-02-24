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
    const startup = await prisma.startup.create({ data });
    return NextResponse.json(startup);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating startup';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
