import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'supersecret'
);

// In this case, the User model's ID is a UUID (string), so we just pass it through.
function parseUserId(id: string): string {
  return id;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = parseUserId(params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching user';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Await the request body first
  const data = await request.json();
  const userId = parseUserId(params.id);

  // If a new password is provided, hash it
  if (data.password) {
    data.password = await hashPassword(data.password);
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data,
    });
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update user';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = parseUserId(params.id);
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete user';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
