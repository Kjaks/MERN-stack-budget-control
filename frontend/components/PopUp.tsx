import React, { useState, useEffect } from 'react';

// Define the structure of a Transaction object
interface Transaction {
  _id: string;
  userId: string;
  description: string;
  amount: number;
  type: string;
  date: string;
}

interface ExpensePopupProps {
  type: 'income' | 'expense';
  initialTransaction?: Transaction; // Optional prop for editing
  onSubmit: (description: string, amount: number, date: string) => void;
  onClose: () => void;
}

const PopUp: React.FC<ExpensePopupProps> = ({ type, initialTransaction, onSubmit, onClose }) => {
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(getCurrentDateFormatted());
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (initialTransaction) {
      setDescription(initialTransaction.description);
      setAmount(initialTransaction.amount);
      setDate(initialTransaction.date);
    }
  }, [initialTransaction]);

  // Function to format current date as yyyy-mm-dd
  function getCurrentDateFormatted(): string {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear().toString();
    return `${year}-${month}-${day}`;
  }

  // Function to handle form submission
  const handleSubmit = () => {
    if (amount <= 0) {
      setErrorMessage('Amount must be greater than zero.');
      return;
    }

    const formattedDate = date;
    onSubmit(description, amount, formattedDate);
    setDescription('');
    setAmount(0);
    setDate(getCurrentDateFormatted());
    setErrorMessage('');
  };

  // Function to handle amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value <= 0) {
      setErrorMessage('Amount must be greater than zero.');
    } else {
      setAmount(value);
      setErrorMessage('');
    }
  };

  // Function to handle date input change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDate(value);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {initialTransaction ? `Edit ${type === 'expense' ? 'Expense' : 'Income'}` : `Add ${type === 'expense' ? 'Expense' : 'Income'}`}
        </h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              autoComplete="off"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              autoComplete="off"
              required
            />
            {amount <= 0 && (
              <p className="text-red-500 text-xs mt-1">Amount must be greater than zero.</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date (yyyy-mm-dd)</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={handleDateChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="yyyy-mm-dd"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600"
            >
              {initialTransaction ? 'Update' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-md shadow hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopUp;
