const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../controllers/authController');
const { requireRole } = require('../middleware/rbac');
const Task = require('../models/Task');
const cloudinary = require('../services/cloudinary');

// List attachments referenced by tasks
router.get('/attachments', authenticateJWT, requireRole('admin'), async (req, res) => {
  try {
    const tasks = await Task.find({}, 'attachments title');
    const attachments = [];
    tasks.forEach(t => {
      (t.attachments || []).forEach(a => attachments.push({ taskId: t._id, taskTitle: t.title, ...a }));
    });
    res.json({ attachments });
  } catch (err) {
    console.error('Admin attachments error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Optionally compare with cloud resources to find orphans (careful in prod)
router.get('/attachments/cloud', authenticateJWT, requireRole('admin'), async (req, res) => {
  try {
    // fetch Cloudinary resources in the projxpert folder (paginated)
    const resources = [];
    let next_cursor = null;
    do {
      const resp = await cloudinary.api.resources({ type: 'upload', prefix: 'projxpert', max_results: 500, next_cursor });
      resources.push(...(resp.resources || []));
      next_cursor = resp.next_cursor;
    } while (next_cursor);

    // get referenced public_ids in DB
    const tasks = await Task.find({}, 'attachments');
    const referenced = new Set();
    tasks.forEach(t => (t.attachments || []).forEach(a => { if (a.public_id) referenced.add(a.public_id); }));

    const cloudOnly = resources.filter(r => !referenced.has(r.public_id));
    res.json({ cloudCount: resources.length, referencedCount: referenced.size, orphaned: cloudOnly.map(r => ({ public_id: r.public_id, url: r.secure_url })) });
  } catch (err) {
    console.error('Admin cloud compare error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk delete attachments from Cloudinary and remove references from tasks
router.post('/attachments/delete', authenticateJWT, requireRole('admin'), async (req, res) => {
  try {
    const { public_ids } = req.body;
    if (!Array.isArray(public_ids) || public_ids.length === 0) return res.status(400).json({ message: 'public_ids required' });
    const results = [];
    for (const pid of public_ids) {
      try {
        const r = await cloudinary.uploader.destroy(pid);
        // remove references from tasks
        await Task.updateMany({ 'attachments.public_id': pid }, { $pull: { attachments: { public_id: pid } } });
        results.push({ public_id: pid, result: r });
      } catch (err) {
        results.push({ public_id: pid, error: String(err) });
      }
    }
    res.json({ results });
  } catch (err) {
    console.error('Admin delete attachments error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin-only stats endpoint
router.get('/stats', authenticateJWT, requireRole('admin'), async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const open = await Task.countDocuments({ status: 'open' });
    const inProgress = await Task.countDocuments({ status: 'in_progress' });
    res.json({ total, open, inProgress });
  } catch (err) {
    console.error('Admin stats error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
