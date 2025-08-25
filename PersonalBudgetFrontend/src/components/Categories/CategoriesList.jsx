import React, { useEffect, useState } from 'react';
import axios from 'axios';
import css from '../../styles/css.js';

function CategoriesList({ refreshKey, onCategoryDeleted }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('All');

    const fetchCategories = async () => {
        try {
            const baseUrl = 'https://localhost:7163/api/categories';
            const params = new URLSearchParams();

            if (typeFilter !== 'All') {
                params.append('type', typeFilter);
            }

            const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

            const response = await axios.get(url, { withCredentials: true });
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [refreshKey, typeFilter]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:7163/api/categories/${id}`, { withCredentials: true });
            onCategoryDeleted();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    if (loading) return <div>Loading categories...</div>;

    return (
        <div style={css.categoriesWrapper}>
            <h3 style={css.categoriesTitle}>Your Categories</h3>

            <div style={css.filterGroup}>
                <div style={css.filterField}>
                    <label style={css.formLabel}>Type</label>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        style={{ ...css.formSelect, width: '200px', marginTop: '0.3rem' }}
                    >
                        <option value="All">All</option>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                </div>
            </div>

            {categories.length > 0 ? (
                <table style={css.table}>
                    <thead>
                        <tr style={css.tableHeader}>
                            {['Name', 'Type', 'Action'].map((header) => (
                                <th key={header} style={css.tableCell}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id}>
                                <td style={css.tableCell}>{cat.name}</td>
                                <td style={css.tableCell}>{cat.type}</td>
                                <td style={css.tableCell}>
                                    <button style={css.deleteButton} onClick={() => handleDelete(cat.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p style={css.emptyMessage}>No categories</p>
            )}
        </div>
    );
}

export default CategoriesList;
