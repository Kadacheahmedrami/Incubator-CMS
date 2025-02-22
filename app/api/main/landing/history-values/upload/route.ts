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
    const { image, publicId } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Use the provided publicId if available; otherwise fallback.
    const finalPublicId = publicId ? publicId : "history";

    // Upload the image using the final public_id.
    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: "incubator/history",
      public_id: finalPublicId,
      overwrite: true, // ensures the image is replaced if it already exists
    });

    return NextResponse.json({ url: uploadedImage.secure_url }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
