require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

async function testDB() {
  console.log('Connecting to DB...');
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('Connected!');
    process.exit(0);
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
}

testDB();
