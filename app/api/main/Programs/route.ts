import { NextResponse } from "next/server";
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const programs = await prisma.program.findMany();
    return NextResponse.json(programs);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching programs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, landingImage, description } = body;

    const program = await prisma.program.create({
      data: {
        title,
        landingImage,
        description,
      },
    });

    return NextResponse.json(program);
  } catch (error) {
    return NextResponse.json({ error: "Error creating program" }, { status: 500 });
  }
}
