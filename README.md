# Yatreo

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python" alt="Python" />
  <img src="https://img.shields.io/badge/Lenis-Smooth_Scroll-F4A93B?style=for-the-badge" alt="Lenis" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql" alt="Neon Postgres" />
</p>

<p align="center">
  <strong>Every yatra, your story. Holidays, handled.</strong>
  <br />
  <em>From yatra (journey) + yatri (traveller)</em>
  <br />
  A modern travel brand experience combining Human-Centered UI (HCUI), silky Lenis smooth scrolling, bespoke trip blueprints, and a direct WhatsApp human concierge.
</p>

<div align="center">
  <a href="#features">Features</a> •
  <a href="#brand-identity">Brand Identity</a> •
  <a href="#routes">Routes</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#getting-started">Getting Started</a>
</div>

---

## Brand Identity & Design System

Confirmed per Brand Board v1.0:
- **Name**: `Yatreo` (yatra + yatri)
- **Tagline**: `Every yatra, your story.`
- **Support Line**: `Holidays, handled.`
- **Logo Mark**: The Fork, with an ascending golden airplane and runway centerlines
- **Palette**: Palette A · *Sunrise Over Water*
  - Deep Sea Teal: `#0F5C5E`
  - Night Ink: `#112A2D`
  - Sun Amber/Gold: `#F4A93B`
  - Oat & Sand: `#EAE1D3`
  - Warm Ivory Cream: `#FAF6F0`
- **Typography**:
  - `Fraunces` — Warm editorial display serif
  - `Hind` — High-legibility humanist body & UI sans
  - `Yatra One` — Indian accent / Devanagari heritage stamps
- **Booking Flow**: Directly on WhatsApp with a dedicated human planner (no mandatory logins).

---

## Features

- **HCUI & Gen-Z Centric Polish**:
  - Silky Lenis smooth scrolling with motion accessibility detection.
  - Interactive **15-second Vibe Matcher** quiz on the homepage.
  - Interactive **Custom Trip Builder** (`/plan`) with live budget slider, per-day estimates, traveler steppers, and instant WhatsApp itinerary blueprint export.
  - **Trip Wishlist / Bookmark Store** (single-tap heart toggle with offline persistence).
  - Floating **Human Concierge Pill** with real-time online status indicator.
  - Shareable trips with native Web Share API & clipboard toast notifications.
- **FastAPI REST API**:
  - Public endpoints: `/api/destinations` (pagination, search, and region filters).
  - Admin management: `/api/admin/destinations` (CRUD with Cloudinary upload/deletion).
  - Traveler projects: `/api/projects` (custom trip plans).
  - Automated SQLite fallback for zero-config local runs, with Neon PostgreSQL production support.
  - Automated test suite verified with Pytest.

---

## Routes

| Route | Page | Description |
|---|---|---|
| `/` | **Home Page** | Hero, search, vibe matcher, stamps grid, testimonials |
| `/destinations` | **Explore Page** | Filter by region, budget, search with live API sync |
| `/destinations/:slug` | **Destination Detail** | Hero visuals, season, highlights, inclusions, WhatsApp CTA |
| `/packages` | **Curated Packages** | Boarding pass cards with transparent routes & all-in pricing |
| `/plan` | **Trip Planner** | Bespoke trip blueprint builder with budget slider |
| `/about` | **Our Story** | Brand philosophy, yatra + yatri origin, confirmed design board |
| `/faq` | **FAQs** | Interactive accordion answering booking, safety & payments |
| `/contact` | **Contact Concierge** | Human concierge, hours, quick WhatsApp note generator |
| `/dashboard` | **Traveler Dashboard**| Profile view, saved wishlist, personal trip plans |
| `/login` | **Sign In / Register**| Auth view with demo admin login filler |
| `/admin` | **Admin Portal** | Metrics cards, destination catalog CRUD & status management |

---

## Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Tailwind CSS
- Lucide icons

### Backend
- FastAPI
- Python
- SQLAlchemy 2
- PostgreSQL / Neon
- JWT + bcrypt
- Cloudinary

---

## Architecture

```text
Frontend (React + Vite)
        │
        ├── Home page
        ├── Destination discovery
        ├── Trip planner / WhatsApp flow
        └── Destination detail pages
        │
        ▼
Backend (FastAPI)
        │
        ├── Auth & sessions
        ├── User and project APIs
        ├── Media uploads via Cloudinary
        ├── Admin dashboard endpoints
        └── Postgres database access
```

---

## Project Structure

```text
Yatrio/
├── Frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── .gitignore
│
├── backend/
│   ├── app/
│   ├── .env.example
│   ├── requirements.txt
│   ├── README.md
│   └── .gitignore
│
├── README.md
└── .gitignore
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- npm or yarn
- PostgreSQL database (or Neon project)

### 1) Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

The app will run on:

- http://localhost:5173

### 2) Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Update the environment variables in `.env` with your database, JWT secret, and Cloudinary credentials.

Then start the API:

```bash
uvicorn app.main:app --reload
```

API docs will be available at:

- http://localhost:8000/docs

---

## Environment Variables

The backend expects the following values in `backend/.env`:

```env
APP_NAME="Yatrio"
ENVIRONMENT=development
DATABASE_URL=postgresql://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require
JWT_SECRET_KEY=your_jwt_secret
SESSION_SECRET_KEY=your_session_secret
ACCESS_TOKEN_EXPIRE_MINUTES=60
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=your_folder
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
FIRST_ADMIN_EMAIL=admin@example.com
FIRST_ADMIN_USERNAME=admin
FIRST_ADMIN_PASSWORD=your_secure_password
```

---

## Core Use Cases

### For Travelers
- Explore destinations across India and beyond
- Search by mood, region, or budget
- Get trip inspiration from curated collections
- Connect quickly with a planner on WhatsApp

### For Admins
- Manage destinations and content
- Handle user and project records
- Upload and manage media files
- Access analytics and admin-level operations

---

## API Overview

The backend exposes REST endpoints for:

- Authentication and session management
- User profile management
- Project and trip data
- Documentary/media management
- Admin operations and analytics

For more details, see the backend README:

- [backend/README.md](backend/README.md)

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## License

This project is currently unlicensed unless a license file is added later.

---

## Contact

Created with ❤️ for modern travel experiences.

- GitHub: [SONALkumarmandal](https://github.com/SONALkumarmandal)
- Project: [Yatrio](https://github.com/SONALkumarmandal/Yatrio)

<p align="center">
  <strong>Every yatra, your story.</strong>
</p>

---

If you want, I can also create:

- a more premium-looking README with a hero banner and screenshots
- a short version for GitHub profile use
- a deployment-ready README for Vercel + Render or Railway
- a README with project badges and a custom logo section

I can tailor the final version to your exact brand style too.
