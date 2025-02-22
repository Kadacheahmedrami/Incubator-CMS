import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const historyValue = await prisma.historyAndValues.findUnique({
      where: { id: parseInt((await params).id) },
    });
    if (!historyValue) {
      return NextResponse.json(
        { error: 'History and Values section not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(historyValue);
  } catch (error) {

    console.log(error)
    return NextResponse.json(
      { error: 'Failed to fetch history and values section' },
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
    const updatedHistoryValue = await prisma.historyAndValues.update({
      where: { id: parseInt((await params).id) },
      data: {
        title: data.title,
        landingImage: data.landingImage,
        description: data.description,
        order: data.order,
        landingPageId: data.landingPageId,
      },
    });
    return NextResponse.json(updatedHistoryValue);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to update history and values section' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await prisma.historyAndValues.delete({
      where: { id: parseInt((await params).id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to delete history and values section' },
      { status: 500 }
    );
  }
}
