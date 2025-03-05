import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

function parseId(id: string): number | null {
  const parsed = Number(id);
  return isNaN(parsed) ? null : parsed;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const historyId = parseId(params.id);
  if (historyId === null) {
    return NextResponse.json({ error: 'Invalid HistoryAndValues id' }, { status: 400 });
  }
  try {
    const history = await prisma.historyAndValues.findUnique({
      where: { id: historyId },
      // Optionally include featured join records if needed:
      // include: { FeaturedHistoryAndValues: true },
    });
    if (!history) {
      return NextResponse.json({ error: 'HistoryAndValues entry not found' }, { status: 404 });
    }
    return NextResponse.json(history);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching HistoryAndValues entry';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const historyId = parseId(params.id);
  if (historyId === null) {
    return NextResponse.json({ error: 'Invalid HistoryAndValues id' }, { status: 400 });
  }
  try {
    const data = await request.json();
    const { title, landingImage, description } = data;
    // Optionally, add validations for updated fields if needed.
    const updatedHistory = await prisma.historyAndValues.update({
      where: { id: historyId },
      data: { title, landingImage, description },
    });
    return NextResponse.json(updatedHistory);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating HistoryAndValues entry';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const historyId = parseId(params.id);
  if (historyId === null) {
    return NextResponse.json({ error: 'Invalid HistoryAndValues id' }, { status: 400 });
  }
  try {
    await prisma.historyAndValues.delete({ where: { id: historyId } });
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error deleting HistoryAndValues entry';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
