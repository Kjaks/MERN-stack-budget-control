import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, Title, LineController, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, Title, LineController, BarElement);

interface Transaction {
  _id: string;
  userId: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

interface FinancialSummaryProps {
  balance: number;
  expenses: number;
  transactions: Transaction[];
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ balance, expenses, transactions }) => {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [monthsAvailable, setMonthsAvailable] = useState<string[]>([]);
  const [yearsAvailable, setYearsAvailable] = useState<number[]>([]);
  const [chartData, setChartData] = useState<any>({
    labels: ['Incomes', 'Expenses'],
    datasets: [
      {
        label: 'Financial Distribution',
        data: [0, 0],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverBackgroundColor: ['#66bb6a', '#ef5350']
      }
    ]
  });

  useEffect(() => {
    // Extract all years with transactions from the list of transactions
    const yearsWithTransactions = Array.from(new Set(transactions.map(transaction => new Date(transaction.date).getFullYear())));
    setYearsAvailable(yearsWithTransactions);
    
      setSelectedYear(Math.min(...yearsWithTransactions));
  }, [transactions]);

  useEffect(() => {
    // Update available months when selected year changes
    if (selectedYear !== null) {
      const monthsWithTransactions = Array.from(new Set(
        transactions
          .filter(transaction => new Date(transaction.date).getFullYear() === selectedYear)
          .map(transaction => new Date(transaction.date).toLocaleString('default', { month: 'long' }))
      ));
      setMonthsAvailable(monthsWithTransactions);

      // If no month is selected yet or selected month is not available, select the first available month
      if (!selectedMonth || !monthsWithTransactions.includes(selectedMonth)) {
        setSelectedMonth(monthsWithTransactions.length > 0 ? monthsWithTransactions[0] : null);
      }
    }
  }, [selectedYear, transactions, selectedMonth]);

  useEffect(() => {
    // Generate chart data when selected month or year changes
    if (selectedYear !== null && selectedMonth !== null) {
      generateChartData(selectedYear, selectedMonth);
    }
  }, [selectedYear, selectedMonth, transactions]);

  const generateChartData = (year: number, month: string) => {
    const { income, expenses } = calculateTotalSavingsMonthly(year, month);
    
    setChartData({
      labels: ['Incomes', 'Expenses'],
      datasets: [
        {
          label: 'Financial Distribution',
          data: [income, expenses],
          backgroundColor: ['#4caf50', '#f44336'],
          hoverBackgroundColor: ['#66bb6a', '#ef5350']
        }
      ]
    });
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const calculateTotalSavings = (year: number | null, month: string | null) => {
    if (year !== null && month === null) {
      const selectedTransactions = transactions.filter(transaction =>
        new Date(transaction.date).getFullYear() === year
      );

      const totalIncome = selectedTransactions.reduce((accumulator, transaction) =>
        accumulator + (transaction.type === 'income' ? transaction.amount : 0), 0);

      const totalExpenses = selectedTransactions.reduce((accumulator, transaction) =>
        accumulator + (transaction.type === 'expense' ? Math.abs(transaction.amount) : 0), 0);

      return totalIncome - totalExpenses;
    } else if (year !== null && month !== null) {
      const selectedTransactions = transactions.filter(transaction =>
        new Date(transaction.date).getFullYear() === year &&
        new Date(transaction.date).toLocaleString('default', { month: 'long' }) === month
      );

      const totalIncome = selectedTransactions.reduce((accumulator, transaction) =>
        accumulator + (transaction.type === 'income' ? transaction.amount : 0), 0);

      const totalExpenses = selectedTransactions.reduce((accumulator, transaction) =>
        accumulator + (transaction.type === 'expense' ? Math.abs(transaction.amount) : 0), 0);

      return totalIncome - totalExpenses;
    }

    return 0;
  };

  const calculateTotalSavingsMonthly = (year: number, month: string) => {
    const selectedTransactions = transactions.filter(transaction =>
      new Date(transaction.date).getFullYear() === year &&
      new Date(transaction.date).toLocaleString('default', { month: 'long' }) === month
    );

    const totalIncome = selectedTransactions.reduce((accumulator, transaction) =>
      accumulator + (transaction.type === 'income' ? transaction.amount : 0), 0);

    const totalExpenses = selectedTransactions.reduce((accumulator, transaction) =>
      accumulator + (transaction.type === 'expense' ? Math.abs(transaction.amount) : 0), 0);

    return {
      income: totalIncome,
      expenses: totalExpenses
    };
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <div className="bg-white shadow-md p-4 rounded-lg w-full md:w-3/4 lg:w-1/2">
        <div className="mt-4 text-center">
          {selectedYear !== Infinity && (
            <h1 className="text-3xl font-bold mb-2">
              Total savings for year {selectedYear}: <span className={calculateTotalSavings(selectedYear, null) < 0 ? 'text-red-500' : 'text-green-500'}>{calculateTotalSavings(selectedYear, null)} $</span>
            </h1>
          )}
          <p className="text-3xl font-bold mb-2">
            {selectedMonth && (
              <>
                Total savings for {selectedMonth}: <span className={calculateTotalSavings(selectedYear, selectedMonth) < 0 ? 'text-red-500' : 'text-green-500'}>
                  {calculateTotalSavings(selectedYear, selectedMonth)} $
                </span>
              </>
            )}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center mb-4">
          <div className="w-full md:w-1/3 px-4 mb-4 md:mb-0">
            <div className="relative" style={{ height: '300px' }}>
              <Pie data={chartData} />
            </div>
          </div>
          <div className="w-full md:w-1/2 px-4">
            <div className="flex justify-between">
              <div className="w-1/2 pr-2">
                <label htmlFor="month-select" className="block text-center">Select a month:</label>
                <select
                  id="month-select"
                  value={selectedMonth || ''}
                  onChange={handleMonthChange}
                  className="block w-full mt-2 border border-gray-300 rounded-md py-2 px-4 bg-white shadow-md"
                >
                  {monthsAvailable.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/2 pl-2">
                <label htmlFor="year-select" className="block text-center">Select a year:</label>
                <select
                  id="year-select"
                  value={selectedYear || ''}
                  onChange={handleYearChange}
                  className="block w-full mt-2 border border-gray-300 rounded-md py-2 px-4 bg-white shadow-md"
                >
                  {yearsAvailable.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
