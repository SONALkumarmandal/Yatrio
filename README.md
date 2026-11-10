# Yatrio

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python" alt="Python" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql" alt="Neon Postgres" />
</p>

<p align="center">
  <strong>Thoughtfully planned holidays across India and beyond.</strong>
  <br />
  A travel platform that helps travelers discover destinations, compare trip ideas, and connect with a human planner through WhatsApp.
</p>

<div align="center">
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#license">License</a>
</div>

---

## Overview

Yatrio is a modern travel brand experience built around personalized holiday planning. The project combines a sleek frontend with a robust backend API to power destination discovery, curated packages, and trip planning workflows.

Whether a traveler wants a slow-backwater escape, an adventure trip, or a heritage getaway, Yatrio helps them explore inspiring destinations and connect with a real planner for a tailored experience.

---

## Features

- Beautiful destination discovery pages and curated travel packages
- Responsive travel website built with React + Vite
- Personalized trip planner flow via WhatsApp integration
- Search and filter for destinations by region and budget
- FastAPI backend with authentication, media uploads, and admin management
- PostgreSQL database with Neon integration
- JWT + session-based security for protected routes
- Cloudinary support for image storage and uploads
- Swagger / OpenAPI docs for quick API exploration

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
