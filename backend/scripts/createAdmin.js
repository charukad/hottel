import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Admin from '../models/Admin.js';
import Room from '../models/Room.js';

dotenv.config();

const seedRooms = async () => {
  const count = await Room.countDocuments();
  if (count > 0) {
    console.log('Rooms already exist, skipping seed.');
    return;
  }

  await Room.insertMany([
    {
      name: 'Deluxe Double Room 1',
      type: 'Deluxe Double',
      description:
        'Spacious double room with panoramic mountain views, natural wood finishes, and eco-friendly amenities.',
      price: 8500,
      features: ['King Bed', 'Mountain View', 'Private Balcony', 'Eco Toiletries'],
      available: 1,
      images: [],
    },
    {
      name: 'Deluxe Double Room 2',
      type: 'Deluxe Double',
      description:
        'Elegant double room surrounded by lush greenery, perfect for couples seeking a peaceful retreat.',
      price: 8500,
      features: ['King Bed', 'Garden View', 'Rain Shower', 'Organic Linens'],
      available: 1,
      images: [],
    },
    {
      name: 'Superior Room',
      type: 'Superior',
      description:
        'Premium room with elevated views of Ella\'s misty peaks, designed for comfort and tranquility.',
      price: 12000,
      features: ['Queen Bed', 'Panoramic View', 'Sitting Area', 'Mini Bar'],
      available: 1,
      images: [],
    },
    {
      name: 'Family Room',
      type: 'Family',
      description:
        'Generous family suite with space for everyone, ideal for exploring Ella together.',
      price: 15000,
      features: ['Double + Single Bed', 'Living Space', 'Mountain View', 'Extra Storage'],
      available: 1,
      images: [],
    },
  ]);

  console.log('Rooms seeded successfully.');
};

const createAdmin = async () => {
  await connectDB();

  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log(`Admin "${username}" already exists.`);
  } else {
    await Admin.create({ username, password });
    console.log(`Admin "${username}" created successfully.`);
  }

  await seedRooms();
  process.exit(0);
};

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
