import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const featuredNews = await prisma.featuredNews.findMany({
      include: {
        landingPage: true,
        news: true,
      },
    });
    return NextResponse.json(featuredNews);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching featured news';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { landingPageId, newsId, order } = data;

    if (!landingPageId || !newsId) {
      return NextResponse.json(
        { error: 'landingPageId and newsId are required' },
        { status: 400 }
      );
    }

    const landingPage = await prisma.landingPage.findUnique({
      where: { id: landingPageId },
    });
    if (!landingPage) {
      return NextResponse.json({ error: 'Landing page not found' }, { status: 400 });
    }

    const newsItem = await prisma.news.findUnique({
      where: { id: newsId },
    });
    if (!newsItem) {
      return NextResponse.json({ error: 'News item not found' }, { status: 400 });
    }

    const featured = await prisma.featuredNews.create({
      data: {
        landingPageId,
        newsId,
        order: order || 0,
      },
      include: {
        landingPage: true,
        news: true,
      },
    });

    return NextResponse.json(featured);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating featured news';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
