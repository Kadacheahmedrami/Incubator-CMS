// app/api/main/landing/footer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const footer = await prisma.footer.findFirst();
    return NextResponse.json(footer);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching footer';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const newFooter = await prisma.footer.create({ data: payload });
    return NextResponse.json(newFooter);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating footer';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.json();
    await prisma.$transaction(async (tx) => {
      await tx.footer.deleteMany();
      await tx.footer.create({ data: payload });
    });
    return NextResponse.json({ message: 'Footer updated' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating footer';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
