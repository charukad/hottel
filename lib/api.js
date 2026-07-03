import connectDB from './db';
import { withTimeout } from './with-timeout';
import axios from 'axios';
import Event from './models/Event';
import Room from './models/Room';
import Gallery from './models/Gallery';

const api = axios.create({
  baseURL: '/api',
});

export default api;

const SSR_TIMEOUT_MS = 10000; // 10 seconds max for SSR data fetching

export async function fetchEvents() {
  try {
    const result = await withTimeout(
      (async () => {
        await connectDB();
        const today = new Date(new Date().setHours(0, 0, 0, 0));

        // Fetch upcoming events
        const upcoming = await Event.find({ date: { $gte: today } })
          .sort({ date: 1 })
          .lean();

        if (upcoming.length > 0) {
          return JSON.parse(JSON.stringify(upcoming));
        }

        // If no upcoming, fetch all
        const all = await Event.find().sort({ date: 1 }).lean();
        return JSON.parse(JSON.stringify(all));
      })(),
      SSR_TIMEOUT_MS,
      'fetchEvents'
    );
    return result;
  } catch (err) {
    console.error('fetchEvents failed:', err.message);
    return [];
  }
}

export async function fetchRooms() {
  try {
    const result = await withTimeout(
      (async () => {
        await connectDB();
        const rooms = await Room.find().lean();
        const parsedRooms = JSON.parse(JSON.stringify(rooms));

        return parsedRooms.map((room) => ({
          ...room,
          image: room.images?.[0] || '',
        }));
      })(),
      SSR_TIMEOUT_MS,
      'fetchRooms'
    );
    return result;
  } catch (err) {
    console.error('fetchRooms failed:', err.message);
    return [];
  }
}

export async function fetchGalleryImages() {
  try {
    const result = await withTimeout(
      (async () => {
        await connectDB();
        const images = await Gallery.find().sort({ order: 1, createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(images));
      })(),
      SSR_TIMEOUT_MS,
      'fetchGalleryImages'
    );
    return result;
  } catch (err) {
    console.error('fetchGalleryImages failed:', err.message);
    return [];
  }
}
