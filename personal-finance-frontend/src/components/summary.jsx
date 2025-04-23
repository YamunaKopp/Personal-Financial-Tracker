import { useEffect, useState } from 'react';
import axios from 'axios';

function Summary() {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/transactions', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        let totalIncome = 0;
        let totalExpense = 0;

        res.data.forEach((tx) => {
          if (tx.type === 'income') {
            totalIncome += Number(tx.amount);
          } else {
            totalExpense += Number(tx.amount);
          }
        });

        setIncome(totalIncome);
        setExpense(totalExpense);
      } catch (err) {
        console.error('Error fetching summary:', err);
      }
    };

    fetchData();
  }, []);

  const balance = income - expense;

  return (
    <div className="card p-4 mb-4 shadow-sm" style={cardStyle}>
      <h4 className="mb-3" style={whiteHeading}>Summary</h4>
      <div className="row text-center">
        <div className="col">
          <h6 style={whiteHeading}>Total Income</h6>
          <p className="fw-bold text-light" style={numberStyle}>
            {income.toLocaleString()} $
          </p>
        </div>
        <div className="col">
          <h6 style={whiteHeading}>Total Expenses</h6>
          <p className="fw-bold text-light" style={numberStyle}>
            {expense.toLocaleString()} $
          </p>
        </div>
        <div className="col">
          <h6 style={whiteHeading}>Balance</h6>
          <p className="fw-bold text-light" style={numberStyle}>
            {balance.toLocaleString()} $
          </p>
        </div>
      </div>
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
  marginBottom: '0.5rem',
};

const numberStyle = {
  fontSize: '1.1rem',
};

export default Summary;
