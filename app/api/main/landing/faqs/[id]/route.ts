// app/api/main/landing/faqs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

function parseFAQId(id: string): number | null {
  const parsed = Number(id);
  return isNaN(parsed) ? null : parsed;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const faqId = parseFAQId(params.id);
  if (faqId === null) {
    return NextResponse.json({ error: 'Invalid FAQ id' }, { status: 400 });
  }

  try {
    const faq = await prisma.fAQ.findUnique({ where: { id: faqId } });
    if (!faq) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }
    return NextResponse.json(faq);
  } catch (error) {
    console.error('GET FAQ error:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQ' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const faqId = parseFAQId(params.id);
  if (faqId === null) {
    return NextResponse.json({ error: 'Invalid FAQ id' }, { status: 400 });
  }
  
  try {
    const data = await request.json();
    if (
      typeof data.question !== 'string' ||
      typeof data.answer !== 'string' ||
      typeof data.order !== 'number'
    ) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
    }
    const updatedFAQ = await prisma.fAQ.update({
      where: { id: faqId },
      data,
    });
    return NextResponse.json(updatedFAQ);
  } catch (error) {
    console.error('PUT FAQ error:', error);
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const faqId = parseFAQId(params.id);
  if (faqId === null) {
    return NextResponse.json({ error: 'Invalid FAQ id' }, { status: 400 });
  }
  
  try {
    const faq = await prisma.fAQ.findUnique({ where: { id: faqId } });
    if (!faq) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }
    await prisma.fAQ.delete({ where: { id: faqId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE FAQ error:', error);
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
  }
}
