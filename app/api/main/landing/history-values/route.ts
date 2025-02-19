import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const historyValues = await prisma.historyAndValues.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(historyValues);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch history and values' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newHistoryValue = await prisma.historyAndValues.create({
      data: {
        title: data.title,
        landingImage: data.landingImage,
        description: data.description,
        order: data.order,
        landingPageId: data.landingPageId,
      },
    });
    return NextResponse.json(newHistoryValue, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create history and values section' },
      { status: 500 }
    );
  }
}
