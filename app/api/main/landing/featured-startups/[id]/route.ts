import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const featuredStartup = await prisma.featuredStartup.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!featuredStartup) {
      return NextResponse.json(
        { error: 'Featured startup not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(featuredStartup);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch featured startup' },
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
    const updatedFeaturedStartup = await prisma.featuredStartup.update({
      where: { id: parseInt(params.id) },
      data: {
        startupId: data.startupId,
        order: data.order,
        landingPageId: data.landingPageId,
      },
    });
    return NextResponse.json(updatedFeaturedStartup);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update featured startup' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.featuredStartup.delete({
      where: { id: parseInt(params.id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete featured startup' },
      { status: 500 }
    );
  }
}
