import { useEffect, useState, useContext } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { AuthContext } from "../AuthContext.jsx";
import theme from '../../styles/theme.js';

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
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user || !user.token) return;

    axios
      .get("/api/charts/cashflow")
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
  }, [user]);

  if (!data || data.labels.length === 0) return <p>Nessun dato disponibile</p>;

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
                Monthly Cashflow Overview
            </h3>
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
                  return value !== null ? `€ ${value.toLocaleString()}` : "";
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => `€ ${value}`
              }
            }
          }
        }}
      />
    </div>
  );
};

export default VerticalBarChart;
