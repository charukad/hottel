# Mountain Breeze Villa

Eco-friendly luxury hotel website for **Mountain Breeze Villa, Ella, Sri Lanka**.

## Project Structure

```
MountainBreezeVilla/
├── backend/     # Node.js + Express + MongoDB API
├── frontend/    # Public React website (port 5173)
└── admin/       # Admin panel React app (port 5174)
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (or MongoDB Atlas connection string)

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run create-admin   # Creates admin user + seeds 4 rooms
npm run dev            # Starts API on http://localhost:5000
```

Default admin credentials (change in `.env` before running `create-admin`):
- **Username:** admin
- **Password:** admin123

### 2. Public Website

```bash
cd frontend
cp .env.example .env
npm install
npm run dev            # http://localhost:5173
```

### 3. Admin Panel

```bash
cd admin
cp .env.example .env
npm install
npm run dev            # http://localhost:5174
```

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/admin/login` | Public | Admin login |
| GET | `/api/events` | Public | List all events |
| POST | `/api/events` | Admin | Create event |
| PUT | `/api/events/:id` | Admin | Update event |
| DELETE | `/api/events/:id` | Admin | Delete event |
| GET | `/api/rooms` | Public | List all rooms |
| GET | `/api/stats` | Public | Room & event counts |
| GET | `/api/health` | Public | Health check |

## Features

### Public Website
- Full-screen hero slider
- Dynamic events section (loaded from API)
- About, Rooms, Services, Activities, Gallery, Contact
- WhatsApp booking integration
- Google Maps embed for Ella
- Dark/light mode toggle
- SEO meta tags
- Framer Motion animations

### Admin Panel
- JWT authentication
- Dashboard with stats
- Event CRUD with image upload

## Images

See `frontend/public/images/IMAGES.md` for the full list of image filenames to add.

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mountain_breeze_villa
JWT_SECRET=your_super_secret_jwt_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

### Frontend & Admin (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios, Framer Motion, React Hot Toast
- **Admin:** React, Vite, React Router, Axios, React Hot Toast
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Multer, Bcrypt
