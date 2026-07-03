export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import HeroSlide from '@/lib/models/HeroSlide';
import { protect } from '@/lib/auth';
import { deleteFile, uploadFile } from '@/lib/upload';
import { withTimeout } from '@/lib/with-timeout';

const API_TIMEOUT_MS = 15000;

export async function PUT(req, { params }) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    const updatedSlide = await withTimeout(
      (async () => {
        await connectDB();
        const slide = await HeroSlide.findById(params.id);
        if (!slide) throw new Error('Hero slide not found');

        const formData = await req.formData();
        slide.title = formData.get('title') || slide.title;
        slide.subtitle = formData.get('subtitle') || slide.subtitle;
        slide.order = formData.has('order') ? Number(formData.get('order')) : slide.order;
        slide.isActive = formData.has('isActive') ? formData.get('isActive') !== 'false' : slide.isActive;

        const imageFile = formData.get('image');
        if (imageFile && typeof imageFile !== 'string') {
          if (slide.imageUrl) {
            await deleteFile(slide.imageUrl);
          }
          slide.imageUrl = await uploadFile(imageFile, 'hero');
        }

        await slide.save();
        return slide;
      })(),
      API_TIMEOUT_MS,
      `PUT /api/hero/${params.id}`
    );

    return NextResponse.json(updatedSlide);
  } catch (error) {
    const status = error.message === 'Hero slide not found' ? 404
      : error.message.includes('timed out') ? 503
      : 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    await withTimeout(
      (async () => {
        await connectDB();
        const slide = await HeroSlide.findById(params.id);
        if (!slide) throw new Error('Hero slide not found');

        if (slide.imageUrl) {
          await deleteFile(slide.imageUrl);
        }

        await slide.deleteOne();
      })(),
      API_TIMEOUT_MS,
      `DELETE /api/hero/${params.id}`
    );

    return NextResponse.json({ message: 'Hero slide removed' });
  } catch (error) {
    const status = error.message === 'Hero slide not found' ? 404
      : error.message.includes('timed out') ? 503
      : 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
