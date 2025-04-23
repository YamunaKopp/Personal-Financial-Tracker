const db = require('../db');

// ADD Transaction
exports.addTransaction = (req, res) => {
  const { amount, category, type, description, date } = req.body;
  const userId = req.user.id;

  const sql = `
    INSERT INTO transactions (user_id, amount, category, type, description, date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [userId, amount, category, type, description, date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Transaction added successfully' });
  });
};

// GET Transactions
exports.getTransactions = (req, res) => {
  const userId = req.user.id;

  db.query(
    'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

// DELETE Transaction
exports.deleteTransaction = (req, res) => {
  const userId = req.user.id;
  const transactionId = req.params.id;

  db.query(
    'DELETE FROM transactions WHERE id = ? AND user_id = ?',
    [transactionId, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Transaction not found or not yours' });
      }
      res.json({ message: 'Transaction deleted successfully' });
    }
  );
};
