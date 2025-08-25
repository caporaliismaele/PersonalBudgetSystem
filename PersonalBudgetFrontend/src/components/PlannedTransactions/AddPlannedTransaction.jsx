import React, { useState, useEffect } from 'react';
import axios from 'axios';
import css from '../../styles/css.js';

function AddPlannedTransaction({ refreshKey, onPlannedTransactionAdded }) {
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        type: 'Income',
        dayOfMonth: 1,
        category: '',
        description: '',
    });

    const [categories, setCategories] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                amount: parseFloat(formData.amount),
                dayOfMonth: parseInt(formData.dayOfMonth),
            };
            const response = await axios.post('https://localhost:7163/api/plannedtransaction', payload, {
                withCredentials: true
            });
            onPlannedTransactionAdded(response.data);
            setFormData({
                name: '',
                amount: '',
                type: 'Income',
                dayOfMonth: 1,
                category: '',
                description: '',
            });
        } catch (error) {
            console.error('Error adding planned transaction:', error);
        }
    };

    const fetchCategories = async (type) => {
        try {
            const response = await axios.get('https://localhost:7163/api/categories', {
                withCredentials: true
            });
            const filtered = response.data.filter(c => c.type === type);
            setCategories(filtered);
            if (!filtered.find(c => c.name === formData.category)) {
                setFormData(prev => ({
                    ...prev,
                    category: filtered[0]?.name || ''
                }));
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories(formData.type);
    }, [formData.type, refreshKey]);

    return (
        <form onSubmit={handleSubmit} style={css.formWrapper}>
            <h3 style={css.formTitle}>Add Planned Transaction</h3>

            <p style={css.formSubtitle}>
                The Planned Transaction created will create a transaction with a monthly frequence
            </p>

            <div style={css.formGroup}>
                <div style={css.formField}>
                    <label style={css.formLabel}>Description</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description"
                        style={{ ...css.formInput, width: '140px' }}
                        required
                    />
                </div>

                <div style={css.formField}>
                    <label style={css.formLabel}>Amount</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="Amount"
                        style={{ ...css.formInput, width: '140px' }}
                        required
                    />
                </div>

                <div style={css.formField}>
                    <label style={css.formLabel}>Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        style={{ ...css.formInput, width: '140px' }}
                    >
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                </div>

                <div style={css.formField}>
                    <label style={css.formLabel}>Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        style={{ ...css.formInput, width: '140px' }}
                        required
                    >
                        <option value="">-- Select a category --</option>
                        {categories.length === 0 && <option disabled>No categories</option>}
                        {categories.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div style={css.formField}>
                    <label style={css.formLabel}>Activation Day</label>
                    <input
                        type="number"
                        name="dayOfMonth"
                        min="1"
                        max="31"
                        value={formData.dayOfMonth}
                        onChange={handleChange}
                        placeholder="Day of Month"
                        style={{ ...css.formInput, width: '140px' }}
                        required
                    />
                </div>

                <button type="submit" style={{ ...css.formButton, minWidth: '160px' }}>
                    Add Planned Transaction
                </button>
            </div>
        </form>
    );
}

export default AddPlannedTransaction;
