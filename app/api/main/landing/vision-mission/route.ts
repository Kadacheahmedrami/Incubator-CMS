// app/api/main/landing/vision-mission/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const data = await prisma.visionAndMission.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching vision & mission';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const newRecord = await prisma.visionAndMission.create({ data: payload });
    return NextResponse.json(newRecord);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating vision & mission record';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.json();
    await prisma.$transaction(async (tx) => {
      await tx.visionAndMission.deleteMany();
      await tx.visionAndMission.createMany({ data: payload });
    });
    return NextResponse.json({ message: 'Vision & mission updated' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating vision & mission';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
