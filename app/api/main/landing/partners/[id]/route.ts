// app/api/main/landing/partners/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

function parsePartnerId(id: string): number | null {
  const parsed = Number(id);
  return isNaN(parsed) ? null : parsed;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const partnerId = parsePartnerId(params.id);
  if (partnerId === null) {
    return NextResponse.json({ error: 'Invalid partner id' }, { status: 400 });
  }

  try {
    const partner = await prisma.partner.findUnique({ where: { id: partnerId } });
    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }
    return NextResponse.json(partner);
  } catch (error) {
    console.error('GET partner error:', error);
    return NextResponse.json({ error: 'Failed to fetch partner' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const partnerId = parsePartnerId(params.id);
  if (partnerId === null) {
    return NextResponse.json({ error: 'Invalid partner id' }, { status: 400 });
  }
  
  try {
    const data = await request.json();
    if (
      typeof data.name !== 'string' ||
      typeof data.logo !== 'string'
    ) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
    }
    const updatedPartner = await prisma.partner.update({
      where: { id: partnerId },
      data,
    });
    return NextResponse.json(updatedPartner);
  } catch (error) {
    console.error('PUT partner error:', error);
    return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const partnerId = parsePartnerId(params.id);
  if (partnerId === null) {
    return NextResponse.json({ error: 'Invalid partner id' }, { status: 400 });
  }
  
  try {
    const partner = await prisma.partner.findUnique({ where: { id: partnerId } });
    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }
    await prisma.partner.delete({ where: { id: partnerId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE partner error:', error);
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}
