// App.js
import React from 'react';
import { AuthProvider } from './components/AuthContext.jsx';
import AppContent from './AppContent.jsx';

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
