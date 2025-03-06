import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const featured = await prisma.featuredEvent.findUnique({
      where: { id: Number(params.id) },
      include: {
        landingPage: true,
        event: true,
      },
    });

    if (!featured) {
      return NextResponse.json({ error: 'Featured event not found' }, { status: 404 });
    }

    return NextResponse.json(featured);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching featured event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { order } = data;

    const updated = await prisma.featuredEvent.update({
      where: { id: Number(params.id) },
      data: { order },
      include: {
        landingPage: true,
        event: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating featured event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.featuredEvent.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ message: 'Featured event deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error deleting featured event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
