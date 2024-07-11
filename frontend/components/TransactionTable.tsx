import React from 'react';

interface Transaction {
  _id: string;
  userId: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onEdit, onDelete }) => {
  // Ensure to create a new sorted array to avoid mutating original data
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <section className="h-full flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg overflow-auto max-h-[10rem] w-full md:w-3/4 lg:w-1/2">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTransactions.map(transaction => (
              <tr key={transaction._id}>
                <td className="px-6 py-4 whitespace-nowrap">{transaction.description}</td>
                <td className={`px-6 py-4 whitespace-nowrap ${transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                  {transaction.type === 'expense' ? '-' : ''}${Math.abs(transaction.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(transaction.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onEdit(transaction._id)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(transaction._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
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
