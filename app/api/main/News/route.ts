import { NextResponse } from "next/server";
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const news = await prisma.news.findMany();
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching news" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, landingImage, description } = body;

    const news = await prisma.news.create({
      data: {
        title,
        landingImage,
        description,
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: "Error creating news" }, { status: 500 });
  }
}
