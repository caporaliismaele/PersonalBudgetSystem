import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext.jsx';
import theme from '../styles/theme.js';

function Balance() {
    const { user } = useContext(AuthContext);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    const formattedBalance = new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR'
    }).format(balance);


    useEffect(() => {
        if (!user) return;

        axios
            .get('https://localhost:7163/api/transactions/balance')
            .then((response) => {
                setBalance(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching balance:', error);
                setLoading(false);
            });
    }, [user]);

    if (loading) {
        return (
            <div className="text-center py-4" style={{ fontFamily: theme.font.family }}>
                <span className="text-muted">Loading balance...</span>
            </div>
        );
    }

    const isPositive = balance >= 0;
    const balanceColor = isPositive ? theme.colors.primary : theme.colors.danger;

    return (
        <div
            className="text-center p-4 mb-4 rounded shadow-sm"
            style={{
                backgroundColor: '#fff',
                fontFamily: theme.font.family,
                borderLeft: `6px solid ${balanceColor}`,
            }}
        >
            <h4 style={{ color: balanceColor, fontWeight: 'bold', marginBottom: '1rem' }}>Balance</h4>
            <div
                style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: balanceColor,
                }}
            >
                {formattedBalance}
            </div>
        </div>
    );
}

export default Balance;
