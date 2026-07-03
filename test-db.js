import mongoose from 'mongoose';

const URI = process.env.MONGODB_URI;

async function test() {
  console.log('Starting connect...');
  await mongoose.connect(URI);
  console.log('Connected!');
  process.exit(0);
}

test();
