import React, { useState, useEffect } from "react";
import PieChart from "./PieChart.jsx";
import VerticalBarChart from "./VerticalBarChart.jsx";
import LineChartPointStyling from "./LineChartPointStyling.jsx";
import axios from "axios";
import css from "../../styles/css.js";
import theme from "../../styles/theme.js";

function Charts() {
    const [selectedChart, setSelectedChart] = useState("stats");
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("https://localhost:7163/api/transactions/balance", { withCredentials: true })
            .then((response) => {
                setBalance(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching balance:", error);
                setLoading(false);
            });
    }, []);

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

    return (
        <div style={css.chartsWrapper}>
            {loading ? (
                <p>Loading charts...</p>
            ) : balance === 0 ? (
                <p style={{ color: theme.colors.danger, fontWeight: "bold" }}>
                    Impossible to load chart: there are no transactions
                </p>
            ) : (
                <>
                    <h3 style={css.chartsTitle}>Charts Overview</h3>

                    <div style={{ marginBottom: "30px" }}>{renderChart()}</div>

                    <div style={css.formGroup}>
                        <div style={css.formField}>
                            <label style={css.formLabel} htmlFor="chart-select">
                                Visualizza:
                            </label>
                            <select
                                id="chart-select"
                                value={selectedChart}
                                onChange={(e) => setSelectedChart(e.target.value)}
                                style={{ ...css.formInput, width: "140px" }}
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
