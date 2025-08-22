import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext.jsx';
import theme from '../../styles/theme.js';



function AddTransaction({ refreshKey, onTransactionAdded }) {
    const today = new Date().toISOString().split('T')[0];
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: '',
        type: 'Income',
        date: today,
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (user) {
            axios.get('https://localhost:7163/api/categories', { withCredentials: true })
                .then(response => {
                const filtered = response.data.filter(c => c.type === formData.type);
                setCategories(filtered);
                if (!filtered.find(c => c.name === formData.category)) {
                    setFormData(prev => ({ ...prev, category: filtered[0]?.name || '' }));
                }
            }).catch(error => {
                console.error('Error fetching categories:', error);
            });
        }
    }, [user, formData.type, refreshKey]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
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

        console.log("Dati inviati:", newTransaction);
        axios.post('https://localhost:7163/api/transactions', newTransaction, { withCredentials: true })
            .then(response => {
                console.log('Transaction added:', response.data);
                onTransactionAdded();
            })
            .catch(error => {
                console.error('Errore nell’aggiunta della transazione:', error);
            });
        };

    const inputStyle = {
        padding: '0.4rem 0.6rem',
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '6px',
        fontSize: theme.font.size,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        width: '140px',
        textAlign: 'center',
        backgroundColor: '#fff',
        appearance: 'none', // uniforma i select
    };

    const labelStyle = {
        textAlign: 'center',
        fontWeight: '500',
        color: theme.colors.text,
        marginBottom: '0.4rem',
    };

    const fieldStyle = {
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: theme.spacing.margin, // spaziatura verticale tra i campi

    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                backgroundColor: theme.colors.background,
                padding: theme.spacing.padding,
                borderRadius: '8px',
                fontFamily: theme.font.family,
                maxWidth: '800px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <h3 style={{
                color: theme.colors.primary,
                textAlign: 'center',
                marginBottom:'1.5rem',
            }}>
                Add Transaction
            </h3>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: theme.spacing.gap,
                    marginBottom: theme.spacing.margin,
                }}
            >
                <div style={fieldStyle}>
                    <label style={labelStyle}>Description</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Amount</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        style={inputStyle}
                    >
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        style={inputStyle}
                    >
                        <option value="">-- Select --</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                </div>
            </div>

            <button
                type="submit"
                style={{
                    backgroundColor: theme.colors.primary,
                    color: '#fff',
                    padding: theme.spacing.sm,
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: theme.font.size,
                    cursor: 'pointer',
                    minWidth: '160px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    marginTop: theme.spacing.margin,
                }}
            >
                Add Transaction
            </button>
        </form>
    );
}

export default AddTransaction;
