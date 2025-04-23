import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#34d399', // income (green)
  '#f87171', '#fbbf24', '#60a5fa', '#c084fc',
  '#f472b6', '#a78bfa', '#fb923c', '#4ade80' // expense categories
];

function PieChartComponent() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/transactions', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const incomeTotal = res.data
          .filter((tx) => tx.type === 'income')
          .reduce((sum, tx) => sum + Number(tx.amount), 0);

        const expenseMap = {};

        res.data.forEach((tx) => {
          if (tx.type === 'expense') {
            const category = tx.category?.trim() || 'Other';
            expenseMap[category] = (expenseMap[category] || 0) + Number(tx.amount);
          }
        });

        const data = [
          { name: 'Income', value: incomeTotal }, // ✅ single income slice
          ...Object.entries(expenseMap).map(([name, value]) => ({
            name,
            value,
          })),
        ];

        setChartData(data);
      } catch (err) {
        console.error('Pie chart fetch failed:', err);
      }
    };

    fetchTransactions();
  }, []);

  const hasData = chartData.some((entry) => entry.value > 0);

  return (
    <div
      className="card p-4 shadow-sm mb-4"
      style={{
        background: 'rgba(255, 255, 255, 0.04)',
        borderRadius: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <h4 style={{ color: '#fff' }} className="mb-3">Transaction Overview</h4>

      {!hasData ? (
        <p className="text-muted">No data to display yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default PieChartComponent;
