const Task = require('../models/Task');
const { validationResult } = require('express-validator');

const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const payload = req.body || {};
    payload.student = req.user.id;
    // attachments may come as JSON array from frontend; ensure it's an array of objects
    if (payload.attachments && !Array.isArray(payload.attachments)) {
      try { payload.attachments = JSON.parse(payload.attachments); } catch (e) { payload.attachments = []; }
    }
    // enforce a max attachments per task
    if (Array.isArray(payload.attachments) && payload.attachments.length > 10) {
      return res.status(400).json({ message: 'Too many attachments (max 10)' });
    }
    const task = await Task.create(payload);
    // future: emit socket event
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTasks = async (req, res) => {
  try {
    const { role, id } = req.user;
    let filter = {};
    if (role !== 'admin') filter.student = id;
    const tasks = await Task.find(filter).populate('student', 'name email');
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('student', 'name email');
    if (!task) return res.status(404).json({ message: 'Not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const updates = req.body || {};
    if (updates.attachments && !Array.isArray(updates.attachments)) {
      try { updates.attachments = JSON.parse(updates.attachments); } catch (e) { updates.attachments = []; }
    }
    if (Array.isArray(updates.attachments) && updates.attachments.length > 10) {
      return res.status(400).json({ message: 'Too many attachments (max 10)' });
    }
    const updated = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
