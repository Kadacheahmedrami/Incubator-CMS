// app/api/main/startups/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

function parseStartupId(id: string): number | null {
  const parsed = Number(id);
  return isNaN(parsed) ? null : parsed;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startupId = parseStartupId(params.id);
  if (startupId === null) {
    return NextResponse.json({ error: 'Invalid startup id' }, { status: 400 });
  }
  try {
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      include: {
        mentors: { include: { mentor: true } },
        founders: { include: { founder: true } }
      },
    });
    if (!startup) {
      return NextResponse.json({ error: 'Startup not found' }, { status: 404 });
    }
    return NextResponse.json(startup);
  } catch (error) {
    console.error('GET startup error:', error);
    return NextResponse.json({ error: 'Failed to fetch startup' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startupId = parseStartupId(params.id);
  if (startupId === null) {
    return NextResponse.json({ error: 'Invalid startup id' }, { status: 400 });
  }
  try {
    const data = await request.json();
    const updated = await prisma.startup.update({
      where: { id: startupId },
      data,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT startup error:', error);
    return NextResponse.json({ error: 'Failed to update startup' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startupId = parseStartupId(params.id);
  if (startupId === null) {
    return NextResponse.json({ error: 'Invalid startup id' }, { status: 400 });
  }
  try {
    await prisma.startup.delete({ where: { id: startupId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE startup error:', error);
    return NextResponse.json({ error: 'Failed to delete startup' }, { status: 500 });
  }
}
