import React from 'react';
import { useAuth } from './components/AuthContext.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Main from './components/Main.jsx';
import theme from './styles/theme.js';

function AppContent() {
    const { user } = useAuth();

    return (
        <div style={{ backgroundColor: theme.colors.background, minHeight: '100vh' }}>
            <Navbar />

            <div className="container py-5">
                {user ? (
                    <Main />
                ) : (
                    <div className="text-center p-5 bg-white rounded shadow-sm">
                        <h2 style={{ color: theme.colors.primary, fontSize: theme.font.size.heading }}>
                            Welcome!
                        </h2>
                        <p style={{ color: theme.colors.text, fontSize: theme.font.size.base }}>
                            Please log in to access your dashboard.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AppContent;
