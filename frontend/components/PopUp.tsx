import React, { useState } from 'react';

interface ExpensePopupProps {
  type: 'income' | 'expense';
  onSubmit: (description: string, amount: number, date: string) => void;
  onClose: () => void;
}

const ExpensePopup: React.FC<ExpensePopupProps> = ({ type, onSubmit, onClose }) => {
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(getCurrentDateFormatted()); 
  const [errorMessage, setErrorMessage] = useState<string>(''); 

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
  
    if (!isPastDate(date)) {
      setErrorMessage('You can only choose past dates.');
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
    
    if (!isValidDate(value) || !isPastDate(value)) {
      setErrorMessage('You can only choose past dates.');
    } else {
      setErrorMessage('');
    }

    setDate(value);
  };

  // Function to validate date format (yyyy-mm-dd)
  const isValidDate = (dateString: string): boolean => {
    const pattern = /^(\d{4})-(\d{2})-(\d{2})$/;
    return pattern.test(dateString);
  };

  // Function to check if date is in the past
  const isPastDate = (dateString: string): boolean => {
    const [year, month, day] = dateString.split('-').map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    if (year > currentYear) return false;
    if (year === currentYear && month > currentMonth) return false;
    if (year === currentYear && month === currentMonth && day > currentDay) return false;

    return true;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {type === 'expense' ? 'Add Expense' : 'Add Income'}
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
            {!isValidDate(date) && (
              <p className="text-red-500 text-xs mt-1">Invalid date format (yyyy-mm-dd).</p>
            )}
            {!isPastDate(date) && (
              <p className="text-red-500 text-xs mt-1">You can only choose past dates.</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600"
            >
              Submit
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

export default ExpensePopup;
