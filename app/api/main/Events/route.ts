import { NextResponse } from "next/server";
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const events = await prisma.event.findMany();
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, landingImage, description } = body;

    const event = await prisma.event.create({
      data: {
        title,
        landingImage,
        description,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: "Error creating event" }, { status: 500 });
  }
}
