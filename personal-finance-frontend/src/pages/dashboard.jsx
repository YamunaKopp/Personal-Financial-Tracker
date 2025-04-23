import Summary from '../components/summary';
import Navbar from '../components/navbar';
import AddTransaction from '../components/addtransaction';
import TransactionList from '../components/transactionlist';
import PieChartComponent from '../components/piechart';
import { useState } from 'react';

function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshTransactions = () => setRefreshKey((prev) => prev + 1);

  return (
    <>
      <Navbar />
      <div className="container py-4">

        {/* Summary + Pie Chart side-by-side on large screens */}
        <div className="row mb-4">
          <div className="col-md-6 mb-3 mb-md-0">
            <Summary key={refreshKey} />
          </div>
          <div className="col-md-6">
            <PieChartComponent key={refreshKey} />
          </div>
        </div>

        {/* Add Transaction */}
        <AddTransaction onTransactionAdded={refreshTransactions} />

        {/* List of Transactions */}
        <TransactionList
          refresh={refreshKey}
          onTransactionDeleted={refreshTransactions}
        />
      </div>
    </>
  );
}

export default Dashboard;
