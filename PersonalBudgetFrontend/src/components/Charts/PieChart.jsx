import { useEffect, useState} from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import theme from '../../styles/theme.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = () => {
    const [type, setType] = useState("Income");
    const [data, setData] = useState(null);

    useEffect(() => {

        axios.get(`/api/charts/statsForType/${type}`, { withCredentials: true })
            .then(res => {
            const labels = res.data.map(d => d.category);
            const amounts = res.data.map(d => d.amount);

            const backgroundColor = labels.map(() => {
                const r = Math.floor(Math.random() * 255);
                const g = Math.floor(Math.random() * 255);
                const b = Math.floor(Math.random() * 255);
                return `rgba(${r}, ${g}, ${b}, 0.7)`;
            });

            setData({
                labels,
                datasets: [{
                    data: amounts,
                    backgroundColor
                }]
            });
        }).catch(err => {
            console.error("Errore nel caricamento dei dati:", err);
        });
    }, [type]);

    const inputStyle = {
        padding: '0.4rem 0.6rem',
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '6px',
        fontSize: theme.font.size,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        width: '140px',
        textAlign: 'center',
        backgroundColor: '#fff',
        appearance: 'none', // uniforma i select
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

    };

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
                { type } for This Month
            </h3>

            <div style={{ maxWidth: "800px", margin: "0 auto", marginBottom:'2rem' }}>
                {data ? <Pie data={data} /> : <p>Loading...</p>}
            </div>

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: theme.spacing.gap,

                }}
            >
                {/* Type Field */}
                <div style={fieldStyle}>
                    <label style={labelStyle}>
                        Select Type
                    </label>
                    <select
                        id="type-select"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        style={inputStyle}
                    >
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                </div>
            </div>

        </div>
    );
};

export default PieChart;
