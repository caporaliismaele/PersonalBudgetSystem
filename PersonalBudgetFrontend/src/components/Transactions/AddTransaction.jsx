import React, { useState, useEffect } from 'react';
import axios from 'axios';
import css from '../../styles/css.js';

function AddTransaction({ refreshKey, onTransactionAdded }) {
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: '',
        type: 'Income',
        date: today,
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios
            .get('https://localhost:7163/api/categories', { withCredentials: true })
            .then((response) => {
                const filtered = response.data.filter((c) => c.type === formData.type);
                setCategories(filtered);
                if (!filtered.find((c) => c.name === formData.category)) {
                    setFormData((prev) => ({ ...prev, category: filtered[0]?.name || '' }));
                }
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, [formData.type, refreshKey]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.description.trim()) {
            alert('La descrizione è obbligatoria.');
            return;
        }

        if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
            alert('Inserisci un importo valido maggiore di zero.');
            return;
        }

        if (!formData.category) {
            alert('Seleziona una categoria.');
            return;
        }

        const newTransaction = {
            ...formData,
            amount: parseFloat(formData.amount),
        };

        axios
            .post('https://localhost:7163/api/transactions', newTransaction, { withCredentials: true })
            .then((response) => {
                onTransactionAdded();
            })
            .catch((error) => {
                console.error('Errore nell’aggiunta della transazione:', error);
            });
    };

    return (
        <form onSubmit={handleSubmit} style={css.formWrapper}>
            <h3 style={css.formTitle}>Add Transaction</h3>

            <div style={css.formGroup}>
                <div style={css.formField}>
                    <label style={css.formLabel}>Description</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        style={{ ...css.formInput, width: '140px' }}
                    />
                </div>

                <div style={css.formField}>
                    <label style={css.formLabel}>Amount</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        style={{ ...css.formInput, width: '140px' }}
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
                    >
                        <option value="">-- Select --</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={css.formField}>
                    <label style={css.formLabel}>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        style={{ ...css.formInput, width: '140px' }}
                    />
                </div>
            </div>

            <button type="submit" style={{ ...css.formButton, minWidth: '160px' }}>
                Add Transaction
            </button>
        </form>
    );
}

export default AddTransaction;
