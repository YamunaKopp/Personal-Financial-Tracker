const db = require('../db');

// ADD or UPDATE budget
exports.addOrUpdateBudget = (req, res) => {
  const { category, limit_amount, month_year } = req.body;
  const user_id = req.user.id;

  const sql = `
    INSERT INTO budgets (user_id, category, limit_amount, month_year)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE limit_amount = VALUES(limit_amount)
  `;

  db.query(sql, [user_id, category, limit_amount, month_year], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Budget saved successfully' });
  });
};

// GET budgets
exports.getBudgets = (req, res) => {
  const user_id = req.user.id;

  db.query(
    'SELECT * FROM budgets WHERE user_id = ? ORDER BY month_year DESC',
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};
