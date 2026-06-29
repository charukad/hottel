import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Gallery from '@/lib/models/Gallery';
import { protect } from '@/lib/auth';
import { uploadFile } from '@/lib/upload';

export async function GET() {
  try {
    await connectDB();
    const images = await Gallery.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    await connectDB();
    const formData = await req.formData();
    
    const alt = formData.get('alt');
    const order = formData.get('order');
    const imageFile = formData.get('image');

    if (!alt) {
      return NextResponse.json({ message: 'Image description (alt text) is required' }, { status: 400 });
    }

    if (!imageFile || typeof imageFile === 'string') {
      return NextResponse.json({ message: 'Image file is required' }, { status: 400 });
    }

    const imageUrl = await uploadFile(imageFile, 'gallery');
    
    const image = await Gallery.create({
      alt,
      imageUrl,
      order: order ? Number(order) : 0,
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
