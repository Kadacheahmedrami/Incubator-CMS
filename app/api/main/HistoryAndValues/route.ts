import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const histories = await prisma.historyAndValues.findMany();
    return NextResponse.json(histories);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching HistoryAndValues entries';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { title, landingImage, description } = data;

    // Validate required fields
    if (!title || !landingImage || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: title, landingImage, and description' },
        { status: 400 }
      );
    }

    const newHistory = await prisma.historyAndValues.create({
      data: { title, landingImage, description },
    });

    return NextResponse.json(newHistory);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating HistoryAndValues entry';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
