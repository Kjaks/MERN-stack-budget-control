import { Request, Response } from 'express';
import Transaction, { ITransaction } from '../models/transaction.model';

// Añadir transacción (ingreso o gasto)
export const addTransaction = async (req: Request, res: Response) => {
  const { userId, description, amount, type, date } = req.body;

  if (amount <= 0) {
    return res.status(400).json({ error: 'El monto debe ser positivo.' });
  }

  try {
    const transaction = new Transaction({
      userId,
      description,
      amount,
      type,
      date: new Date(date)  // Asegurarse de que la fecha esté en el formato correcto
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir la transacción.' });
  }
};

// Obtener transacciones por usuario
export const getTransactions = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const transactions = await Transaction.find({ userId });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las transacciones.' });
  }
};
