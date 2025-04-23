const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = 5000;
const SECRET = 'my_super_secret_key_123!';

app.use(cors());
app.use(express.json());

// ✅ MySQL connection
let db;
async function connectDB() {
  db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Yamuna143@',
    database: 'finance_tracker',
  });
  console.log('Connected to DB');
}
connectDB();

// ✅ JWT Middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ✅ Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    const token = jwt.sign({ id: result.insertId, email }, SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ✅ Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ✅ Get transactions
app.get('/api/transactions', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY id DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch transactions' });
  }
});

// ✅ Add transaction
app.post('/api/transactions', verifyToken, async (req, res) => {
  const { description, amount, type, category } = req.body;
  try {
    await db.execute(
      'INSERT INTO transactions (user_id, description, amount, type, category) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, description, amount, type, category || 'Other']
    );
    res.status(201).json({ message: 'Transaction added' });
  } catch (err) {
    console.error('Add transaction error:', err);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

// ✅ Delete transaction
app.delete('/api/transactions/:id', verifyToken, async (req, res) => {
  const transactionId = req.params.id;

  try {
    console.log(`Attempting to delete transaction ID ${transactionId} for user ${req.user.id}`);
    
    const [result] = await db.execute(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?',
      [transactionId, req.user.id]
    );

    if (result.affectedRows === 0) {
      console.warn('Delete failed: Transaction not found or unauthorized.');
      return res.status(404).json({ error: 'Transaction not found or unauthorized' });
    }

    console.log('Transaction deleted successfully.');
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    console.error('Delete transaction error:', err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
