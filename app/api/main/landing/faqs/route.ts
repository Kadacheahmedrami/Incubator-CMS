import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(faqs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newFAQ = await prisma.fAQ.create({
      data: {
        question: data.question,
        answer: data.answer,
        order: data.order,
        landingPageId: data.landingPageId,
      },
    });
    return NextResponse.json(newFAQ, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}
