import React, { useEffect, useState } from 'react';
import axios from 'axios';
import css from '../../styles/css.js';
import theme from '../../styles/theme.js';

function Balance() {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    const formattedBalance = new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
    }).format(balance);

    useEffect(() => {
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
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '1rem', fontFamily: css.appWrapper.fontFamily }}>
                <span style={{ color: '#6c757d' }}>Loading balance...</span>
            </div>
        );
    }

    const isPositive = balance >= 0;
    const balanceColor = isPositive ? theme.colors.primary : theme.colors.danger;

    return (
        <div
            style={{
                ...css.highlightBox,
                borderLeft: `6px solid ${balanceColor}`,
            }}
        >
            <h4
                style={{
                    ...css.highlightTitle,
                    color: balanceColor,
                    fontSize: '1.25rem',
                }}
            >
                Balance
            </h4>
            <div style={{ ...css.highlightValue, color: balanceColor }}>
                {formattedBalance}
            </div>
        </div>
    );
}

export default Balance;
