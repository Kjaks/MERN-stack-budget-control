import React, { useEffect, useState } from 'react';
import FinancialSummary from '../components/FinancialSummary';
import TransactionTable from '../components/TransactionTable';
import Image from 'next/image';

const ClientData: React.FC = () => {
    const [userName, setUserName] = useState<string | null>(null);
    const [balance, setBalance] = useState<number>(0);
    const [expenses, setExpenses] = useState<number>(0);

    useEffect(() => {
        // Simulación de carga de datos desde localStorage
        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
            setUserName(storedUserName);
            setBalance(1200); // Simulación de saldo
            setExpenses(400); // Simulación de gastos
        }
    }, []);

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
                    <a href="/">
                        <Image src="/pngwing.com.png" alt="Logout" width={48} height={48} />
                    </a>
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
                    <a href="/add-income" className="bg-green-500 text-white py-3 px-6 rounded-lg shadow hover:bg-green-600 text-center">Agregar Ingreso</a>
                    <a href="/add-expense" className="bg-red-500 text-white py-3 px-6 rounded-lg shadow hover:bg-red-600 text-center">Agregar Gasto</a>
                </section>
            </div>

            <footer className="text-center text-gray-600 mt-6 col-span-3">
                <p>&copy; {new Date().getFullYear()} Karolis Jakas Stirbyte</p>
            </footer>
        </div>
    );
};

export default ClientData;
