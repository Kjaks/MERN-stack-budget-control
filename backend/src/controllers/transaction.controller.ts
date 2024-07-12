import { Request, Response } from 'express';
import mongoose from 'mongoose';
import TransactionModel, { ITransaction } from '../models/transaction.model';

// Define the structure of a Transaction object
interface Transaction {
  _id: string;
  description: string;
  amount: number;
  type: string;
  date: Date;
}

// Add a transaction (income or expense)
export const addTransaction = async (req: Request, res: Response) => {
  const { userId, description, amount, type, date } = req.body;

  try {
    const transaction = new TransactionModel({
      userId,
      description,
      amount,
      type,
      date: new Date(date)
    });

    await transaction.save();

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Error adding the transaction.' });
  }
};

// Update a transaction
export const updateTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, amount, type, date } = req.body;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid transaction ID.' }); 
    }

    const updateFields: Partial<Transaction> = {};
    if (description) updateFields.description = description;
    if (amount) updateFields.amount = amount;
    if (type) updateFields.type = type;
    if (date) updateFields.date = new Date(date);

    const updatedTransaction = await TransactionModel.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedTransaction) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Error updating the transaction.' });
  }
};

// Get transactions by user
export const getTransactions = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const transactions = await TransactionModel.find({ userId });

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ error: 'Error getting the transactions.' });
  }
};

// Delete a transaction by ID
export const deleteTransaction = async (req: Request, res: Response) => {
  const { id } = req.params; 

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid transaction ID.' }); 
    }

    const deletedTransaction = await TransactionModel.findByIdAndDelete(id); 

    if (!deletedTransaction) {
      return res.status(404).json({ error: 'Transaction not found.' }); 
    }

    res.status(200).json({ message: 'Transaction deleted successfully.', deletedTransaction }); 
  } catch (error) {
    console.error('Error deleting transaction:', error); 
    res.status(500).json({ error: 'Error deleting the transaction.' }); 
  }
};
