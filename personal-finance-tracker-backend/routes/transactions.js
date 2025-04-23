const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { addTransaction, getTransactions, deleteTransaction } = require('../controllers/transactionController');

// Add a transaction
router.post('/add', verifyToken, addTransaction);

// Get all transactions for the logged-in user
router.get('/', verifyToken, getTransactions);

// Delete a transaction by ID
router.delete('/:id', verifyToken, deleteTransaction);

module.exports = router;
