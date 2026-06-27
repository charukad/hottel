import express from 'express';
import Room from '../models/Room.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const rooms = await Room.find().sort({ type: 1, name: 1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
