require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/uploads');

const app = express();

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(helmet());

// Content Security Policy: allow only frontend and trusted external resources (Cloudinary for images)
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryUrl = cloudName ? `https://res.cloudinary.com/${cloudName}` : 'https://res.cloudinary.com';
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'"],
			connectSrc: ["'self'", FRONTEND],
			imgSrc: ["'self'", 'data:', cloudinaryUrl],
			styleSrc: ["'self'", "'unsafe-inline'", FRONTEND],
			fontSrc: ["'self'", 'https:', 'data:'],
			objectSrc: ["'none'"],
			upgradeInsecureRequests: [],
		}
	})
);

app.use(cors({ 
  origin: (origin, callback) => {
    // Allow localhost for development, Vercel for production, or if no origin
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000',
      process.env.FRONTEND_URL,
      'https://proj-expert-mauve.vercel.app',
      'https://proj-expert-git-main-madans-projects-061a6083.vercel.app'
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);

// Simple health
app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

module.exports = app;
