const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;

  // 1. Check if user exists
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (results.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert user into DB
    db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(201).json({ message: 'User registered successfully' });
      }
    );
  });
};

// LOGIN
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  // 1. Find user
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      'your_jwt_secret', // Replace with env variable later
      { expiresIn: '1d' }
    );

    return res.json({ message: 'Login successful', token });
  });
};
