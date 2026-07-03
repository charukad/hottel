import mongoose from 'mongoose';
import Admin from './lib/models/Admin.js';

const MONGODB_URI = process.env.MONGODB_URI;

async function seedAdmin() {
  if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully.');

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const admin = new Admin({ username: 'admin', password: 'password123' });
      await admin.save();
      console.log('Admin user created successfully!');
      console.log('Username: admin');
      console.log('Password: password123');
    } else {
      console.log('Admin user already exists!');
      console.log('Username: admin');
      console.log('Password: password123');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
