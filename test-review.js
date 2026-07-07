import jwt from 'jsonwebtoken';
import 'dotenv/config';

const token = jwt.sign({ id: 'admin123' }, process.env.JWT_SECRET || 'super_secret_jwt_key_12345', { expiresIn: '1d' });

fetch('http://localhost:3000/api/reviews', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    guestName: 'Test',
    text: 'Test',
    rating: 5,
    source: 'Direct',
    isActive: true
  })
}).then(r => r.json().then(data => ({status: r.status, data})))
  .then(console.log)
  .catch(console.error);
