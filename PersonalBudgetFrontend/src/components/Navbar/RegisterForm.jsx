import React, { useState } from 'react';
import axios from 'axios';
import theme from '../../styles/theme.js';

function RegisterForm({ onClose }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post(
                'https://localhost:7163/api/auth/register',
                { username: email, password: password },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then(() => {
                setSuccess('Registration successful! You can log in now.');
                setError('');
            })
            .catch((error) => {
                console.error('Registration error:', error.response?.data);
                setError(error.response?.data || 'Error during registration');
                setSuccess('');
            });
    };

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
        >
            <div
                className="bg-white p-4 rounded shadow"
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    fontFamily: theme.font.family,
                }}
            >
                <h4 className="mb-3 text-center" style={{ color: theme.colors.primary }}>
                    Register
                </h4>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="text-danger mb-3">{error}</div>}
                    {success && <div className="text-success mb-3">{success}</div>}

                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary">
                            Register
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterForm;
