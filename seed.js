import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables is handled by node --env-file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models
import Event from './lib/models/Event.js';
import Room from './lib/models/Room.js';

const MONGODB_URI = process.env.MONGODB_URI;

const dummyEvents = [
  {
    title: 'Yoga Retreat Weekend',
    date: new Date(Date.now() + 86400000 * 5),
    description: 'Join us for a relaxing weekend of guided yoga and meditation overlooking the Ella mountains.',
    imageUrl: '/images/activity-meditation.jpg',
  },
  {
    title: 'Traditional Cooking Class',
    date: new Date(Date.now() + 86400000 * 12),
    description: 'Learn to cook authentic Sri Lankan cuisine using fresh organic ingredients from our garden.',
    imageUrl: '/images/gallery-5.jpg',
  },
];

const dummyRooms = [
  {
    name: 'Mountain View Deluxe',
    type: 'Deluxe Double',
    description: 'Spacious room with a private balcony offering stunning panoramic views of the Ella gap.',
    price: 15000,
    features: ['King Bed', 'Balcony', 'Mountain View', 'En-suite'],
    images: ['/images/room-deluxe-1.jpg'],
    available: 1,
  },
  {
    name: 'Nature Haven',
    type: 'Superior',
    description: 'Surrounded by lush greenery, perfect for couples seeking privacy and tranquility.',
    price: 12000,
    features: ['Queen Bed', 'Garden View', 'Minibar'],
    images: ['/images/room-superior.jpg'],
    available: 1,
  },
  {
    name: 'The Tea Estate Suite',
    type: 'Family',
    description: 'A large suite ideal for families, featuring a seating area and beautiful views of the tea plantations.',
    price: 22000,
    features: ['2 Queen Beds', 'Living Area', 'Plantation View'],
    images: ['/images/room-family.jpg'],
    available: 1,
  },
  {
    name: 'Sunrise Deluxe',
    type: 'Deluxe Double',
    description: 'Wake up to the spectacular sunrise over the mountains right from your bed.',
    price: 16000,
    features: ['King Bed', 'Private Deck', 'Sunrise View'],
    images: ['/images/room-deluxe-2.jpg'],
    available: 1,
  },
];

async function seedDatabase() {
  if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully.');

    console.log('Clearing existing data...');
    await Event.deleteMany({});
    await Room.deleteMany({});

    console.log('Inserting dummy events...');
    await Event.insertMany(dummyEvents);

    console.log('Inserting dummy rooms...');
    await Room.insertMany(dummyRooms);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
