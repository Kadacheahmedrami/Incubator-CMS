// app/api/startups/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

/**
 * GET handler
 * Returns a specific startup by its ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const startup = await prisma.startup.findUnique({
      where: { id: parseInt((await params).id) },
    });

    if (!startup) {
      return NextResponse.json(
        { error: 'Startup not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(startup);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT handler
 * Updates a specific startup.
 *
 * Expects a JSON body with:
 * - name?: string
 * - landingPageId?: number
 * - description?: string
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { name, description, id } = await request.json();

    const startup = await prisma.startup.update({
      where: { id: parseInt((await params).id) },
      data: { name, description, id },
    });

    return NextResponse.json(startup);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler
 * Deletes a specific startup.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await prisma.startup.delete({
      where: { id: parseInt((await params).id) },
    });

    return NextResponse.json({ message: 'Startup deleted successfully.' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
