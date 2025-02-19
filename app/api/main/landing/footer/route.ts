import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const footers = await prisma.footer.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(footers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch footer sections' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newFooter = await prisma.footer.create({
      data: {
        content: data.content,
        landingPageId: data.landingPageId,
      },
    });
    return NextResponse.json(newFooter, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create footer section' },
      { status: 500 }
    );
  }
}
