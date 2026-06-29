import fs from 'fs/promises';
import path from 'path';

export const uploadFile = async (file, prefix) => {
  if (!file || typeof file === 'string') return null; // In case it's a string URL
  
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  await fs.mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name) || '.jpg';
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${prefix}-${uniqueSuffix}${ext}`;
  
  const filePath = path.join(uploadDir, filename);
  
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  
  return `/uploads/${filename}`;
};

export const deleteFile = async (fileUrl) => {
  if (!fileUrl || !fileUrl.includes('/uploads/')) return;
  try {
    const filename = path.basename(fileUrl);
    const filePath = path.join(process.cwd(), 'public/uploads', filename);
    await fs.unlink(filePath);
  } catch (err) {
    console.error('Error deleting file:', err);
  }
};
