import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext.jsx';
import theme from '../../styles/theme.js';

function CategoriesList({ refreshKey, onCategoryDeleted }) {
    const { user } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('All');

    const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};

    const fetchCategories = async () => {
        try {
            const baseUrl = 'https://localhost:7163/api/categories';
            const params = new URLSearchParams();

            if (typeFilter !== 'All') {
                params.append('type', typeFilter);
            }

            const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

            const response = await axios.get(url, { headers });
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchCategories();
    }, [user, refreshKey, typeFilter]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:7163/api/categories/${id}`, { headers });
            onCategoryDeleted();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    if (loading) return <div>Loading categories...</div>;

    const tdStyle = { padding: '0.75rem', border: `1px solid ${theme.colors.border}`, textAlign: 'center' };
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

    return (
        <div style={{ padding: '2rem', fontFamily: theme.font.family }}>
            <h3 style={{ textAlign: 'center', color: theme.colors.primary, marginBottom: '1.5rem' }}>
                Your Categories
            </h3>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={labelStyle}>Type</label>
                    <select style={inputStyle} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                </div>
            </div>

            {categories.length > 0 ? (
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    backgroundColor: '#fff',
                    boxShadow: theme.shadow.light,
                }}>
                    <thead>
                        <tr style={{ backgroundColor: theme.colors.primary, color: '#fff' }}>
                            {['Name', 'Type', 'Action'].map(header => (
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
                        {categories.map(cat => (
                            <tr key={cat.id}>
                                <td style={tdStyle}>{cat.name}</td>
                                <td style={tdStyle}>{cat.type}</td>
                                <td style={tdStyle}>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
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
                <p style={{ textAlign: 'center', marginTop: '1rem' }}>No categories</p>
            )}
        </div>
    );
}

export default CategoriesList;
