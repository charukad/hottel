# Mountain Breeze Villa

Eco-friendly luxury hotel website for **Mountain Breeze Villa, Ella, Sri Lanka**.

## Project Structure

```
MountainBreezeVilla/
├── backend/     # Node.js + Express + MongoDB API
├── frontend/    # Public React website 
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
