// RBAC middleware helpers
const User = require('../models/User');

// Ensure the request is authenticated (expects authenticateJWT earlier in pipeline)
const requireRole = (role) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) return res.status(401).json({ message: 'Unauthorized' });
      // Optionally fetch latest user record to verify role hasn't changed
      const user = await User.findById(req.user.id).select('role');
      if (!user) return res.status(401).json({ message: 'Unauthorized' });
      if (user.role !== role) return res.status(403).json({ message: 'Forbidden: insufficient role' });
      // attach resolved role
      req.user.role = user.role;
      next();
    } catch (err) {
      console.error('RBAC error', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
};

module.exports = { requireRole };
