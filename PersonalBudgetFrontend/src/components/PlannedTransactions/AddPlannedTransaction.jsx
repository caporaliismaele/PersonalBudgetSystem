import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext.jsx';
import theme from '../../styles/theme.js';

function AddPlannedTransaction({ refreshKey, onPlannedTransactionAdded }) {
    const { user } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('Income');
    const [dayOfMonth, setDayOfMonth] = useState(1);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            const response = await axios.post('https://localhost:7163/api/plannedtransaction', {
                name,
                amount: parseFloat(amount),
                type,
                dayOfMonth: parseInt(dayOfMonth),
                category,
                description,
            });

            onPlannedTransactionAdded(response.data);
            setName('');
            setAmount('');
            setType('Income');
            setDayOfMonth(1);
            setCategory('');
            setDescription('');
        } catch (error) {
            console.error('Error adding planned transaction:', error);
        }
    };

    const fetchCategories = async (type) => {
        try {
            const response = await axios.get('https://localhost:7163/api/categories', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const filtered = response.data.filter(c => c.type === type);
            setCategories(filtered);
            if (!filtered.find(c => c.name === category)) {
                setCategory(filtered[0]?.name || '');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCategories(type);
        }
    }, [user, type, refreshKey]);

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
                marginBottom: '1.5rem',
                }}>
                    Add Planned Transaction
            </h3>

            <p style={{
                textAlign: 'center',
                marginBottom: '1.5rem',
            }}>
                The Planned Transaction created will create a transaction with a monthly frequence
            </p>
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
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Description"
                                style={inputStyle}
                                required
                            />
                        </div>

                        <div style={fieldStyle}>
                            <label style={labelStyle}>Amount</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="Amount"
                                style={inputStyle}
                                required
                            />
                        </div>

                        <div style={fieldStyle}>
                            <label style={labelStyle}>Type</label>
                            <select
                                value={type}
                                onChange={e => setType(e.target.value)}
                                style={inputStyle}
                            >
                                <option value="Income">Income</option>
                                <option value="Expense">Expense</option>
                            </select>
                        </div>

                        <div style={fieldStyle}>
                            <label style={labelStyle}>Category</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                style={inputStyle}
                                required
                            >
                                <option value="">-- Select a category --</option>
                                {categories.length === 0 && <option disabled>No categories</option>}
                                {categories.map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={fieldStyle}>
                            <label style={labelStyle}>Activation Day</label>
                            <input
                                type="number"
                                min="1"
                                max="31"
                                value={dayOfMonth}
                                onChange={e => setDayOfMonth(e.target.value)}
                                placeholder="Day of Month"
                                style={inputStyle}
                                required
                            />
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
                            Add Planned Transaction
                    </button>
               </div>
            </form>
    );
}

export default AddPlannedTransaction;
