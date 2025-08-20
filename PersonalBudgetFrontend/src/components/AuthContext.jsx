import React, { createContext, useState, useEffect, useContext } from 'react';

import axios from 'axios';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // es: { email: 'utente@mail.com', token: '...' }

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
        }

        // Interceptor Axios per aggiungere il token a ogni richiesta
        const interceptor = axios.interceptors.request.use(config => {
            const currentUser = JSON.parse(sessionStorage.getItem('user'));
            if (currentUser?.token) {
                config.headers.Authorization = `Bearer ${currentUser.token}`;
            }
            return config;
        });

        // Cleanup dell’interceptor quando il componente viene smontato
        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, []);

    const login = (userData) => {
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
