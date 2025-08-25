import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import css from "../../styles/css.js";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const VerticalBarChart = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios
            .get("/api/charts/cashflow", { withCredentials: true })
            .then((res) => {
                const labels = res.data.map((d) => d.month);
                const cashflow = res.data.map((d) => d.cashflow);

                const positiveData = cashflow.map((value) => (value >= 0 ? value : null));
                const negativeData = cashflow.map((value) => (value < 0 ? value : null));

                setData({
                    labels,
                    datasets: [
                        {
                            label: "Positive Cashflow",
                            data: positiveData,
                            backgroundColor: "rgba(0, 200, 0, 0.7)",
                            borderColor: "rgba(0, 100, 0, 0.5)",
                            borderWidth: 1
                        },
                        {
                            label: "Negative Cashflow",
                            data: negativeData,
                            backgroundColor: "rgba(200, 0, 0, 0.7)",
                            borderColor: "rgba(100, 0, 0, 0.5)",
                            borderWidth: 1
                        }
                    ]
                });
            })
            .catch((err) => {
                console.error("Errore nel caricamento dei dati:", err);
            });
    }, []);

    if (!data || data.labels.length === 0) return <p>Nessun dato disponibile</p>;

    return (
        <div style={css.chartsWrapper}>
            <h3 style={css.chartsTitle}>Monthly Cashflow Overview</h3>
            <Bar
                data={data}
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: "top"
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const value = context.raw;
                                    return value !== null ? `${value.toLocaleString()}` : "";
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => `${value}`
                            }
                        }
                    }
                }}
            />
        </div>
    );
};

export default VerticalBarChart;
