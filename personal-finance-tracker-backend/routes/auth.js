const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser); // POST /api/auth/register
router.post('/login', loginUser);       // POST /api/auth/login

// Protected test route
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Access granted ✅', user: req.user });
});

// ✅ Critical: Export the router so Express can use it
module.exports = router;
