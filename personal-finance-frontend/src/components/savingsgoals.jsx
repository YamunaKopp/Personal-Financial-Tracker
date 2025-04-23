import { useEffect, useState } from 'react';
import axios from 'axios';

function SavingsGoals() {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savingsInputs, setSavingsInputs] = useState({});

  const fetchGoals = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/goals', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setGoals(res.data);
    } catch (err) {
      console.error('Failed to fetch goals:', err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        'http://localhost:5000/api/goals',
        {
          goal_name: goalName,
          target_amount: targetAmount,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setGoalName('');
      setTargetAmount('');
      fetchGoals();
    } catch (err) {
      console.error('Failed to add goal:', err);
      alert('Failed to add goal.');
    }
  };

  const handleSaveAmount = async (goalId) => {
    const amount = savingsInputs[goalId];

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return alert('Enter a valid amount');
    }

    try {
      await axios.patch(
        `http://localhost:5000/api/goals/${goalId}/save`,
        { amount },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setSavingsInputs({ ...savingsInputs, [goalId]: '' });
      fetchGoals();
    } catch (err) {
      console.error('Failed to update savings:', err);
      alert('Failed to update savings.');
    }
  };

  return (
    <div className="card p-4 shadow-sm mb-4" style={cardStyle}>
      <h4 className="mb-3" style={whiteHeading}>Savings Goals</h4>

      {/* Add Goal Form */}
      <form onSubmit={handleAddGoal} className="mb-4">
        <div className="row g-2">
          <div className="col-sm">
            <input
              className="form-control"
              placeholder="Goal Name"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              required
            />
          </div>
          <div className="col-sm">
            <input
              className="form-control"
              type="number"
              placeholder="Target Amount"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
            />
          </div>
          <div className="col-sm-auto">
            <button className="btn btn-primary w-100">Add</button>
          </div>
        </div>
      </form>

      {/* List of Goals */}
      {goals.length === 0 ? (
        <p className="text-muted">No savings goals yet.</p>
      ) : (
        goals.map((goal) => {
          const progress = ((goal.saved_amount || 0) / goal.target_amount) * 100;

          return (
            <div key={goal.id} className="mb-4">
              <div className="d-flex justify-content-between mb-1">
                <strong className="text-white">{goal.goal_name}</strong>
                <span className="text-white fw-light">
                  {goal.saved_amount || 0} / {goal.target_amount} ₹
                </span>
              </div>
              <div className="progress mb-2" style={{ height: '8px' }}>
                <div
                  className="progress-bar bg-success"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>

              {/* Add Savings Inline Input */}
              <div className="row g-2 align-items-center">
                <div className="col">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Add savings"
                    value={savingsInputs[goal.id] || ''}
                    onChange={(e) =>
                      setSavingsInputs({ ...savingsInputs, [goal.id]: e.target.value })
                    }
                  />
                </div>
                <div className="col-auto">
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => handleSaveAmount(goal.id)}
                  >
                    Add
                  </button>
                </div>
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
  marginBottom: '0.5rem',
};

export default SavingsGoals;
