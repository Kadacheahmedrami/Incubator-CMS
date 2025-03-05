import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/prisma/prismaClient';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'supersecret'
);

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching users';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // If a password is provided, hash it before saving
    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    const user = await prisma.user.create({
      data,
    });
    return NextResponse.json(user);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating user';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
