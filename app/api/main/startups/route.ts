import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

/**
 * GET handler
 * Returns a list of all startups.
 */
export async function GET() {
  try {
    const startups = await prisma.startup.findMany();
    return NextResponse.json(startups);
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
