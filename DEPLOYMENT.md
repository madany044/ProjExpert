# DEPLOYMENT GUIDE — ProjXpert

This guide shows a pragmatic route to deploy the ProjXpert full‑stack app using Vercel (frontend) and Render (backend) with MongoDB Atlas and Cloudinary.

Security: This guide assumes you use HTTPS in production and set cookie options accordingly (SameSite=None, Secure=true).

## 1) Production secrets (store in your host's secret manager)

Required env vars for backend (Render/Heroku/etc):

- MONGODB_URI — MongoDB Atlas connection string
- JWT_SECRET — a strong secret
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- FRONTEND_URL — e.g. https://your-frontend.vercel.app
- NODE_ENV=production
- COOKIE_SAMESITE=none
- COOKIE_FORCE_SECURE=true

Optional / monitoring
- SENTRY_DSN, NEW_RELIC_KEY, etc.

## 2) Backend (Render)

1. Create a new Web Service on Render, connect your GitHub repo and branch.
2. Set the Build Command: `npm install && npm run build` (if you have server build steps) or simply `npm install`.
3. Set the Start Command: `npm start`.
4. Add the environment variables from section 1.
5. Configure health checks (e.g., `/api/health`).

Notes: Ensure CORS origin `FRONTEND_URL` is set to your frontend URL. Cookies require HTTPS and SameSite=None in production.

## 3) Frontend (Vercel)

1. Create a new Vercel project and link the same repo (frontend folder as root if monorepo).
2. Set build command: `npm install && npm run build` and output directory: `dist` (webpack builds there).
3. Set environment variable `REACT_APP_API_URL` to your backend base URL (e.g. `https://api.yourapp.com/api` or just `/api` if using a custom domain and proxy).
4. Deploy.

Cookie cross-site notes:
- If frontend and backend are on different domains, cookies must be set with `SameSite=None` and `secure=true`. Ensure `FRONTEND_URL` is set in the backend and `COOKIE_SAMESITE=none` and `COOKIE_FORCE_SECURE=true`.

## 4) Cloudinary

1. Create a Cloudinary account and set the env vars in your backend service.
2. Optionally create upload presets for unsigned uploads (if using direct client uploads).

## 5) MongoDB Atlas

1. Create a cluster and a database user; add your Render/Vercel IPs to IP access list (or allow access from anywhere with caution).
2. Copy the connection string and set `MONGODB_URI` in Render.

## 6) Post-deploy checks

- Test register/login flows in production.
- Confirm cookies appear with `SameSite=None` and `Secure` in browser devtools.
- Test uploads and admin orphan cleanup.

## 7) Optional production hardening

- Use signed direct uploads to Cloudinary to offload file handling from your server.
- Add content scanning (virus) for attachments if required by policy.
- Add logging/monitoring and daily backups for MongoDB.

---
This file is a minimal deployment checklist. If you'd like, I can generate render/vercel-specific YAML or GitHub Actions scripts to fully automate deploys.
Deployment notes

Frontend (Vercel / Netlify)
- Build command: `npm run build`
- Publish directory: `dist`
- Ensure environment variables (API base URL) are set in the hosting UI.

Backend (Render / Heroku / Render)
- Start command: `npm start` (ensure `NODE_ENV=production` and `PORT` defined)
- Set environment variables in the service: MONGODB_URI, JWT_SECRET, GOOGLE_CLIENT_ID/SECRET, CLOUDINARY_*, OPENAI_API_KEY

MongoDB Atlas
- Create a cluster and a database named `projxpert`
- Add a user and whitelist the backend host IPs (or allow 0.0.0.0/0 for quick dev)
- Use the connection string in `.env` as MONGODB_URI

CORS & Networking
- Configure CORS on the backend to allow your frontend domain(s).
- Configure the Socket.io client to connect to the backend URL and ensure websockets are enabled in your host provider.

Cookies / Session notes
- When using httpOnly cookies for session tokens across different domains (frontend and backend on different hosts), browsers require `SameSite=None` and `Secure` for the cookie. Set these in your environment:
	- `COOKIE_SAMESITE=none`
	- `COOKIE_FORCE_SECURE=true` (or ensure NODE_ENV=production so secure is used)
	- `FRONTEND_URL` must match your frontend domain and be set on the backend so CORS allows it.

CI/CD
- Add GitHub actions to run tests and build apps.
- Use secrets store in your hosting provider for API keys.
