// app/api/main/landing/partners/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const partners = await prisma.partner.findMany();
    return NextResponse.json(partners);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching partners';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const newPartner = await prisma.partner.create({
      data: payload,
    });
    return NextResponse.json(newPartner);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating partner';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.json();
    await prisma.$transaction(async (tx) => {
      await tx.partner.deleteMany();
      await tx.partner.createMany({ data: payload });
    });
    return NextResponse.json({ message: 'Partners updated' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating partners';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
