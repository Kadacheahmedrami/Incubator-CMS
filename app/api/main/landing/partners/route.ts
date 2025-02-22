// app/api/main/landing/partners/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';

export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(partners);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newPartner = await prisma.partner.create({
      data: {
        name: data.name,
        logo: data.logo,
        url: data.url,
        landingPageId: data.landingPageId,
      },
    });
    return NextResponse.json(newPartner, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to create partner' },
      { status: 500 }
    );
  }
}
