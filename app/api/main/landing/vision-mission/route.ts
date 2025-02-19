import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const visionMissions = await prisma.visionAndMission.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(visionMissions);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch vision and mission' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newVisionMission = await prisma.visionAndMission.create({
      data: {
        vision: data.vision,
        mission: data.mission,
        order: data.order,
        landingPageId: data.landingPageId,
      },
    });
    return NextResponse.json(newVisionMission, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create vision and mission section' },
      { status: 500 }
    );
  }
}
