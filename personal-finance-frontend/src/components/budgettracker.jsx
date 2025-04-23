import { useEffect, useState } from 'react';
import axios from 'axios';

function BudgetTracker() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      try {
        // Fetch budgets
        const budgetRes = await axios.get('http://localhost:5000/api/budgets', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBudgets(budgetRes.data);

        // Fetch expenses
        const txRes = await axios.get('http://localhost:5000/api/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const categoryExpenses = {};
        txRes.data.forEach((tx) => {
          if (tx.type === 'expense') {
            const cat = tx.category || 'Other';
            categoryExpenses[cat] = (categoryExpenses[cat] || 0) + Number(tx.amount);
          }
        });

        setExpenses(categoryExpenses);
      } catch (err) {
        console.error('Error fetching budget or transactions:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="card p-4 shadow-sm mb-4" style={cardStyle}>
      <h4 className="mb-3" style={whiteHeading}>Budget Tracker</h4>

      {budgets.length === 0 ? (
        <p className="text-muted">No budgets set yet.</p>
      ) : (
        budgets.map((b, index) => {
          const spent = expenses[b.category] || 0;
          const percent = Math.min((spent / b.amount) * 100, 100).toFixed(1);
          const isOver = spent > b.amount;

          return (
            <div key={index} className="mb-3">
              <div className="d-flex justify-content-between">
                <strong className="text-white">{b.category}</strong>
                <span className={isOver ? 'text-danger' : 'text-light'}>
                  {spent.toFixed(0)} / {b.amount} ₹
                </span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div
                  className={`progress-bar ${isOver ? 'bg-danger' : 'bg-success'}`}
                  role="progressbar"
                  style={{ width: `${percent}%` }}
                  aria-valuenow={percent}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.04)',
  borderRadius: '1rem',
  border: '1px solid rgba(255, 255, 255, 0.1)',
};

const whiteHeading = {
  color: '#ffffff',
};

export default BudgetTracker;
