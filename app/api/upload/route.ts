import { v2 as cloudinary } from "cloudinary";
import { NextResponse, NextRequest } from "next/server";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Upload to Cloudinary (Signed Upload)
    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: "incubator",
      use_filename: true,
      unique_filename: true,
      overwrite: true,
    });

    return NextResponse.json({ url: uploadedImage.secure_url }, { status: 200 });
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
