import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';


export async function GET() {
  try {
    const featuredStartups = await prisma.featuredStartup.findMany({
      include: {
        startup: {
          select: {
            name: true,
            description: true
          }
        }
      },
      orderBy: {
        order: 'asc'
      }
    });
   
    return NextResponse.json(featuredStartups);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch featured startups' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
   
    // Validate required fields
    if (!data.startupId) {
      return NextResponse.json(
        { error: 'Startup ID is required' },
        { status: 400 }
      );
    }

    // Check if startup exists
    const startup = await prisma.startup.findUnique({
      where: { id: data.startupId }
    });

    if (!startup) {
      return NextResponse.json(
        { error: 'Startup not found' },
        { status: 404 }
      );
    }

    // Check if startup is already featured
    const existingFeatured = await prisma.featuredStartup.findFirst({
      where: {
        startupId: data.startupId,
        landingPageId: data.landingPageId
      }
    });


    if (existingFeatured) {
      return NextResponse.json(
        { error: 'Startup is already featured' },
        { status: 400 }
      );
    }

    // Get max order if not provided
    
    if (!data.order) {
      const maxOrder = await prisma.featuredStartup.findFirst({
        where: { landingPageId: data.landingPageId },
        orderBy: { order: 'desc' }
      });
      data.order = maxOrder ? maxOrder.order + 1 : 1;
    }
    console.log("startup ==",startup)
    console.log("data ==",data)
    const featuredStartup = await prisma.featuredStartup.create({
      data: {
        startupId: data.startupId,
        landingPageId: data.landingPageId,
        order: data.order,
      },

    });
    
    return NextResponse.json(featuredStartup, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to create featured startup' },
      { status: 500 }
    );
  }
}