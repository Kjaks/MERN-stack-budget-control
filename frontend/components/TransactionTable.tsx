import React from 'react';

const transactions = [
    { id: 1, description: 'Compra en Supermercado', amount: -50 },
    { id: 2, description: 'Pago de Servicios', amount: -100 },
    { id: 3, description: 'Sueldo', amount: 1500 },
    { id: 4, description: 'Alquiler', amount: -800 },
    { id: 5, description: 'Compras en línea', amount: -200 },
    { id: 6, description: 'Ventas', amount: 1200 },
    { id: 7, description: 'Gasolina', amount: -70 }
];

const TransactionTable: React.FC = () => {
    return (
        <section className="h-full flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg overflow-auto max-h-[10rem] w-full md:w-3/4 lg:w-1/2">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map(transaction => (
                            <tr key={transaction.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{transaction.description}</td>
                                <td className={`px-6 py-4 whitespace-nowrap ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ${transaction.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default TransactionTable;
