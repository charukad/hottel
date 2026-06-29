import jwt from 'jsonwebtoken';
import Admin from './models/Admin';

export const protect = async (req) => {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Not authorized, no token', status: 401 };
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return { error: 'Not authorized, admin not found', status: 401 };
    }

    return { admin };
  } catch (err) {
    return { error: 'Not authorized, token invalid', status: 401 };
  }
};

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};
