import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import roomRoutes from './routes/rooms.js';
import Event from './models/Event.js';
import Room from './models/Room.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/admin', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/rooms', roomRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Mountain Breeze Villa API is running' });
});

app.get('/api/stats', async (_req, res) => {
  try {
    const [roomCount, eventCount] = await Promise.all([
      Room.countDocuments(),
      Event.countDocuments(),
    ]);
    res.json({ roomCount, eventCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use((err, _req, res, _next) => {
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
