// src/components/Analytics/TopProductsChart.js
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { db } from '../../firebase/config';

const TopProductsChart = () => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const productsData = await db.collection('sales').orderBy('quantitySold', 'desc').limit(3).get();
            const chartLabels = productsData.docs.map(doc => doc.data().name);
            const chartValues = productsData.docs.map(doc => doc.data().quantitySold);

            setChartData({
                labels: chartLabels,
                datasets: [
                    {
                        label: 'Top 3 Productos Más Vendidos',
                        data: chartValues,
                        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
                        borderColor: ['rgba(255,99,132,1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                        borderWidth: 1,
                    }
                ]
            });
        };

        fetchData();
    }, []);

    return <Bar data={chartData} options={{ scales: { yAxes: [{ ticks: { beginAtZero: true } }] } }} />;
};

export default TopProductsChart;
