import { useState } from 'react';
import axios from 'axios';

function SetBudget({ onBudgetSet }) {
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        'http://localhost:5000/api/budgets/set',
        { category, amount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setAmount('');
      if (onBudgetSet) onBudgetSet();
      alert('Budget saved!');
    } catch (err) {
      console.error('Set budget failed:', err);
      alert('Failed to save budget.');
    }
  };

  return (
    <form
      className="card p-4 shadow-sm mb-4"
      onSubmit={handleSubmit}
      style={{
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '1rem',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <h4 className="mb-3" style={{ color: '#fff' }}>Set Budget</h4>

      <select
        className="form-select mb-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Food">Food</option>
        <option value="Rent">Rent</option>
        <option value="Utilities">Utilities</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="number"
        className="form-control mb-3"
        placeholder="Budget Amount (₹)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button className="btn btn-success w-100">Save Budget</button>
    </form>
  );
}

export default SetBudget;
