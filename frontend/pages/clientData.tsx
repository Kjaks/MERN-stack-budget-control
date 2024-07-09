import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FinancialSummary from '../components/FinancialSummary';
import TransactionTable from '../components/TransactionTable';
import Image from 'next/image';
import ExpensePopup from '../components/PopUp';
import Link from 'next/link';

interface Transaction {
  id: number;
  description: string;
  amount: number;
}

const ClientData: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<'income' | 'expense' | null>(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    if (storedUserName && userId) {
      setUserName(storedUserName);
  
      // Obtener las transacciones del usuario
      axios.get(`http://localhost:8000/api/transactions/${userId}`)
      .then(response => {
        // Verifica si la respuesta contiene datos válidos de transacciones
        if (Array.isArray(response.data)) {
          // Actualiza el estado de transactions con la respuesta de la API
          setTransactions(response.data);
    
          // Calcula balance y gastos basados en las transacciones
          let totalBalance = 0;
          let totalExpenses = 0;
          response.data.forEach((transaction: Transaction) => {
            if (transaction.amount >= 0) {
              totalBalance += transaction.amount;
            } else {
              totalExpenses += Math.abs(transaction.amount);
            }
          });
          setBalance(totalBalance);
          setExpenses(totalExpenses);
        } else {
          console.error('La respuesta no contiene un array de transacciones válido:', response.data);
        }
      })
      .catch(error => {
        console.error('Error al obtener transacciones:', error);
      });
    
  
      // Obtener el balance del usuario
      axios.get(`http://localhost:8000/api/balances/${userId}`)
        .then(response => {
          setBalance(response.data.balance);
          setExpenses(response.data.expenses);
        })
        .catch(error => {
          console.error('Error al obtener balance:', error);
        });
    }
  }, []);
  

  const handleExpenseSubmit = (description: string, amount: number) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    axios.post('http://localhost:8000/api/transactions', {
      userId,
      description,
      amount: -amount  // Negativo para gastos
    })
    .then(response => {
      const newTransaction = response.data.transaction;
      setTransactions([...transactions, newTransaction]);
      setBalance(balance + newTransaction.amount);
      setExpenses(expenses + Math.abs(newTransaction.amount));
    })
    .catch(error => {
      console.error('Error adding transaction:', error);
    });

    setIsPopupOpen(false);
  };

  const handleIncomeSubmit = (description: string, amount: number) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    axios.post('http://localhost:8000/api/transactions', {
      userId,
      description,
      amount
    })
    .then(response => {
      const newTransaction = response.data.transaction;
      setTransactions([...transactions, newTransaction]);
      setBalance(balance + newTransaction.amount);
    })
    .catch(error => {
      console.error('Error adding transaction:', error);
    });

    setIsPopupOpen(false);
  };

  const handlePopupOpen = (type: 'income' | 'expense') => {
    setPopupType(type);
    setIsPopupOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 max-w-full grid grid-cols-3 gap-10 p-1">
      <header className="col-span-3 h-full flex items-center justify-between px-4">
        <div className="flex items-center justify-center col-span-1">
        </div>
        <div className="flex items-center justify-self-stretch col-span-1">
          <h1 className="text-4xl font-bold text-gray-800 text-center pl-12">Hola, {userName}!</h1>
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
        <FinancialSummary balance={balance} expenses={expenses} />
      </div>
      
      <div className="col-span-3">
        <TransactionTable transactions={transactions} />
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
        <ExpensePopup
          type={popupType}
          onSubmit={popupType === 'income' ? handleIncomeSubmit : handleExpenseSubmit}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default ClientData;
