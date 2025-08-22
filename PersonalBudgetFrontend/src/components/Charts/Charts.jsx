import React, { useState, useEffect, useContext } from "react";
import PieChart from "./PieChart.jsx";
import VerticalBarChart from "./VerticalBarChart.jsx";
import LineChartPointStyling from "./LineChartPointStyling.jsx";
import theme from '../../styles/theme.js';
import axios from "axios";
import { AuthContext } from '../AuthContext.jsx';

function Charts() {
    const { user } = useContext(AuthContext);
    const [selectedChart, setSelectedChart] = useState("stats");
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (!user) return;

        axios
            .get('https://localhost:7163/api/transactions/balance', { withCredentials: true })
            .then((response) => {
                setBalance(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching balance:', error);
                setLoading(false);
            });
    }, [user]);

    const renderChart = () => {
        switch (selectedChart) {
            case "stats":
                return <PieChart />;
            case "cashflow":
                return <VerticalBarChart />;
            case "balance":
                return <LineChartPointStyling />;
            default:
                return <p>Seleziona un grafico dal menu.</p>;
        }
    };

    const inputStyle = {
        padding: '0.4rem 0.6rem',
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '6px',
        fontSize: theme.font.size,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        width: '140px',
        textAlign: 'center',
        backgroundColor: '#fff',
        appearance: 'none',
    };

    const labelStyle = {
        textAlign: 'center',
        fontWeight: '500',
        color: theme.colors.text,
        marginBottom: '0.4rem',
    };

    const fieldStyle = {
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing.sm,
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>

            {loading ? (
                <p>Loading charts...</p>
            ) : balance === 0 ? (
                <p style={{ color: theme.colors.danger || "#e03131", fontWeight: "bold" }}>
                    Impossible to load chart: there are no transactions
                </p>
            ) : (
                <>
                    <h3 style={{ marginBottom: "1rem", color: theme.colors.primary }}>
                        Charts Overview
                    </h3>
                    <div style={{ marginBottom: "30px" }}>
                        {renderChart()}
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: theme.spacing.gap,
                            marginBottom: theme.spacing.margin,
                        }}
                    >
                        <div style={fieldStyle}>
                            <label style={labelStyle} htmlFor="chart-select">
                                Visualizza:
                            </label>
                            <select
                                id="chart-select"
                                value={selectedChart}
                                onChange={(e) => setSelectedChart(e.target.value)}
                                style={inputStyle}
                            >
                                <option value="stats">Stats (Pie)</option>
                                <option value="cashflow">Cashflow (Bar)</option>
                                <option value="balance">Balance (Line)</option>
                            </select>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Charts;
