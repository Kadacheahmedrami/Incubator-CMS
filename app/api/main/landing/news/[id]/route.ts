import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const newsItem = await prisma.news.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!newsItem) {
      return NextResponse.json({ error: 'News item not found' }, { status: 404 });
    }
    return NextResponse.json(newsItem);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch news item' },
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
    const updatedNews = await prisma.news.update({
      where: { id: parseInt(params.id) },
      data: {
        title: data.title,
        landingImage: data.landingImage,
        description: data.description,
        order: data.order,
        landingPageId: data.landingPageId,
      },
    });
    return NextResponse.json(updatedNews);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update news item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.news.delete({
      where: { id: parseInt(params.id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete news item' },
      { status: 500 }
    );
  }
}
