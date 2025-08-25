import React, { useState } from 'react';
import axios from 'axios';
import css from '../../styles/css.js';

function RegisterForm({ onClose }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [formStatus, setFormStatus] = useState({
        error: '',
        success: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post(
                'https://localhost:7163/api/auth/register',
                { username: formData.email, password: formData.password },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then(() => {
                setFormStatus({ success: 'Registration successful! You can log in now.', error: '' });
            })
            .catch((error) => {
                console.error('Registration error:', error.response?.data);
                setFormStatus({
                    error: error.response?.data || 'Error during registration',
                    success: ''
                });
            });
    };

    return (
        <div style={css.modalOverlay}>
            <div style={css.modalBox}>
                <h4 style={css.modalTitle}>Register</h4>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="email" style={css.formLabel}>Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{ ...css.formInput, width: '100%' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="password" style={css.formLabel}>Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{ ...css.formInput, width: '100%' }}
                        />
                    </div>

                    {formStatus.error && (
                        <div style={{ color: css.deleteButton.backgroundColor, marginBottom: '1rem', textAlign: 'center' }}>
                            {formStatus.error}
                        </div>
                    )}
                    {formStatus.success && (
                        <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center' }}>
                            {formStatus.success}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button type="submit" style={css.formButton}>
                            Register
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                ...css.formButton,
                                backgroundColor: '#fff',
                                color: css.formButton.backgroundColor,
                                border: `1px solid ${css.formButton.backgroundColor}`,
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterForm;
