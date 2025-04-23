import Summary from '../components/summary';
import Navbar from '../components/navbar';
import AddTransaction from '../components/addtransaction';
import TransactionList from '../components/transactionlist';
import PieChartComponent from '../components/piechart';
import SetBudget from '../components/setbudget';
import BudgetTracker from '../components/budgettracker';
import SavingsGoals from '../components/savingsgoals'; // ✅ Add this line

import { useState } from 'react';

function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshTransactions = () => setRefreshKey((prev) => prev + 1);

  return (
    <>
      <Navbar />
      <div className="container py-4">

        {/* Summary + Pie Chart */}
        <div className="row mb-4">
          <div className="col-md-6 mb-3 mb-md-0">
            <Summary key={refreshKey} />
          </div>
          <div className="col-md-6">
            <PieChartComponent key={refreshKey} />
          </div>
        </div>

        {/* Budget Set + Tracker */}
        <SetBudget onBudgetSet={refreshTransactions} />
        <BudgetTracker key={refreshKey} />

        {/* Add Transaction */}
        <AddTransaction onTransactionAdded={refreshTransactions} />

        {/* Transactions Table */}
        <TransactionList
          refresh={refreshKey}
          onTransactionDeleted={refreshTransactions}
        />

        {/* Savings Goals Tracker */}
        <SavingsGoals key={refreshKey} /> {/* ✅ New Section */}

      </div>
    </>
  );
}

export default Dashboard;
