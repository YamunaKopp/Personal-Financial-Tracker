const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  addOrUpdateBudget,
  getBudgets
} = require('../controllers/budgetController');

// Add or update a budget
router.post('/set', verifyToken, addOrUpdateBudget);

// Get all budgets for user
router.get('/', verifyToken, getBudgets);

module.exports = router;
