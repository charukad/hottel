import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Gallery from '@/lib/models/Gallery';
import { protect } from '@/lib/auth';
import { uploadFile, deleteFile } from '@/lib/upload';

export async function PUT(req, { params }) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    await connectDB();
    const image = await Gallery.findById(params.id);
    if (!image) return NextResponse.json({ message: 'Gallery image not found' }, { status: 404 });

    const formData = await req.formData();
    const alt = formData.get('alt');
    const order = formData.get('order');
    const imageFile = formData.get('image');

    if (alt) image.alt = alt;
    if (order !== null && order !== undefined) image.order = Number(order);

    if (imageFile && typeof imageFile !== 'string') {
      await deleteFile(image.imageUrl);
      image.imageUrl = await uploadFile(imageFile, 'gallery');
    }

    await image.save();
    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    await connectDB();
    const image = await Gallery.findById(params.id);
    if (!image) return NextResponse.json({ message: 'Gallery image not found' }, { status: 404 });

    await deleteFile(image.imageUrl);
    await image.deleteOne();
    return NextResponse.json({ message: 'Gallery image deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
