// pages/ClientData.tsx
import React, { useEffect, useState } from 'react';
import FinancialSummary from '../components/FinancialSummary';
import TransactionTable from '../components/TransactionTable';
import Image from 'next/image';
import ExpensePopup from '../components/PopUp';

const fetchUserData = async (): Promise<{ userName: string; balance: number; expenses: number } | null> => {
    try {
        // Simulación de carga de datos desde un servicio externo
        return {
            userName: 'Usuario Ejemplo',
            balance: 1200,  // Aquí obtendrías el saldo actual desde tu backend
            expenses: 400   // Aquí obtendrías los gastos desde tu backend
        };
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        return null;
    }
};

const ClientData: React.FC = () => {
    const [userName, setUserName] = useState<string | null>(null);
    const [balance, setBalance] = useState<number>(0);
    const [expenses, setExpenses] = useState<number>(0);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [popupType, setPopupType] = useState<'income' | 'expense' | null>(null); // Tipo de popup: ingreso o gasto

    useEffect(() => {
        const fetchData = async () => {
            const userData = await fetchUserData();
            if (userData) {
                setUserName(userData.userName);
                setBalance(userData.balance);
                setExpenses(userData.expenses);
            }
        };

        fetchData();
    }, []);

    const handleExpenseSubmit = (description: string, amount: number) => {
        console.log('Descripción Gasto:', description);
        console.log('Valor Gasto:', amount);
        // Aquí puedes realizar operaciones adicionales como enviar datos al backend
        setIsPopupOpen(false); // Cerrar el popup después de enviar
    };

    const handleIncomeSubmit = (description: string, amount: number) => {
        console.log('Descripción Ingreso:', description);
        console.log('Valor Ingreso:', amount);
        // Aquí puedes realizar operaciones adicionales como enviar datos al backend
        setIsPopupOpen(false); // Cerrar el popup después de enviar
    };

    const handlePopupOpen = (type: 'income' | 'expense') => {
        setPopupType(type);
        setIsPopupOpen(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 max-w-full grid grid-cols-3 gap-10 p-1">
            <header className="col-span-3 h-full flex items-center justify-between px-4">
                <div className="flex items-center justify-center col-span-1">
                    {/* Columna Vacía Izquierda */}
                </div>
                <div className="flex items-center justify-self-stretch col-span-1">
                    {/* Columna Centro */}
                    <h1 className="text-4xl font-bold text-gray-800 text-center pl-12">Hola, {userName}!</h1>
                </div>
                <div className="flex items-center justify-end col-span-1">
                    {/* Columna Derecha */}
                    <button>
                        <a href='/'>
                            <Image src="/pngwing.com.png" alt="Logout" width={48} height={48} />
                        </a>
                    </button>
                </div>
            </header>

            <div className="col-span-3">
                {/* Contenido de la primera fila de tres columnas */}
                <FinancialSummary balance={balance} expenses={expenses} />
            </div>
            
            <div className="col-span-3">
                {/* Contenido de la segunda fila de tres columnas */}
                <TransactionTable />
            </div>

            <div className="col-span-3 flex items-center justify-center">
                {/* Contenido de la tercera fila de tres columnas */}
                <section className="flex flex-col md:flex-row items-center justify-around gap-4 w-1/2 g-1/2">
                    <button onClick={() => handlePopupOpen('income')} className="bg-green-500 text-white py-3 px-6 rounded-lg shadow hover:bg-green-600 text-center">Agregar Ingreso</button>
                    <button onClick={() => handlePopupOpen('expense')} className="bg-red-500 text-white py-3 px-6 rounded-lg shadow hover:bg-red-600 text-center">Agregar Gasto</button>
                </section>
            </div>

            <footer className="text-center text-gray-600 mt-6 col-span-3">
                <p>&copy; {new Date().getFullYear()} Karolis Jakas Stirbyte</p>
            </footer>

            {/* Popup de Agregar Ingreso o Gasto */}
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
