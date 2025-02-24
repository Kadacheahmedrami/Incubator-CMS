// app/api/main/landing/faqs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(faqs);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching FAQs';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const newFaq = await prisma.fAQ.create({ data: payload });
    return NextResponse.json(newFaq);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating FAQ';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.json();
    await prisma.$transaction(async (tx) => {
      await tx.fAQ.deleteMany();
      await tx.fAQ.createMany({ data: payload });
    });
    return NextResponse.json({ message: 'FAQs updated' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating FAQs';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
