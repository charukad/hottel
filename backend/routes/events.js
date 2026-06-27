import express from 'express';
import Event from '../models/Event.js';
import { protect } from '../middleware/auth.js';
import { upload, getImageUrl } from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, description, date } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({ message: 'Title, description, and date are required' });
    }

    let imageUrl = req.body.imageUrl || '';
    if (req.file) {
      imageUrl = getImageUrl(req, req.file.filename);
    }

    const event = await Event.create({ title, description, date, imageUrl });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const { title, description, date } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;

    if (req.file) {
      if (event.imageUrl && event.imageUrl.includes('/uploads/')) {
        const oldFilename = path.basename(event.imageUrl);
        const oldPath = path.join(__dirname, '../uploads', oldFilename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      event.imageUrl = getImageUrl(req, req.file.filename);
    } else if (req.body.imageUrl !== undefined) {
      event.imageUrl = req.body.imageUrl;
    }

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.imageUrl && event.imageUrl.includes('/uploads/')) {
      const filename = path.basename(event.imageUrl);
      const filePath = path.join(__dirname, '../uploads', filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
