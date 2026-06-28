import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Gallery from '../models/Gallery.js';
import { protect } from '../middleware/auth.js';
import { galleryUpload, getImageUrl } from '../middleware/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const deleteUploadedFile = (imageUrl) => {
  if (imageUrl && imageUrl.includes('/uploads/')) {
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, '../uploads', filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
};

router.get('/', async (_req, res) => {
  try {
    const images = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, galleryUpload.single('image'), async (req, res) => {
  try {
    const { alt, order } = req.body;

    if (!alt) {
      return res.status(400).json({ message: 'Image description (alt text) is required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const imageUrl = getImageUrl(req, req.file.filename);
    const image = await Gallery.create({
      alt,
      imageUrl,
      order: order ? Number(order) : 0,
    });

    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, galleryUpload.single('image'), async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Gallery image not found' });
    }

    const { alt, order } = req.body;

    if (alt) image.alt = alt;
    if (order !== undefined) image.order = Number(order);

    if (req.file) {
      deleteUploadedFile(image.imageUrl);
      image.imageUrl = getImageUrl(req, req.file.filename);
    }

    await image.save();
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Gallery image not found' });
    }

    deleteUploadedFile(image.imageUrl);
    await image.deleteOne();
    res.json({ message: 'Gallery image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
