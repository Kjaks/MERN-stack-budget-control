import React, { useState } from 'react';

interface ExpensePopupProps {
  type: 'income' | 'expense'; // Prop para indicar si es ingreso o gasto
  onSubmit: (description: string, amount: number, date: string) => void;
  onClose: () => void;
}

const ExpensePopup: React.FC<ExpensePopupProps> = ({ type, onSubmit, onClose }) => {
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(getCurrentDateFormatted()); // Inicializar con la fecha actual en el formato requerido
  const [errorMessage, setErrorMessage] = useState<string>('');

  function getCurrentDateFormatted(): string {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear().toString();
    return `${year}-${month}-${day}`;
  }

  const handleSubmit = () => {
    if (amount <= 0) {
      setErrorMessage('El monto debe ser mayor que cero.');
      return;
    }
  
    // Verificar si la fecha es válida (es decir, no es futura)
    if (!isPastDate(date)) {
      setErrorMessage('Solo puedes elegir fechas pasadas.');
      return;
    }
  
    // Convertir la fecha al formato requerido (yyyy-mm-dd) para almacenamiento
    const formattedDate = date;
    onSubmit(description, amount, formattedDate);
    setDescription('');
    setAmount(0);
    setDate(getCurrentDateFormatted()); // Reiniciar a la fecha actual
    setErrorMessage('');
  };
  

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value <= 0) {
      setErrorMessage('El monto debe ser mayor que cero.');
    } else {
      setAmount(value);
      setErrorMessage('');
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Validar si la fecha es mayor que la fecha actual
    if (!isValidDate(value) || !isPastDate(value)) {
      setErrorMessage('Solo puedes elegir fechas pasadas.');
    } else {
      setErrorMessage('');
    }

    // Actualizar el estado de la fecha
    setDate(value);
  };

  const isValidDate = (dateString: string): boolean => {
    const pattern = /^(\d{4})-(\d{2})-(\d{2})$/;
    return pattern.test(dateString);
  };

  const isPastDate = (dateString: string): boolean => {
    const [year, month, day] = dateString.split('-').map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const currentDay = currentDate.getDate();

    // Validar que la fecha no sea mayor que la fecha actual
    if (year > currentYear) return false;
    if (year === currentYear && month > currentMonth) return false;
    if (year === currentYear && month === currentMonth && day > currentDay) return false;

    return true;
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
            {amount <= 0 && (
              <p className="text-red-500 text-xs mt-1">El monto debe ser mayor que cero.</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Fecha (yyyy-mm-dd)</label>
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
              <p className="text-red-500 text-xs mt-1">Formato de fecha inválido (yyyy-mm-dd).</p>
            )}
            {!isPastDate(date) && (
              <p className="text-red-500 text-xs mt-1">Solo puedes elegir fechas pasadas.</p>
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
