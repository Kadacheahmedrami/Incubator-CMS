import { NextResponse } from "next/server";
import { prisma } from '@/prisma/prismaClient';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const program = await prisma.program.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });
    return NextResponse.json(program);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching program" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { title, landingImage, description } = body;

    const program = await prisma.program.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        title,
        landingImage,
        description,
      },
    });

    return NextResponse.json(program);
  } catch (error) {
    return NextResponse.json({ error: "Error updating program" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.program.delete({
      where: {
        id: parseInt(params.id),
      },
    });
    return NextResponse.json({ message: "Program deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting program" }, { status: 500 });
  }
}
