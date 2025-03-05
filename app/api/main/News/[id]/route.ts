import { NextResponse } from "next/server";
import { prisma } from '@/prisma/prismaClient';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const news = await prisma.news.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching news" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { title, landingImage, description } = body;

    const news = await prisma.news.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        title,
        landingImage,
        description,
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: "Error updating news" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.news.delete({
      where: {
        id: parseInt(params.id),
      },
    });
    return NextResponse.json({ message: "News deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting news" }, { status: 500 });
  }
}
