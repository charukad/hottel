import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (!MONGODB_URI) {
    // If we are in the Vercel build step and there's no DB string, don't crash the build.
    if (process.env.VERCEL_ENV && process.env.CI) {
      console.warn('Skipping MongoDB connection during Vercel Build Phase due to missing MONGODB_URI');
      return null;
    }
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  // If we have a cached connection, verify it's still alive
  if (cached.conn) {
    const readyState = cached.conn.connection?.readyState ?? mongoose.connection.readyState;
    // 1 = connected, 2 = connecting
    if (readyState === 1) {
      return cached.conn;
    }
    // Connection went stale — reset and reconnect
    if (readyState !== 2) {
      cached.conn = null;
      cached.promise = null;
    }
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Fail fast if Atlas is unreachable instead of hanging forever
      serverSelectionTimeoutMS: 10000,
      // Kill zombie sockets after 45s of inactivity
      socketTimeoutMS: 45000,
      // Keep the connection pool lean for serverless
      maxPoolSize: 5,
      // Retry initial connection once
      retryWrites: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('MongoDB connected successfully');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset so next request retries instead of returning the failed promise
    cached.promise = null;
    cached.conn = null;
    console.error('MongoDB connection failed:', e.message);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
