// app/api/main/landing/vision-mission/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

function parseVisionMissionId(id: string): number | null {
  const parsed = Number(id);
  return isNaN(parsed) ? null : parsed;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const vmId = parseVisionMissionId(params.id);
  if (vmId === null) {
    return NextResponse.json({ error: 'Invalid vision & mission id' }, { status: 400 });
  }

  try {
    const record = await prisma.visionAndMission.findUnique({ where: { id: vmId } });
    if (!record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error('GET vision & mission error:', error);
    return NextResponse.json({ error: 'Failed to fetch record' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const vmId = parseVisionMissionId(params.id);
  if (vmId === null) {
    return NextResponse.json({ error: 'Invalid vision & mission id' }, { status: 400 });
  }
  
  try {
    const data = await request.json();
    if (
      typeof data.vision !== 'string' ||
      typeof data.mission !== 'string' ||
      typeof data.order !== 'number'
    ) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
    }
    const updatedRecord = await prisma.visionAndMission.update({
      where: { id: vmId },
      data,
    });
    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error('PUT vision & mission error:', error);
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const vmId = parseVisionMissionId(params.id);
  if (vmId === null) {
    return NextResponse.json({ error: 'Invalid vision & mission id' }, { status: 400 });
  }
  
  try {
    const record = await prisma.visionAndMission.findUnique({ where: { id: vmId } });
    if (!record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
    await prisma.visionAndMission.delete({ where: { id: vmId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE vision & mission error:', error);
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}
