const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../controllers/authController').authenticateJWT;

router.use(authMiddleware);

router.post('/', [
  body('title').notEmpty(),
  body('description').notEmpty()
], taskController.createTask);

router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
