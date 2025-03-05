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
  // Await the request body first
  const data = await request.json();

  // Parse the startup id
  const startupId = parseStartupId(params.id);
  if (startupId === null) {
    return NextResponse.json({ error: 'Invalid startup id' }, { status: 400 });
  }

  // First, ensure that the startup has at least one founder with role 'USER'
  const existingStartup = await prisma.startup.findUnique({
    where: { id: startupId },
    include: { founders: { include: { founder: true } } },
  });

  if (!existingStartup || existingStartup.founders.length === 0) {
    return NextResponse.json(
      { error: 'Each startup must have at least one founder' },
      { status: 400 }
    );
  }

  // Check if at least one of the founders has role "USER"
  const hasUserFounder = existingStartup.founders.some(
    (f) => f.founder.role === 'USER'
  );
  if (!hasUserFounder) {
    return NextResponse.json(
      { error: 'Each startup must have at least one founder with role USER' },
      { status: 400 }
    );
  }

  // Exclude nested relations that you do not intend to update directly
  const { mentors, founders, ...updateData } = data;

  try {
    const updated = await prisma.startup.update({
      where: { id: startupId },
      data: updateData,
    });
    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error('PUT startup error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to update startup';
    return NextResponse.json({ error: message }, { status: 500 });
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
