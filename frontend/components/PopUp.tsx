import React, { useState } from 'react';

interface ExpensePopupProps {
  type: 'income' | 'expense'; // Prop para indicar si es ingreso o gasto
  onSubmit: (description: string, amount: number) => void;
  onClose: () => void;
}

const ExpensePopup: React.FC<ExpensePopupProps> = ({ type, onSubmit, onClose }) => {
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = () => {
    if (amount < 0) {
      setErrorMessage('No se puede ingresar un número negativo.');
      return;
    }

    onSubmit(description, amount);
    setDescription('');
    setAmount(0);
    setErrorMessage('');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < 0) {
      setErrorMessage('No se puede ingresar un número negativo.');
    } else {
      setAmount(value);
      setErrorMessage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {type === 'expense' ? 'Agregar Gasto' : 'Agregar Ingreso'}
        </h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Valor</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
            {errorMessage && (
              <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600"
            >
              Enviar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-md shadow hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpensePopup;
