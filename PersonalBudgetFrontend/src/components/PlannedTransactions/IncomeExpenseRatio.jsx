import React, { useEffect, useState } from 'react';
import axios from 'axios';
import css from '../../styles/css.js';
import theme from '../../styles/theme.js';

function IncomeExpenseRatio() {
    const [ratio, setRatio] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get('https://localhost:7163/api/plannedtransaction/income-expense-ratio')
            .then((response) => {
                setRatio(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching ratio:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '1rem', fontFamily: css.appWrapper.fontFamily }}>
                <span style={{ color: '#6c757d' }}>Loading ratio...</span>
            </div>
        );
    }

    const isPositive = ratio >= 1;
    const ratioColor = isPositive ? theme.colors.primary : theme.colors.danger;

    return (
        <div
            style={{
                ...css.highlightBox,
                borderLeft: `6px solid ${ratioColor}`,
            }}
        >
            <h4
                style={{
                    ...css.highlightTitle,
                    color: ratioColor,
                    fontSize: '1.25rem',
                }}
            >
                Income/Expense Ratio
            </h4>
            <div style={{ ...css.highlightValue, color: ratioColor }}>{ratio}</div>
        </div>
    );
}

export default IncomeExpenseRatio;
