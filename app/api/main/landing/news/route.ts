import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const newsItems = await prisma.news.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(newsItems);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newNews = await prisma.news.create({
      data: {
        title: data.title,
        landingImage: data.landingImage,
        description: data.description,
        order: data.order,
        landingPageId: data.landingPageId,
      },
    });
    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create news item' },
      { status: 500 }
    );
  }
}
