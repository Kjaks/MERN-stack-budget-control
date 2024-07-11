import React from 'react';

// Define the structure of a Transaction object
interface Transaction {
  _id: string;
  userId: string;
  description: string;
  amount: number;
  type: string;
  date: string;
}

// Define the props for the TransactionTable component
interface TransactionTableProps {
  transactions: Transaction[];
}

// TransactionTable component definition
const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const sortedTransactions = transactions.sort((a, b) => {
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TransactionTable;
