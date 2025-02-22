import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const footerItem = await prisma.footer.findUnique({
      where: { id: parseInt((await params).id) },
    });
    if (!footerItem) {
      return NextResponse.json(
        { error: 'Footer section not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(footerItem);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to fetch footer section' },
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
    const updatedFooter = await prisma.footer.update({
      where: { id: parseInt((await params).id) },
      data: {
        content: data.content,
        landingPageId: data.landingPageId,
      },
    });
    return NextResponse.json(updatedFooter);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to update footer section' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await prisma.footer.delete({
      where: { id: parseInt((await params).id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to delete footer section' },
      { status: 500 }
    );
  }
}
