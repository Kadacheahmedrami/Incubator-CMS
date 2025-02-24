// app/api/main/landing/footer/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

function parseFooterId(id: string): number | null {
  const parsed = Number(id);
  return isNaN(parsed) ? null : parsed;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const footerId = parseFooterId(params.id);
  if (footerId === null) {
    return NextResponse.json({ error: 'Invalid footer id' }, { status: 400 });
  }

  try {
    const footer = await prisma.footer.findUnique({ where: { id: footerId } });
    if (!footer) {
      return NextResponse.json({ error: 'Footer not found' }, { status: 404 });
    }
    return NextResponse.json(footer);
  } catch (error) {
    console.error('GET footer error:', error);
    return NextResponse.json({ error: 'Failed to fetch footer' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const footerId = parseFooterId(params.id);
  if (footerId === null) {
    return NextResponse.json({ error: 'Invalid footer id' }, { status: 400 });
  }
  
  try {
    const data = await request.json();
    if (
      typeof data.content !== 'string' ||
      typeof data.landingPageId !== 'number'
    ) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
    }
    const updatedFooter = await prisma.footer.update({
      where: { id: footerId },
      data,
    });
    return NextResponse.json(updatedFooter);
  } catch (error) {
    console.error('PUT footer error:', error);
    return NextResponse.json({ error: 'Failed to update footer' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const footerId = parseFooterId(params.id);
  if (footerId === null) {
    return NextResponse.json({ error: 'Invalid footer id' }, { status: 400 });
  }
  
  try {
    const footer = await prisma.footer.findUnique({ where: { id: footerId } });
    if (!footer) {
      return NextResponse.json({ error: 'Footer not found' }, { status: 404 });
    }
    await prisma.footer.delete({ where: { id: footerId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE footer error:', error);
    return NextResponse.json({ error: 'Failed to delete footer' }, { status: 500 });
  }
}
