import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const historyAndValue = await prisma.historyAndValues.findUnique({
      where: { id: Number(params.id) },
    });
    
    if (!historyAndValue) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(historyAndValue);
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Error fetching entry' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const updated = await prisma.historyAndValues.update({
      where: { id: Number(params.id) },
      data,
    });
    return NextResponse.json(updated);
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Error updating entry' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.historyAndValues.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Error deleting entry' }, { status: 500 });
  }
}
