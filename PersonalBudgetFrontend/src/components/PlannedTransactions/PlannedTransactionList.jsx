import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext.jsx';
import theme from '../../styles/theme.js';

function PlannedTransactionList({ refreshKey, onPlannedTransactionDeleted }) {
    const { user } = useContext(AuthContext);
    const [plannedTransactions, setPlannedTransactions] = useState([]);
    const [typeFilter, setTypeFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState([]);


    const fetchPlannedTransactions = async () => {
        if (!user) return;
        try {
            const baseUrl = 'https://localhost:7163/api/plannedtransaction';
            const params = new URLSearchParams();

            if (typeFilter !== 'All') params.append('type', typeFilter);
            if (categoryFilter) params.append('category', categoryFilter);

            const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

            const response = await axios.get(url, { withCredentials: true });
            setPlannedTransactions(response.data);
        } catch (error) {
            console.error('Error fetching planned transactions:', error);
        }
    };

    useEffect(() => {
        fetchPlannedTransactions();
    }, [user, refreshKey, typeFilter, categoryFilter]);

    useEffect(() => {
        if (!user || typeFilter === 'All') {
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

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:7163/api/plannedtransaction/${id}`, { withCredentials: true });
            onPlannedTransactionDeleted();
        } catch (error) {
            console.error('Error deleting planned transaction:', error);
        }
    };

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
                Your Planned Transactions
            </h3>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={labelStyle}>Category</label>
                     <select
                            style={inputStyle}
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                     >
                        <option value="">All</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={labelStyle}>Type</label>
                    <select style={inputStyle} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                </div>
            </div>

            {plannedTransactions.length > 0 ? (
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    backgroundColor: '#fff',
                    boxShadow: theme.shadow.light,
                }}>
                    <thead style={{ backgroundColor: '#f0f0f0' }}>
                        <tr style={{ backgroundColor: theme.colors.primary, color: '#fff' }}>
                            {['Description', 'Amount', 'Category', 'Type', 'Activation Day', 'Action'].map(header => (
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
                        {plannedTransactions.map(pt => (
                            <tr key={pt.id} style={{ textAlign: 'center' }}>
                                <td style={tdStyle}>{pt.description}</td>
                                <td style={tdStyle}>{pt.amount}</td>
                                <td style={tdStyle}>{pt.category}</td>
                                <td style={tdStyle}>{pt.type}</td>
                                <td style={tdStyle}>{pt.dayOfMonth}</td>
                                <td style={tdStyle}>
                                    <button
                                        onClick={() => handleDelete(pt.id)}
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
                <p style={{ textAlign: 'center' }}>No Planned Transactions</p>
            )}
        </div>
    );
}

export default PlannedTransactionList;
