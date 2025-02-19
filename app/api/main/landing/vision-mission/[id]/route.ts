import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const visionMissionItem = await prisma.visionAndMission.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!visionMissionItem) {
      return NextResponse.json(
        { error: 'Vision and Mission section not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(visionMissionItem);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch vision and mission section' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const updatedVisionMission = await prisma.visionAndMission.update({
      where: { id: parseInt(params.id) },
      data: {
        vision: data.vision,
        mission: data.mission,
        order: data.order,
        landingPageId: data.landingPageId,
      },
    });
    return NextResponse.json(updatedVisionMission);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update vision and mission section' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.visionAndMission.delete({
      where: { id: parseInt(params.id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete vision and mission section' },
      { status: 500 }
    );
  }
}
