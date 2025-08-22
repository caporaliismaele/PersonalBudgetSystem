import React, { useState} from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext.jsx';
import theme from '../../styles/theme.js';

function AddCategory({ onCategoryAdded }) {

    const [name, setName] = useState('');
    const [type, setType] = useState('Income');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:7163/api/categories', {
                name,
                type
            }, { withCredentials: true });
            onCategoryAdded(response.data);
            setName('');
        } catch (error) {
            console.error('Error adding category:', error);
        }
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
                marginBottom: '1.5rem',
                }}>
                    Add Category
                </h3>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: theme.spacing.gap,
                    marginBottom: theme.spacing.margin,
                    }}
                >
                {/* Name Field */}
                    <div style={fieldStyle}>
                        <label style={labelStyle}>
                                Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            style={inputStyle}
                                placeholder="Category name"
                            />
                        </div>

                        {/* Type Field */}
                        <div style={fieldStyle}>
                        <label style={labelStyle}>
                                Type
                            </label>
                            <select
                                value={type}
                                onChange={e => setType(e.target.value)}
                            style={inputStyle}
                            >
                                <option value="Income">Income</option>
                                <option value="Expense">Expense</option>
                            </select>
                        </div>
                </div>
                {/* Submit Button */}
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
                    Add Category
                </button>
            </form>
    );
}

export default AddCategory;
