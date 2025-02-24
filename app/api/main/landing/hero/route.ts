// app/api/main/landing/hero/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const heroes = await prisma.hero.findMany({ orderBy: { id: 'asc' } });
    return NextResponse.json(heroes);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching hero sections';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const hero = await request.json();
    const newHero = await prisma.hero.create({ data: hero });
    return NextResponse.json(newHero);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating hero section';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const heroes = await request.json();
    await prisma.$transaction(async (tx) => {
      await tx.hero.deleteMany();
      await tx.hero.createMany({ data: heroes });
    });
    return NextResponse.json({ message: 'Hero sections updated' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating hero sections';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
