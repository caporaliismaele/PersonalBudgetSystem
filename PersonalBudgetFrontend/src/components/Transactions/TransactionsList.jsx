import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext.jsx';
import theme from '../../styles/theme.js';

function TransactionsList({ refreshKey, onTransactionDeleted }) {
    const { user } = useContext(AuthContext);

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
        if (!user) return;

        const baseUrl = 'https://localhost:7163/api/transactions';
        const params = new URLSearchParams();

        if (typeFilter !== 'All') params.append('type', typeFilter);
        if (categoryFilter) params.append('category', categoryFilter);

        const startDate = getStartDateFromRange();
        if (startDate) params.append('date', startDate);

        const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

        axios.get(url, {
            withCredentials: true
        })
            .then(response => {
                setTransactions(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching transactions:', error);
                setLoading(false);
            });
    }, [user, typeFilter, categoryFilter, dateRange, refreshKey]);


    useEffect(() => {
        if (!user) return;
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
    }, [user, typeFilter]);

    const handleDelete = (id) => {
        axios.delete(`https://localhost:7163/api/transactions/${id}`, { withCredentials: true })
            .then(() => onTransactionDeleted())
            .catch(error => console.error('Error deleting transaction:', error));
    };

    if (loading) return <div>Loading...</div>;

    const inputStyle = {
        padding: '0.6rem',
        fontSize: '1rem',
        borderRadius: '6px',
        border: `1px solid ${theme.colors.border}`,
        width: '200px',
        marginTop: '0.3rem'
    };

    const labelStyle = {
        fontWeight: 'bold',
        marginBottom: '0.2rem',
        fontSize: '1rem',
        textAlign: 'center'
    };
    const tdStyle = { padding: '0.75rem', border: `1px solid ${theme.colors.border}`, textAlign: 'center' };

    return (
        <div style={{ padding: '2rem', fontFamily: theme.font.family }}>
            <h3 style={{ textAlign: 'center', color: theme.colors.primary, marginBottom: '1.5rem' }}>
                Your Transactions
            </h3>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={labelStyle}>Type</label>
                    <select style={inputStyle} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={labelStyle}>Category</label>
                    <select style={inputStyle} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                        <option value="">All</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={labelStyle}>Date Range</label>
                    <select style={inputStyle} value={dateRange} onChange={e => setDateRange(e.target.value)}>
                        <option value="All">All</option>
                        <option value="1M">Last 1 Month</option>
                        <option value="3M">Last 3 Months</option>
                        <option value="6M">Last 6 Months</option>
                        <option value="1Y">Last 1 Year</option>
                    </select>
                </div>
            </div>

            {transactions.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
                    <thead>
                        <tr style={{ backgroundColor: theme.colors.primary, color: '#fff' }}>
                            {['Description', 'Amount', 'Type', 'Category', 'Date', 'Action'].map(header => (
                                <th key={header} style={{
                                    padding: '0.75rem',
                                    border: `1px solid ${theme.colors.border}`,
                                    textAlign: 'center'
                                }}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(transaction => (
                            <tr key={transaction.id}>
                                <td style={tdStyle}>
                                    {transaction.description}
                                </td>
                                <td style={tdStyle}>
                                    {new Intl.NumberFormat('it-IT', {
                                        style: 'currency',
                                        currency: 'EUR'
                                    }).format(transaction.amount)}
                                </td>
                                <td style={tdStyle}>
                                    {transaction.type}
                                </td>
                                <td style={tdStyle}>
                                    {transaction.category}
                                </td>
                                <td style={tdStyle}>
                                    {new Date(transaction.date).toLocaleDateString('it-IT', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </td>

                                <td style={tdStyle}>
                                    <button
                                        onClick={() => handleDelete(transaction.id)}
                                        style={{
                                            backgroundColor: theme.colors.danger || '#dc3545',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '0.4rem 0.8rem',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p style={{ textAlign: 'center', marginTop: '1rem' }}>No transactions</p>
            )}
        </div>
    );
}

export default TransactionsList;
