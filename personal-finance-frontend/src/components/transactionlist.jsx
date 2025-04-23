import { useEffect, useState } from 'react';
import axios from 'axios';

function TransactionList({ refresh, onTransactionDeleted }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/transactions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
        <div className="table-responsive">
          <table className="table table-dark table-striped table-hover text-white">
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={tx.id}>
                  <td>{index + 1}</td>
                  <td>{tx.description}</td>
                  <td>{tx.category}</td>
                  <td className={tx.type === 'income' ? 'text-success' : 'text-danger'}>
                    {tx.type}
                  </td>
                  <td className="fw-bold">
                    {Number(tx.amount).toLocaleString()} ₹
                  </td>
                  <td>{new Date(tx.date).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(tx.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
