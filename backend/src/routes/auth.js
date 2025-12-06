const express = require('express');
const router = express.Router();
const { strictLimiter } = require('../middleware/rateLimiter');
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');

router.post('/register', strictLimiter, [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], authController.register);

router.post('/login', strictLimiter, [
  body('email').isEmail(),
  body('password').notEmpty()
], authController.login);

// Google OAuth endpoints
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

// logout
router.post('/logout', authController.authenticateJWT, authController.logout);

// optionally expose a route to get current user from token
router.get('/me', authController.authenticateJWT, authController.getMe);
router.put('/me', authController.authenticateJWT, authController.updateMe);

module.exports = router;
