import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Room from '@/lib/models/Room';

export async function GET() {
  try {
    await connectDB();
    const rooms = await Room.find().sort({ type: 1, name: 1 });
    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
