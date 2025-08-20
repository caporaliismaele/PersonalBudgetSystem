import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext.jsx';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import theme from '../../styles/theme.js';

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    return (
        <>
            <nav
                className="navbar navbar-expand-lg"
                style={{
                    backgroundColor: theme.colors.primary,
                    color: '#fff',
                    fontFamily: theme.font.family,
                }}
            >
                <div className="container-fluid">
                    <a className="navbar-brand text-white fw-bold" >
                        PersonalBudgetSystem
                    </a>

                    <div className="d-flex align-items-center">
                        {!user ? (
                            <>
                                <button
                                    className="btn btn-outline-light me-2"
                                    onClick={() => setShowLogin(true)}
                                >
                                    Log In
                                </button>
                                <button
                                    className="btn btn-light"
                                    onClick={() => setShowRegister(true)}
                                >
                                    Register
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="text-white me-3">{user.email}</span>
                                <button className="btn btn-outline-light" onClick={logout}>
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
