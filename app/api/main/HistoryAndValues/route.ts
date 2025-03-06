import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const historyAndValues = await prisma.historyAndValues.findMany();
    return NextResponse.json(historyAndValues);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Error fetching history and values' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const historyAndValue = await prisma.historyAndValues.create({ data });
    return NextResponse.json(historyAndValue);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Error creating history and value' },
      { status: 500 }
    );
  }
}
