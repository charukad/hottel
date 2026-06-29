import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/lib/models/Event';
import { protect } from '@/lib/auth';
import { uploadFile, deleteFile } from '@/lib/upload';

export async function PUT(req, { params }) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    await connectDB();
    const event = await Event.findById(params.id);
    if (!event) return NextResponse.json({ message: 'Event not found' }, { status: 404 });

    const formData = await req.formData();
    
    const title = formData.get('title');
    const description = formData.get('description');
    const date = formData.get('date');
    const imageFile = formData.get('image');
    const existingImageUrl = formData.get('imageUrl');

    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;

    if (imageFile && typeof imageFile !== 'string') {
      if (event.imageUrl) await deleteFile(event.imageUrl);
      event.imageUrl = await uploadFile(imageFile, 'event');
    } else if (existingImageUrl !== undefined) {
      event.imageUrl = existingImageUrl;
    }

    await event.save();
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    await connectDB();
    const event = await Event.findById(params.id);
    if (!event) return NextResponse.json({ message: 'Event not found' }, { status: 404 });

    if (event.imageUrl) await deleteFile(event.imageUrl);

    await event.deleteOne();
    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
