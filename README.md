# ProjXpert

ProjXpert is a full-stack MERN application for student project support: task submission, file attachments via Cloudinary, admin analytics, and AI assistant stubs.

This repo contains a backend (Express + MongoDB) and a frontend (React + Redux + Tailwind). The app uses secure httpOnly cookies for session management and supports Google OAuth.

Quick start (local development)

1. Backend

```cmd
cd backend
npm install
npm run dev
```

2. Frontend

```cmd
cd frontend
npm install
npm run start
```

Open http://localhost:3000 in your browser.

Running tests (backend)

```cmd
cd backend
npm test
```

Deployment
See `DEPLOYMENT.md` for deployment instructions to Vercel (frontend) and Render (backend), and configuration for MongoDB Atlas and Cloudinary.

Credits
- Built with Node.js, Express, MongoDB, React, Redux, Tailwind, Cloudinary.
# ProjXpert

ProjXpert is a full-stack MERN showcase platform for students to post academic project/task challenges and for admins to coordinate, solve, and deliver high-quality results with AI assistance.

This repository contains two main folders:

- `backend/` - Express.js API, MongoDB models, Socket.io, and AI integration stubs.
- `frontend/` - React + Redux app scaffold with Tailwind & MUI components.

Quick start (local dev):

1. Backend
   - cd backend
   - copy `.env.example` to `.env` and fill values
   - npm install
   - npm run dev

2. Frontend
   - cd frontend
   - npm install
   - npm run start

Notes:
- This scaffold contains initial models, routes, and client skeleton for ProjXpert. Many features (detailed UI, full AI integration, file upload flows, Google OAuth flows, OTP, tests, and CI/CD) are scaffolded as stubs and should be completed before production.
- Recommended hosting:
  - Frontend: Vercel or Netlify
  - Backend: Render or Heroku-style host
  - Database: MongoDB Atlas

Security
- Never commit secrets. Use environment variables as shown in `.env.example`.

Authentication / Sessions
- This project uses httpOnly cookie-based sessions for authentication. Authentication endpoints (`/api/auth/register`, `/api/auth/login`, `/api/auth/google/callback`) set an httpOnly cookie named `projxpert_session` on successful login. The frontend uses credentialed requests (axios withCredentials) and calls `/api/auth/me` to validate and obtain the authenticated user's profile.
- For local dev the cookie defaults are `SameSite=lax` and `Secure=false`. For production, set `COOKIE_SAMESITE=none` and `COOKIE_FORCE_SECURE=true` (and use HTTPS) so cookies are sent across domains.

Next steps
- Implement full Google OAuth flow and OTP verification
- Wire Cloudinary for file uploads
- Harden auth and add RBAC middleware for admin routes
- Add unit and E2E tests and CI pipeline

Figma (placeholder): https://www.figma.com/file/placeholder/ProjXpert
