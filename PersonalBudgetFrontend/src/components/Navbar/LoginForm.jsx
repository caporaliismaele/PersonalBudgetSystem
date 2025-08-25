import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import css from '../../styles/css.js';

function LoginForm({ onClose }) {
    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post('https://localhost:7163/api/auth/login', {
                username: formData.email,
                password: formData.password,
            })
            .then((res) => {
                login(res.data);
                onClose();
            })
            .catch(() => setError('Invalid credentials'));
    };

    return (
        <div style={css.modalOverlay}>
            <div style={css.modalBox}>
                <h4 style={css.modalTitle}>Log In</h4>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{ ...css.formInput, width: '100%' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{ ...css.formInput, width: '100%' }}
                        />
                    </div>

                    {error && (
                        <div style={{ color: css.deleteButton.backgroundColor, marginBottom: '1rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button type="submit" style={css.formButton}>
                            Log In
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

export default LoginForm;
