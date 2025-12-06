const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const existing = await User.findOne({ googleId: profile.id });
      if (existing) return done(null, existing);
      const user = await User.create({
        name: profile.displayName,
        email: profile.emails && profile.emails[0] && profile.emails[0].value,
        googleId: profile.id,
        avatarUrl: profile.photos && profile.photos[0] && profile.photos[0].value
      });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));
}

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hash });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });

    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProd || process.env.COOKIE_FORCE_SECURE === 'true',
      sameSite: process.env.COOKIE_SAMESITE || (isProd ? 'none' : 'lax'),
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    res.cookie('projxpert_session', token, cookieOptions);
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });

    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProd || process.env.COOKIE_FORCE_SECURE === 'true',
      sameSite: process.env.COOKIE_SAMESITE || (isProd ? 'none' : 'lax'),
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    res.cookie('projxpert_session', token, cookieOptions);
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Authenticate from Authorization header OR httpOnly cookie named 'projxpert_session'
const authenticateJWT = (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.projxpert_session) {
      token = req.cookies.projxpert_session;
    }
    if (!token) return res.status(401).json({ message: 'Missing token' });
    jwt.verify(token, process.env.JWT_SECRET || 'devsecret', (err, payload) => {
      if (err) return res.status(401).json({ message: 'Invalid token' });
      req.user = payload;
      next();
    });
  } catch (err) {
    console.error('authenticateJWT error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Return full user profile (secure)
const getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error('getMe error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update current user's profile (name, avatarUrl)
const updateMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ message: 'Unauthorized' });
    const updates = {};
    const allowed = ['name', 'avatarUrl'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error('updateMe error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Passport-based Google OAuth entrypoint (middleware)
const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'], session: false });

// Callback handler: issue JWT and set httpOnly secure cookie, then redirect to frontend
const googleCallback = (req, res, next) => {
  const failureRedirect = (process.env.FRONTEND_URL || 'http://localhost:3000') + '/auth/failure';
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) {
      console.error('Google auth error', err);
      return res.redirect(failureRedirect);
    }
    try {
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });

      // Cookie options: secure in production, SameSite configurable (none for cross-site in prod)
      const isProd = process.env.NODE_ENV === 'production';
      const cookieOptions = {
        httpOnly: true,
        secure: isProd || process.env.COOKIE_FORCE_SECURE === 'true',
        sameSite: process.env.COOKIE_SAMESITE || (isProd ? 'none' : 'lax'),
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      };

      res.cookie('projxpert_session', token, cookieOptions);

      const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontend}/auth/success`);
    } catch (e) {
      console.error('Error creating JWT for Google user', e);
      return res.redirect(failureRedirect);
    }
  })(req, res, next);
};

// Logout: clear cookie
const logout = (req, res) => {
  res.clearCookie('projxpert_session', { httpOnly: true, sameSite: process.env.COOKIE_SAMESITE || 'lax' });
  res.json({ ok: true });
};

module.exports = { register, login, authenticateJWT, googleAuth, googleCallback, getMe, updateMe, logout };
