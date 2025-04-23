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

app.delete('/api/transactions/:id', verifyToken, async (req, res) => {
  const transactionId = req.params.id;
  try {
    const [result] = await db.execute(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?',
      [transactionId, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transaction not found or unauthorized' });
    }
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    console.error('Delete transaction error:', err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

app.post('/api/budgets/set', verifyToken, async (req, res) => {
  const { category, amount } = req.body;
  try {
    const [existing] = await db.execute(
      'SELECT * FROM budgets WHERE user_id = ? AND category = ?',
      [req.user.id, category]
    );
    if (existing.length > 0) {
      await db.execute(
        'UPDATE budgets SET limit_amount = ? WHERE user_id = ? AND category = ?',
        [amount, req.user.id, category]
      );
    } else {
      await db.execute(
        'INSERT INTO budgets (user_id, category, limit_amount) VALUES (?, ?, ?)',
        [req.user.id, category, amount]
      );
    }
    res.json({ message: 'Budget saved successfully' });
  } catch (err) {
    console.error('Set budget error:', err);
    res.status(500).json({ error: 'Failed to save budget' });
  }
});

app.get('/api/budgets', verifyToken, async (req, res) => {
  try {
    const [budgets] = await db.execute(
      'SELECT category, limit_amount AS amount FROM budgets WHERE user_id = ?',
      [req.user.id]
    );
    res.json(budgets);
  } catch (err) {
    console.error('Fetch budgets error:', err);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

app.post('/api/goals', verifyToken, async (req, res) => {
  const { goal_name, target_amount, deadline } = req.body;
  try {
    await db.execute(
      'INSERT INTO savings_goals (user_id, goal_name, target_amount, deadline) VALUES (?, ?, ?, ?)',
      [req.user.id, goal_name, target_amount, deadline || null]
    );
    res.status(201).json({ message: 'Goal added successfully' });
  } catch (err) {
    console.error('Add goal error:', err);
    res.status(500).json({ error: 'Failed to add goal' });
  }
});

app.get('/api/goals', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM savings_goals WHERE user_id = ? ORDER BY id DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch goals error:', err);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

app.patch('/api/goals/:id/save', verifyToken, async (req, res) => {
  const goalId = req.params.id;
  const { amount } = req.body;
  try {
    const [result] = await db.execute(
      'UPDATE savings_goals SET saved_amount = saved_amount + ? WHERE id = ? AND user_id = ?',
      [amount, goalId, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Goal not found or unauthorized' });
    }
    res.json({ message: 'Saved amount updated successfully' });
  } catch (err) {
    console.error('Error updating saved amount:', err);
    res.status(500).json({ error: 'Failed to update saved amount' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
