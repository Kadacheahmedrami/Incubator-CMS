import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const startup = await prisma.startup.findUnique({
      where: { id: parseInt((await params).id) },
      include: {
        featuredIn: true
      }
    });
    
    if (!startup) {
      return NextResponse.json(
        { error: 'Startup not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(startup);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch startup' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const startup = await prisma.startup.update({
      where: { id: parseInt((await params).id) },
      data: {
        name: data.name,
        description: data.description
      }
    });
    
    return NextResponse.json(startup);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to update startup' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // First delete any featured entries for this startup
    await prisma.featuredStartup.deleteMany({
      where: { startupId: parseInt((await params).id) }
    });

    // Then delete the startup
    await prisma.startup.delete({
      where: { id: parseInt((await params).id) }
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to delete startup' },
      { status: 500 }
    );
  }
}