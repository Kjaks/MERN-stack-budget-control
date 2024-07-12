import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FinancialSummary from '../components/FinancialSummary';
import TransactionTable from '../components/TransactionTable';
import PopUp from '../components/PopUp';
import Image from 'next/image';
import Link from 'next/link';

// Define the data type of a transaction
interface Transaction {
  _id: string;
  userId: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

const ClientData: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<'income' | 'expense' | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Load user data and transactions when the component is mounted.
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

  // Calculate balances and expenses.
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
  
    setTransactions(transactions);
    setBalance(totalBalance);
    setExpenses(totalExpenses);
  
    const yearsWithTransactions = Array.from(new Set(transactions.map(transaction => new Date(transaction.date).getFullYear())));
  
    if (yearsWithTransactions.length === 0) {
      setSelectedYear(null);
      setSelectedMonth(null);
    } else {
      if (!selectedYear || !yearsWithTransactions.includes(selectedYear)) {
        setSelectedYear(Math.min(...yearsWithTransactions));
      }
    }
  
    if (yearsWithTransactions.length === 0) {
      setSelectedYear(null);
      setSelectedMonth(null);
    } else {
      const monthsWithTransactions = Array.from(new Set(
        transactions
          .filter(transaction => new Date(transaction.date).getFullYear() === selectedYear)
          .map(transaction => new Date(transaction.date).toLocaleString('default', { month: 'long' }))
      ));
  
      if (!selectedMonth || !monthsWithTransactions.includes(selectedMonth)) {
        setSelectedMonth(monthsWithTransactions.length > 0 ? monthsWithTransactions[0] : null);
      }
    }
  };
  

  // Handle the addition of a new transaction.
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

      const updatedTransactions = [...transactions, newTransaction];
      calculateBalances(updatedTransactions);
    })
    .catch(error => {
      console.error('Error adding transaction:', error);
    });

    setIsPopupOpen(false);
  };

  // Function to handle the editing of a transaction.
  const handleEdit = (id: string) => {
    const transactionToEdit = transactions.find(transaction => transaction._id === id);
    if (transactionToEdit) {
      setSelectedTransaction(transactionToEdit);
      setIsEditPopupOpen(true);
    } else {
      console.error(`Transaction with ID ${id} not found.`);
    }
  };

  // Handle the submission of a transaction edit.
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

  // Function to handle the deletion of a transaction.
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/transactions/${id}`);
      const updatedTransactions = transactions.filter(transaction => transaction._id !== id);
      calculateBalances(updatedTransactions);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  // Open the popup to add a transaction.
  const handlePopupOpen = (type: 'income' | 'expense') => {
    setPopupType(type);
    setIsPopupOpen(true);
  };

  // Handle change of selected year.
  useEffect(() => {
    if (selectedYear !== null) {
      const monthsWithTransactions = Array.from(new Set(
        transactions
          .filter(transaction => new Date(transaction.date).getFullYear() === selectedYear)
          .map(transaction => new Date(transaction.date).toLocaleString('default', { month: 'long' }))
      ));

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
            Hi, {userName}!
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
          <button onClick={() => handlePopupOpen('income')} className="bg-green-500 text-white py-3 px-6 rounded-lg shadow hover:bg-green-600 text-center">Add Income</button>
          <button onClick={() => handlePopupOpen('expense')} className="bg-red-500 text-white py-3 px-6 rounded-lg shadow hover:bg-red-600 text-center">Add Expense</button>
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