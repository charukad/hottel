import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/lib/models/Event';
import { protect } from '@/lib/auth';
import { uploadFile } from '@/lib/upload';

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ date: 1 });
    return NextResponse.json(events);
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
    
    const title = formData.get('title');
    const description = formData.get('description');
    const date = formData.get('date');
    const imageFile = formData.get('image');
    const existingImageUrl = formData.get('imageUrl') || '';

    if (!title || !description || !date) {
      return NextResponse.json({ message: 'Title, description, and date are required' }, { status: 400 });
    }

    let imageUrl = existingImageUrl;
    if (imageFile && typeof imageFile !== 'string') {
      imageUrl = await uploadFile(imageFile, 'event');
    }

    const event = await Event.create({ title, description, date, imageUrl });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
