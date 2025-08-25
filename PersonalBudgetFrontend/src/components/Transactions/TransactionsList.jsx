import React, { useEffect, useState } from 'react';
import axios from 'axios';
import css from '../../styles/css.js';

function TransactionsList({ refreshKey, onTransactionDeleted }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState([]);
    const [dateRange, setDateRange] = useState('All');

    const getStartDateFromRange = () => {
        const now = new Date();
        switch (dateRange) {
            case '1M': now.setMonth(now.getMonth() - 1); break;
            case '3M': now.setMonth(now.getMonth() - 3); break;
            case '6M': now.setMonth(now.getMonth() - 6); break;
            case '1Y': now.setFullYear(now.getFullYear() - 1); break;
            default: return '';
        }
        return now.toISOString().split('T')[0];
    };

    useEffect(() => {
        const baseUrl = 'https://localhost:7163/api/transactions';
        const params = new URLSearchParams();

        if (typeFilter !== 'All') params.append('type', typeFilter);
        if (categoryFilter) params.append('category', categoryFilter);

        const startDate = getStartDateFromRange();
        if (startDate) params.append('date', startDate);

        const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

        axios.get(url, { withCredentials: true })
            .then(response => {
                setTransactions(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching transactions:', error);
                setLoading(false);
            });
    }, [typeFilter, categoryFilter, dateRange, refreshKey]);

    useEffect(() => {
        if (typeFilter === 'All') {
            setCategories([]);
            setCategoryFilter('');
            return;
        }

        axios.get(`https://localhost:7163/api/categories?type=${typeFilter}`, { withCredentials: true })
            .then(response => {
                setCategories(response.data);
                setCategoryFilter('');
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, [typeFilter]);

    const handleDelete = (id) => {
        axios.delete(`https://localhost:7163/api/transactions/${id}`, { withCredentials: true })
            .then(() => onTransactionDeleted())
            .catch(error => console.error('Error deleting transaction:', error));
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={css.categoriesWrapper}>
            <h3 style={css.categoriesTitle}>Your Transactions</h3>

            <div style={css.filterGroup}>
                <div style={css.filterField}>
                    <label style={css.formLabel}>Type</label>
                    <select style={css.formSelect} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                </div>

                <div style={css.filterField}>
                    <label style={css.formLabel}>Category</label>
                    <select style={css.formSelect} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                        <option value="">All</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
                    </select>
                </div>

                <div style={css.filterField}>
                    <label style={css.formLabel}>Date Range</label>
                    <select style={css.formSelect} value={dateRange} onChange={e => setDateRange(e.target.value)}>
                        <option value="All">All</option>
                        <option value="1M">Last 1 Month</option>
                        <option value="3M">Last 3 Months</option>
                        <option value="6M">Last 6 Months</option>
                        <option value="1Y">Last 1 Year</option>
                    </select>
                </div>
            </div>

            {transactions.length > 0 ? (
                <table style={css.table}>
                    <thead>
                        <tr style={css.tableHeader}>
                            {['Description', 'Amount', 'Type', 'Category', 'Date', 'Action'].map(header => (
                                <th key={header} style={css.tableCell}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(transaction => (
                            <tr key={transaction.id}>
                                <td style={css.tableCell}>{transaction.description}</td>
                                <td style={css.tableCell}>
                                    {new Intl.NumberFormat('it-IT', {
                                        style: 'currency',
                                        currency: 'EUR'
                                    }).format(transaction.amount)}
                                </td>
                                <td style={css.tableCell}>{transaction.type}</td>
                                <td style={css.tableCell}>{transaction.category}</td>
                                <td style={css.tableCell}>
                                    {new Date(transaction.date).toLocaleDateString('it-IT', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </td>
                                <td style={css.tableCell}>
                                    <button style={css.deleteButton} onClick={() => handleDelete(transaction.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p style={css.emptyMessage}>No transactions</p>
            )}
        </div>
    );
}

export default TransactionsList;
