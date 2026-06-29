const API_URL = process.env.API_URL || 'http://localhost:3000/api';

const roomImageFallbacks = [
  '/images/room-deluxe-1.jpg',
  '/images/room-deluxe-2.jpg',
  '/images/room-superior.jpg',
  '/images/room-family.jpg',
];

export async function fetchEvents() {
  try {
    const res = await fetch(`${API_URL}/events`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const upcoming = data.filter((event) => new Date(event.date) >= today);
    return upcoming.length ? upcoming : data;
  } catch {
    return [
      { _id: '1', title: 'Yoga Retreat Weekend', date: new Date(Date.now() + 86400000 * 5).toISOString(), description: 'Join us for a relaxing weekend of guided yoga and meditation overlooking the Ella mountains.', imageUrl: '/images/activity-meditation.jpg' },
      { _id: '2', title: 'Traditional Cooking Class', date: new Date(Date.now() + 86400000 * 12).toISOString(), description: 'Learn to cook authentic Sri Lankan cuisine using fresh organic ingredients from our garden.', imageUrl: '/images/gallery-5.jpg' }
    ];
  }
}

export async function fetchRooms() {
  try {
    const res = await fetch(`${API_URL}/rooms`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    if (!data.length) throw new Error('Empty');
    return data.map((room, index) => ({
      ...room,
      image: room.images?.[0] || roomImageFallbacks[index % roomImageFallbacks.length],
    }));
  } catch {
    return [
      { _id: 'r1', name: 'Mountain View Deluxe', type: 'Deluxe Double', description: 'Spacious room with a private balcony offering stunning panoramic views of the Ella gap.', price: 15000, features: ['King Bed', 'Balcony', 'Mountain View', 'En-suite'], image: '/images/room-deluxe-1.jpg' },
      { _id: 'r2', name: 'Nature Haven', type: 'Superior', description: 'Surrounded by lush greenery, perfect for couples seeking privacy and tranquility.', price: 12000, features: ['Queen Bed', 'Garden View', 'Minibar'], image: '/images/room-superior.jpg' },
      { _id: 'r3', name: 'The Tea Estate Suite', type: 'Family', description: 'A large suite ideal for families, featuring a seating area and beautiful views of the tea plantations.', price: 22000, features: ['2 Queen Beds', 'Living Area', 'Plantation View'], image: '/images/room-family.jpg' },
      { _id: 'r4', name: 'Sunrise Deluxe', type: 'Deluxe Double', description: 'Wake up to the spectacular sunrise over the mountains right from your bed.', price: 16000, features: ['King Bed', 'Private Deck', 'Sunrise View'], image: '/images/room-deluxe-2.jpg' }
    ];
  }
}

export async function fetchGalleryImages() {
  try {
    const res = await fetch(`${API_URL}/gallery`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch {
    return [];
  }
}
