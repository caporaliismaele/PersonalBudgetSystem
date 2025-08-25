import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext.jsx';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import css from '../../styles/css.js';

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    return (
        <>
            <nav style={css.navbar}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1.5rem',
                }}>
                    <span style={{
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        color: '#fff',
                    }}>
                        PersonalBudgetSystem
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {!user ? (
                            <>
                                <button
                                    onClick={() => setShowLogin(true)}
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: '1px solid #fff',
                                        color: '#fff',
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={() => setShowRegister(true)}
                                    style={{
                                        backgroundColor: '#fff',
                                        color: css.navbar.backgroundColor,
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '4px',
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Register
                                </button>
                            </>
                        ) : (
                            <>
                                <span style={{ color: '#fff', fontWeight: '500' }}>{user.email}</span>
                                <button
                                    onClick={logout}
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: '1px solid #fff',
                                        color: '#fff',
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Log Out
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
            {showRegister && <RegisterForm onClose={() => setShowRegister(false)} />}
        </>
    );
}

export default Navbar;
