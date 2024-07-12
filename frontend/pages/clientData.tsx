import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FinancialSummary from '../components/FinancialSummary';
import TransactionTable from '../components/TransactionTable';
import PopUp from '../components/PopUp';
import Image from 'next/image';
import Link from 'next/link';

// Define el tipo de datos de una transacción
interface Transaction {
  _id: string;
  userId: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

// Define la estructura de MonthData para los resúmenes financieros
interface MonthData {
  income: number;
  expenses: number;
  savings: number;
}

// Define la estructura de ChartData para los datos del gráfico
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }[];
}

const ClientData: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<'income' | 'expense' | null>(null);
  const [yearsAvailable, setYearsAvailable] = useState<number[]>([]);
  const [monthsAvailable, setMonthsAvailable] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [monthData, setMonthData] = useState<MonthData>({ income: 0, expenses: 0, savings: 0 });
  const [annualSavings, setAnnualSavings] = useState<number>(0);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null); // Estado para los datos del gráfico

  // Obtener el mes y el año actual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Cargar datos del usuario y transacciones al montar el componente
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedUserId = localStorage.getItem('userId');
    if (storedUserName && storedUserId) {
      setUserName(storedUserName);
      setUserId(storedUserId);

      axios.get<Transaction[]>(`http://localhost:8000/api/transactions/${storedUserId}`)
        .then(response => {
          const fetchedTransactions = response.data;
          calculateBalances(fetchedTransactions);
        })
        .catch(error => {
          console.error('Error fetching transactions:', error);
        });
    }
  }, []);

  // Calcular saldos y gastos
  const calculateBalances = (transactions: Transaction[]) => {
    let totalBalance = 0;
    let totalExpenses = 0;
    let monthIncome = 0;
    let monthExpenses = 0;
    let totalIncome = 0;
  
    transactions.forEach((transaction: Transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = transactionDate.getMonth();
      const transactionYear = transactionDate.getFullYear();
  
      if (transaction.type === 'income') {
        totalBalance += transaction.amount;
        totalIncome += transaction.amount;
        if (transactionMonth === currentMonth && transactionYear === currentYear) {
          monthIncome += transaction.amount;
        }
      } else {
        totalExpenses += Math.abs(transaction.amount);
        if (transactionMonth === currentMonth && transactionYear === currentYear) {
          monthExpenses += Math.abs(transaction.amount);
        }
      }
    });
  
    const annualSavings = totalIncome - totalExpenses;
    setTransactions(transactions);
    setBalance(totalBalance);
    setExpenses(totalExpenses);
    setMonthData({
      income: monthIncome,
      expenses: monthExpenses,
      savings: monthIncome - monthExpenses,
    });
    setAnnualSavings(annualSavings);
  
    // Actualizar años disponibles
    const yearsWithTransactions = Array.from(new Set(transactions.map(transaction => new Date(transaction.date).getFullYear())));
    setYearsAvailable(yearsWithTransactions);
  
    // Si no hay transacciones, restablecer los estados relacionados
    if (yearsWithTransactions.length === 0) {
      setSelectedYear(null);
      setMonthsAvailable([]);
      setSelectedMonth(null);
      setChartData(null); // Asegúrate de limpiar los datos del gráfico si no hay transacciones
    } else {
      // Si no hay un año seleccionado o el año seleccionado no está disponible, seleccionar automáticamente el primer año
      if (!selectedYear || !yearsWithTransactions.includes(selectedYear)) {
        setSelectedYear(Math.min(...yearsWithTransactions));
      }
    }
  
    // También restablecer el mes y los datos del gráfico
    if (yearsWithTransactions.length === 0) {
      setSelectedYear(null);
      setSelectedMonth(null);
      setChartData(null);
    } else {
      // Si hay transacciones, asegurarse de que el mes seleccionado sea válido
      const monthsWithTransactions = Array.from(new Set(
        transactions
          .filter(transaction => new Date(transaction.date).getFullYear() === selectedYear)
          .map(transaction => new Date(transaction.date).toLocaleString('default', { month: 'long' }))
      ));
      setMonthsAvailable(monthsWithTransactions);
  
      if (!selectedMonth || !monthsWithTransactions.includes(selectedMonth)) {
        setSelectedMonth(monthsWithTransactions.length > 0 ? monthsWithTransactions[0] : null);
      }
    }
  };
  

  // Manejar la adición de una nueva transacción
  const handleAddTransaction = (description: string, amount: number, date: string) => {
    const type = popupType === 'income' ? 'income' : 'expense';

    axios.post<Transaction>('http://localhost:8000/api/transactions', {
      userId,
      description,
      amount,
      date,
      type
    })
    .then(response => {
      const newTransaction = response.data;

      // Actualizar transacciones y balances basados en la nueva transacción
      const updatedTransactions = [...transactions, newTransaction];
      calculateBalances(updatedTransactions);
    })
    .catch(error => {
      console.error('Error adding transaction:', error);
    });

    setIsPopupOpen(false);
  };

  // Función para manejar la edición de una transacción
  const handleEdit = (id: string) => {
    const transactionToEdit = transactions.find(transaction => transaction._id === id);
    if (transactionToEdit) {
      setSelectedTransaction(transactionToEdit);
      setIsEditPopupOpen(true);
    } else {
      console.error(`Transaction with ID ${id} not found.`);
    }
  };

  // Manejar la sumisión de la edición de una transacción
  const handleEditSubmission = (description: string, amount: number, date: string) => {
    if (!selectedTransaction) return;

    const updatedTransaction: Transaction = {
      ...selectedTransaction,
      description,
      amount,
      date
    };

    axios.put<Transaction>(`http://localhost:8000/api/transactions/${selectedTransaction._id}`, updatedTransaction)
      .then(response => {
        const updatedTransaction = response.data;
        const updatedTransactions = transactions.map(transaction =>
          transaction._id === selectedTransaction._id ? updatedTransaction : transaction
        );
        setTransactions(updatedTransactions);
        calculateBalances(updatedTransactions);
        setIsEditPopupOpen(false);
      })
      .catch(error => {
        console.error('Error updating transaction:', error);
      });
  };

// Función para manejar la eliminación de una transacción
const handleDelete = async (id: string) => {
  try {
    await axios.delete(`http://localhost:8000/api/transactions/${id}`);
    const updatedTransactions = transactions.filter(transaction => transaction._id !== id);
    calculateBalances(updatedTransactions);
  } catch (error) {
    console.error('Error deleting transaction:', error);
  }
};

  // Abrir el popup para añadir una transacción
  const handlePopupOpen = (type: 'income' | 'expense') => {
    setPopupType(type);
    setIsPopupOpen(true);
  };

  // Generar datos del gráfico cuando cambie el año o el mes seleccionado
  useEffect(() => {
    if (selectedYear !== null && selectedMonth !== null) {
      generateChartData(selectedYear, selectedMonth);
    }
  }, [selectedYear, selectedMonth]);

  // Generar datos del gráfico basados en el año y mes seleccionados
  const generateChartData = (year: number, month: string) => {
    const { income, expenses } = calculateTotalSavingsMonthly(year, month);

    setChartData({
      labels: ['Ingresos', 'Gastos'],
      datasets: [
        {
          label: 'Distribución Financiera',
          data: [income, expenses],
          backgroundColor: ['#4caf50', '#f44336'],
          hoverBackgroundColor: ['#66bb6a', '#ef5350']
        }
      ]
    });
  };

  // Calcular ingresos y gastos totales mensuales
  const calculateTotalSavingsMonthly = (year: number, month: string) => {
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate.getFullYear() === year && transactionDate.toLocaleString('default', { month: 'long' }) === month) {
        if (transaction.type === 'income') {
          totalIncome += transaction.amount;
        } else {
          totalExpenses += Math.abs(transaction.amount);
        }
      }
    });

    return { income: totalIncome, expenses: totalExpenses };
  };

  // Manejar cambio de año seleccionado
  useEffect(() => {
    if (selectedYear !== null) {
      const monthsWithTransactions = Array.from(new Set(
        transactions
          .filter(transaction => new Date(transaction.date).getFullYear() === selectedYear)
          .map(transaction => new Date(transaction.date).toLocaleString('default', { month: 'long' }))
      ));
      setMonthsAvailable(monthsWithTransactions);

      // Si no hay mes seleccionado o el mes seleccionado no está disponible, seleccionar el primer mes disponible
      if (!selectedMonth || !monthsWithTransactions.includes(selectedMonth)) {
        setSelectedMonth(monthsWithTransactions.length > 0 ? monthsWithTransactions[0] : null);
      }
    }
  }, [selectedYear, transactions]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 max-w-full grid grid-cols-3 gap-2 p-1">
      <header className="col-span-3 h-full flex items-center justify-between px-4">
        <div className="flex items-center justify-center col-span-1">
        </div>
        <div className="flex items-center justify-self-stretch col-span-1">
          <h1 className="text-4xl font-bold text-gray-800 text-center pl-12">
            ¡Hola, {userName}!
          </h1>
        </div>
        <div className="flex items-center justify-end col-span-1">
          <button>
            <Link href='/'>
              <Image src="/pngwing.com.png" alt="Logout" width={48} height={48} />
            </Link>
          </button>
        </div>
      </header>

      <div className="col-span-3">
        <FinancialSummary balance={balance} expenses={expenses} transactions={transactions} />
      </div>
      
      <div className="col-span-3">
        <TransactionTable transactions={transactions} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      <div className="col-span-3 flex items-center justify-center">
        <section className="flex flex-col md:flex-row items-center justify-around gap-4 w-1/2 g-1/2">
          <button onClick={() => handlePopupOpen('income')} className="bg-green-500 text-white py-3 px-6 rounded-lg shadow hover:bg-green-600 text-center">Agregar Ingreso</button>
          <button onClick={() => handlePopupOpen('expense')} className="bg-red-500 text-white py-3 px-6 rounded-lg shadow hover:bg-red-600 text-center">Agregar Gasto</button>
        </section>
      </div>

      <footer className="text-center text-gray-600 mt-6 col-span-3">
        <p>&copy; {new Date().getFullYear()} Karolis Jakas Stirbyte</p>
      </footer>

      {isPopupOpen && popupType && (
        <PopUp
          type={popupType}
          onSubmit={handleAddTransaction}
          onClose={() => setIsPopupOpen(false)}
        />
      )}

      {isEditPopupOpen && selectedTransaction && (
        <PopUp
          type={selectedTransaction.type}
          initialTransaction={selectedTransaction}
          onSubmit={handleEditSubmission}
          onClose={() => setIsEditPopupOpen(false)}
        />
      )}

    </div>
  );
};

export default ClientData;
