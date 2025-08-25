import React, { useState, useEffect } from 'react';
import axios from 'axios';
import css from '../../styles/css.js';

function PlannedTransactionList({ refreshKey, onPlannedTransactionDeleted }) {
    const [plannedTransactions, setPlannedTransactions] = useState([]);
    const [typeFilter, setTypeFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState([]);

    const fetchPlannedTransactions = async () => {
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
    }, [refreshKey, typeFilter, categoryFilter]);

    useEffect(() => {
        if (typeFilter === 'All') {
            setCategories([]);
            setCategoryFilter('');
            return;
        }

        axios
            .get(`https://localhost:7163/api/categories?type=${typeFilter}`, { withCredentials: true })
            .then((response) => {
                setCategories(response.data);
                setCategoryFilter('');
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, [typeFilter]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:7163/api/plannedtransaction/${id}`, { withCredentials: true });
            onPlannedTransactionDeleted();
        } catch (error) {
            console.error('Error deleting planned transaction:', error);
        }
    };

    return (
        <div style={css.categoriesWrapper}>
            <h3 style={css.categoriesTitle}>Your Planned Transactions</h3>

            <div style={css.filterGroup}>
                <div style={css.filterField}>
                    <label style={css.formLabel}>Category</label>
                    <select
                        style={css.formSelect}
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={css.filterField}>
                    <label style={css.formLabel}>Type</label>
                    <select style={css.formSelect} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                </div>
            </div>

            {plannedTransactions.length > 0 ? (
                <table style={css.table}>
                    <thead style={css.tableHeader}>
                        <tr>
                            {['Description', 'Amount', 'Category', 'Type', 'Activation Day', 'Action'].map((header) => (
                                <th key={header} style={css.tableCell}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {plannedTransactions.map((pt) => (
                            <tr key={pt.id}>
                                <td style={css.tableCell}>{pt.description}</td>
                                <td style={css.tableCell}>{pt.amount}</td>
                                <td style={css.tableCell}>{pt.category}</td>
                                <td style={css.tableCell}>{pt.type}</td>
                                <td style={css.tableCell}>{pt.dayOfMonth}</td>
                                <td style={css.tableCell}>
                                    <button style={css.deleteButton} onClick={() => handleDelete(pt.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p style={css.emptyMessage}>No Planned Transactions</p>
            )}
        </div>
    );
}

export default PlannedTransactionList;
