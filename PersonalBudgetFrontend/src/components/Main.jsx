import React, { useState } from 'react';
import Balance from './Transactions/Balance.jsx';
import TransactionsList from './Transactions/TransactionsList.jsx';
import AddTransaction from './Transactions/AddTransaction.jsx';
import CategoriesList from './Categories/CategoriesList.jsx';
import AddCategory from './Categories/AddCategory.jsx';
import AddPlannedTransaction from './PlannedTransactions/AddPlannedTransaction.jsx';
import PlannedTransactionList from './PlannedTransactions/PlannedTransactionList.jsx';
import IncomeExpenseRatio from './PlannedTransactions/IncomeExpenseRatio.jsx';
import Charts from './Charts/Charts.jsx';
import theme from '../styles/theme.js';

function Main() {
    const [activeTab, setActiveTab] = useState('Transactions');
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <div className="container py-4" style={{ fontFamily: theme.font.family }}>
            {/* Tab Navigation */}
            <ul className="nav nav-pills mb-4 justify-content-center">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'Transactions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Transactions')}
                    >
                        Transactions
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'Categories' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Categories')}
                    >
                        Categories
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'PlannedTransactions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('PlannedTransactions')}
                    >
                        Planned Transactions
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'Charts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Charts')}
                    >
                        Charts
                    </button>
                </li>
            </ul>

            {/* Content Area */}
            <div className="card shadow-sm p-4 rounded" style={{ backgroundColor: theme.colors.background }}>
                {activeTab === 'Transactions' && (
                    <div key={refreshKey}>
                        <Balance refreshKey={refreshKey} />
                        <AddTransaction refreshKey={refreshKey} onTransactionAdded={handleRefresh} />
                        <TransactionsList refreshKey={refreshKey} onTransactionDeleted={handleRefresh} />
                    </div>
                )}

                {activeTab === 'Categories' && (
                    <div key={refreshKey}>
                        <AddCategory onCategoryAdded={handleRefresh} />
                        <CategoriesList refreshKey={refreshKey} onCategoryDeleted={handleRefresh} />
                    </div>
                )}

                {activeTab === 'PlannedTransactions' && (
                    <div key={refreshKey}>
                        <IncomeExpenseRatio refreshKey={refreshKey} />
                        <AddPlannedTransaction refreshKey={refreshKey} onPlannedTransactionAdded={handleRefresh} />
                        <PlannedTransactionList refreshKey={refreshKey} onPlannedTransactionDeleted={handleRefresh} />
                    </div>
                )}

                {activeTab === 'Charts' && (
                    <div>
                        <Charts />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Main;
