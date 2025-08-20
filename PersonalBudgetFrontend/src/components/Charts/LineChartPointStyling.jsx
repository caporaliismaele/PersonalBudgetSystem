import { useEffect, useState, useContext } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { AuthContext } from "../AuthContext.jsx";
import theme from '../../styles/theme.js';

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
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user || !user.token) return;

        axios
            .get("/api/charts/balance", {
                headers: { Authorization: `Bearer ${user.token}` }
            })
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

    }, [user]);

    if (!data) return <p>Loading...</p>;

  return (
        <div style={{
            backgroundColor: theme.colors.background,
            padding: theme.spacing.padding,
            textAlign: "center",
            fontFamily: theme.font.family,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
          <h3 style={{
              color: theme.colors.primary,
              textAlign: 'center',
              marginBottom: '1.5rem',
          }}>
              Monthly Balance Overview
          </h3>

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
                                    return `${value.toLocaleString()} € `;
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
                                callback: (value) => `${value} €`
                            }
                        }
                    }
                }}
              />
        </div>
    );
};

export default LineChartPointStyling;
