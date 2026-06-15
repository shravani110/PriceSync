# PriceSync

PriceSync compares product prices live across Amazon, Flipkart, Myntra, Ajio, Croma, Reliance Digital, and Vijay Sales, and lets users save products, track price history, and get email alerts when prices drop.

## Stack

- **Frontend**: React + Vite, Tailwind CSS, React Router
- **Backend**: Node.js + Express, MongoDB (Mongoose)
- **Auth**: JWT, email verification via Nodemailer (SMTP)

## Project structure

```
backend/   Express API, scrapers, auth, alerts, email
frontend/  React app (Vite)
```

## Setup

### Backend

```
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, SMTP_* etc.
npm run dev
```

### Frontend

```
cd frontend
npm install
cp .env.example .env   # set VITE_API_BASE_URL to the backend URL
npm run dev
```

## Environment variables

See `backend/.env.example` and `frontend/.env.example` for the full list. Key ones:

- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — random hex string for signing auth tokens
- `FRONTEND_URL` — used to build email verification links
- `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` — SMTP credentials for sending verification and price-drop emails (falls back to a temporary Ethereal test inbox if unset)
- `CORS_ORIGIN` — allowed frontend origin(s) for the API
- `VITE_API_BASE_URL` — backend API URL used by the frontend

## Features

- Live price comparison across multiple Indian e-commerce stores
- Save products and view price history charts
- Account creation with email verification
- Price-drop email alerts 
