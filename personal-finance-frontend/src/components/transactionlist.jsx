import { useEffect, useState } from 'react';
import axios from 'axios';

function TransactionList({ refresh, onTransactionDeleted }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/transactions', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTransactions(res.data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };

    fetchData();
  }, [refresh]);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this transaction?');
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      if (onTransactionDeleted) onTransactionDeleted();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete transaction.');
    }
  };

  return (
    <div className="card p-4 shadow-sm mb-4" style={cardStyle}>
      <h4 className="mb-3" style={whiteHeading}>Your Transactions</h4>

      {transactions.length === 0 ? (
        <p className="text-muted">No transactions yet.</p>
      ) : (
        <ul className="list-group">
          {transactions.map((tx) => (
            <li
              key={tx.id}
              className={`list-group-item d-flex justify-content-between align-items-center ${
                tx.type === 'income' ? 'list-group-item-success' : 'list-group-item-danger'
              }`}
            >
              <div>
                <strong>{tx.description}</strong> <br />
                <small className="text-muted">{tx.category}</small>
              </div>

              <div className="d-flex align-items-center">
                <span className="me-3 fw-bold">{Number(tx.amount).toLocaleString()} ₹</span>
                <button
                  className="btn btn-sm btn-outline-light"
                  onClick={() => handleDelete(tx.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
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
  marginBottom: '0.5rem',
};

export default TransactionList;
