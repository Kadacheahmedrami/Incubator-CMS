import { NextResponse } from "next/server";
import { prisma } from '@/prisma/prismaClient';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching event" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { title, landingImage, description } = body;

    const event = await prisma.event.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        title,
        landingImage,
        description,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: "Error updating event" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.event.delete({
      where: {
        id: parseInt(params.id),
      },
    });
    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting event" }, { status: 500 });
  }
}
