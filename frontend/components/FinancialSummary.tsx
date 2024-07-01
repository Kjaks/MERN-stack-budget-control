import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, Title, LineController, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, Title, LineController, BarElement);

interface FinancialSummaryProps {
    balance: number;
    expenses: number;
}

const pieChartData = {
    labels: ['Saldo', 'Gastos'],
    datasets: [
        {
            label: 'Distribución Financiera',
            data: [1200, 400],
            backgroundColor: ['#4caf50', '#f44336'],
            hoverBackgroundColor: ['#66bb6a', '#ef5350']
        }
    ]
};

const barChartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
        {
            label: 'Gastos por Mes',
            backgroundColor: '#2196f3',
            borderColor: '#1e88e5',
            borderWidth: 1,
            hoverBackgroundColor: '#0d47a1',
            hoverBorderColor: '#0d47a1',
            data: [200, 300, 250, 400, 350, 300, 450, 400, 350, 300, 250, 500]
        }
    ]
};

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ balance, expenses }) => (
    <div className="flex flex-col items-center justify-center">
        <div className="bg-white shadow-md p-6 rounded-lg w-full md:w-3/4 lg:w-1/2">
            <div className="text-center mb-4">
                <p className="text-lg">Saldo Actual: <span className="font-bold">${balance}</span></p>
                <p className="text-lg">Gastos: <span className="font-bold">${expenses}</span></p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center mb-4">
                <div className="w-full md:w-1/3 px-4 mb-4 md:mb-0">
                    <div className="relative" style={{ height: '300px' }}>
                        <Pie data={pieChartData} />
                    </div>
                </div>

                <div className="w-full md:w-1/2 px-4">
                    <div className="relative" style={{ height: '300px' }}>
                        <Bar data={barChartData} />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default FinancialSummary;
