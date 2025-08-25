import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

import css from "../../styles/css.js";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

export const LineChartPointStyling = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios
            .get("/api/charts/balance", { withCredentials: true })
            .then((res) => {
                const rawData = res.data;

                const labels = rawData.map((d) => d.month ?? "Mese sconosciuto");
                const balance = rawData.map((d) =>
                    typeof d.balance === "number" ? d.balance : 0
                );

                setData({
                    labels,
                    datasets: [
                        {
                            label: "Balance",
                            data: balance,
                            borderColor: "blue",
                            backgroundColor: "rgba(0,0,255,0.2)",
                            pointStyle: "rectRot",
                            pointRadius: 6,
                            pointHoverRadius: 8,
                            tension: 0.3
                        }
                    ]
                });
            })
            .catch((err) => {
                console.error("Errore nel caricamento dei dati:", err);
            });
    }, []);

    if (!data) return <p>Loading...</p>;

    return (
        <div style={css.chartsWrapper}>
            <h3 style={css.chartsTitle}>Monthly Balance Overview</h3>

            <Line
                key={JSON.stringify(data)}
                data={data}
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "top"
                        },
                        tooltip: {
                            mode: "index",
                            intersect: false,
                            callbacks: {
                                label: (context) => {
                                    const value = context.raw;
                                    return `${value.toLocaleString()}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Month"
                            },
                            ticks: {
                                autoSkip: false,
                                maxRotation: 45,
                                minRotation: 0
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Money"
                            },
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

export default LineChartPointStyling;
