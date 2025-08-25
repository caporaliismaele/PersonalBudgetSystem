import React, { useState } from 'react';
import axios from 'axios';
import css from '../../styles/css.js';

function AddCategory({ onCategoryAdded }) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Income',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'https://localhost:7163/api/categories',
                {
                    name: formData.name,
                    type: formData.type,
                },
                { withCredentials: true }
            );

            onCategoryAdded(response.data);
            setFormData({ name: '', type: 'Income' });
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={css.formWrapper}>
            <h3 style={css.formTitle}>Add Category</h3>

            <div style={css.formGroup}>
                {/* Name Field */}
                <div style={css.formField}>
                    <label style={css.formLabel}>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ ...css.formInput, width: '140px' }}
                        placeholder="Category name"
                    />
                </div>

                {/* Type Field */}
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
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                style={{ ...css.formButton, minWidth: '160px', marginTop: '1rem' }}
            >
                Add Category
            </button>
        </form>
    );
}

export default AddCategory;
