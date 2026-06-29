const API_URL = process.env.API_URL || 'http://localhost:3000/api';

const roomImageFallbacks = [
  '/images/room-deluxe-1.jpg',
  '/images/room-deluxe-2.jpg',
  '/images/room-superior.jpg',
  '/images/room-family.jpg',
];

export async function fetchEvents() {
  try {
    const res = await fetch(`${API_URL}/events`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const upcoming = data.filter((event) => new Date(event.date) >= today);

    return upcoming.length ? upcoming : data;
  } catch {
    return [];
  }
}

export async function fetchRooms() {
  try {
    const res = await fetch(`${API_URL}/rooms`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();

    if (!data.length) {
      return [];
    }

    return data.map((room, index) => ({
      ...room,
      image: room.images?.[0] || roomImageFallbacks[index],
    }));
  } catch {
    return [];
  }
}

export async function fetchGalleryImages() {
  try {
    const res = await fetch(`${API_URL}/gallery`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch {
    return [];
  }
}
