// app/api/main/landing/featured-startups/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const featuredStartups = await prisma.featuredStartup.findMany({
      orderBy: { order: 'asc' },
      include: { startup: true },
    });
    return NextResponse.json(featuredStartups);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching featured startups';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.json();
    await prisma.$transaction(async (tx) => {
      await tx.featuredStartup.deleteMany();
      await tx.featuredStartup.createMany({ data: payload });
    });
    return NextResponse.json({ message: 'Featured startups updated' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating featured startups';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
