const express = require('express');
const multer = require('multer');
const { uploadFile, deleteFile } = require('../controllers/uploadController');
const { authenticateJWT } = require('../controllers/authController');

const router = express.Router();
const { strictLimiter } = require('../middleware/rateLimiter');

// Use memory storage so we can stream to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } }); // 20MB limit

// Protected upload endpoint
router.post('/', authenticateJWT, strictLimiter, upload.single('file'), uploadFile);

// Protected delete endpoint
router.delete('/', authenticateJWT, strictLimiter, deleteFile);

module.exports = router;
