import { Request, Response } from 'express';
import Transaction from '../models/transaction.model';

// Add a transaction (income or expense)
export const addTransaction = async (req: Request, res: Response) => {
  const { userId, description, amount, type, date } = req.body;

  try {
    const transaction = new Transaction({
      userId,
      description,
      amount,
      type,
      date: new Date(date) 
    });

    await transaction.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Error adding the transaction.' });
  }
};

// Get transactions by user
export const getTransactions = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const transactions = await Transaction.find({ userId });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error getting the transactions.' });
  }
};
