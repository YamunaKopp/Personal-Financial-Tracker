import { useState } from 'react';
import axios from 'axios';

function AddTransaction({ onTransactionAdded }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('Other');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in again.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/transactions',
        { description, amount, type, category, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDescription('');
      setAmount('');
      setType('income');
      setCategory('Other');
      setDate(new Date().toISOString().slice(0, 10));
      onTransactionAdded();
    } catch (err) {
      console.error('Failed to add transaction:', err);
      alert('Failed to add transaction');
    }
  };

  return (
    <form
      className="card p-4 shadow-sm mb-4"
      onSubmit={handleSubmit}
      style={cardStyle}
    >
      <h4 className="mb-3" style={whiteHeading}>Add Transaction</h4>

      <input
        className="form-control mb-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="form-control mb-2"
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select
        className="form-select mb-2"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {type === 'expense' && (
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
      )}

      <input
        className="form-control mb-3"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button className="btn btn-success w-100">Add</button>
    </form>
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

export default AddTransaction;
