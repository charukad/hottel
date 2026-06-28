# Mountain Breeze Villa

Eco-friendly luxury hotel website for **Mountain Breeze Villa, Ella, Sri Lanka**.

## Project Structure

```
MountainBreezeVilla/
├── backend/     # Node.js + Express + MongoDB API
├── frontend/    # Next.js public website (SSR)
└── admin/       # Admin panel React app 
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

### 2. Frontend (Next.js)

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev            # Starts site on http://localhost:3000
```

The home page fetches rooms and events on the server (SSR) from the backend API. Set `API_URL` in `.env.local` if your API is not at `http://localhost:5000/api`.
