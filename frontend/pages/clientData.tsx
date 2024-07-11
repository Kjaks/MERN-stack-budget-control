import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FinancialSummary from '../components/FinancialSummary';
import TransactionTable from '../components/TransactionTable';
import PopUp from '../components/PopUp';
import Image from 'next/image';
import Link from 'next/link';

// Define the structure of a Transaction object
interface Transaction {
  _id: string;
  userId: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

// Define the structure of MonthData for financial summaries
interface MonthData {
  income: number;
  expenses: number;
  savings: number;
}

const ClientData: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<'income' | 'expense' | null>(null);
  const [monthData, setMonthData] = useState<MonthData>({ income: 0, expenses: 0, savings: 0 });
  const [annualSavings, setAnnualSavings] = useState<number>(0);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState<boolean>(false); // Estado para controlar la apertura del pop-up de edición
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null); // Estado para almacenar la transacción seleccionada para editar

  // Get the current month
  const currentMonth = new Date().getMonth();

  // Fetch user and transaction data on component mount
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedUserId = localStorage.getItem('userId');
    if (storedUserName && storedUserId) {
      setUserName(storedUserName);
      setUserId(storedUserId);

      axios.get<Transaction[]>(`http://localhost:8000/api/transactions/${storedUserId}`)
        .then(response => {
          const fetchedTransactions = response.data;

          // Calculate balances and expenses
          let totalBalance = 0;
          let totalExpenses = 0;
          let monthIncome = 0;
          let monthExpenses = 0;
          let totalIncome = 0;

          fetchedTransactions.forEach((transaction: Transaction) => {
            const transactionMonth = new Date(transaction.date).getMonth();
            if (transaction.type === 'income') {
              totalBalance += transaction.amount;
              totalIncome += transaction.amount;
              if (transactionMonth === currentMonth) {
                monthIncome += transaction.amount;
              }
            } else {
              totalExpenses += Math.abs(transaction.amount);
              if (transactionMonth === currentMonth) {
                monthExpenses += Math.abs(transaction.amount);
              }
            }
          });

          const annualSavings = totalIncome - totalExpenses;
          setTransactions(fetchedTransactions);
          setBalance(totalBalance);
          setExpenses(totalExpenses);
          setMonthData({
            income: monthIncome,
            expenses: monthExpenses,
            savings: monthIncome - monthExpenses,
          });
          setAnnualSavings(annualSavings);
        })
        .catch(error => {
          console.error('Error fetching transactions:', error);
        });
    }
  }, []);

  // Add a new transaction
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

      // Update transactions and balances based on the new transaction
      setTransactions(prevTransactions => [...prevTransactions, newTransaction]);

      if (type === 'income') {
        setBalance(prevBalance => prevBalance + newTransaction.amount);
      } else {
        setExpenses(prevExpenses => prevExpenses + newTransaction.amount);
      }
    })
    .catch(error => {
      console.error('Error adding transaction:', error);
    });

    setIsPopupOpen(false);
  };

  // Function to handle editing a transaction
  const handleEdit = (id: string) => {
    const transactionToEdit = transactions.find(transaction => transaction._id === id);
    if (transactionToEdit) {
      setSelectedTransaction(transactionToEdit);
      setIsEditPopupOpen(true); // Ensure setIsEditPopupOpen is called to open the edit popup
    } else {
      console.error(`Transaction with ID ${id} not found.`);
    }
  };

  // Handle submission of edited transaction
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
        updateTransaction(selectedTransaction._id, updatedTransaction);
        setIsEditPopupOpen(false); // Close the edit popup after successful update
      })
      .catch(error => {
        console.error('Error updating transaction:', error);
      });
  };

  // Function to handle updating a transaction after editing
  const updateTransaction = (id: string, updatedTransaction: Transaction) => {
    const updatedTransactions = transactions.map(transaction =>
      transaction._id === id ? updatedTransaction : transaction
    );
    setTransactions(updatedTransactions);
  };


  // Function to handle deleting a transaction
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/transactions/${id}`);
      setTransactions(transactions.filter(transaction => transaction._id !== id));

      // Update balances if necessary
      const deletedTransaction = transactions.find(transaction => transaction._id === id);
      if (deletedTransaction) {
        if (deletedTransaction.type === 'income') {
          setBalance(prevBalance => prevBalance - deletedTransaction.amount);
        } else {
          setExpenses(prevExpenses => prevExpenses - deletedTransaction.amount);
        }
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  // Open the popup for adding a transaction
  const handlePopupOpen = (type: 'income' | 'expense') => {
    setPopupType(type);
    setIsPopupOpen(true);
  };

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
