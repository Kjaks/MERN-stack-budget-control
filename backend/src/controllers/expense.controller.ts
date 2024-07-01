import { Request, Response } from 'express';
import Expense, { IExpense } from '../models/expenses.model';

export const addExpense = async (req: Request, res: Response): Promise<void> => {
  const { userId, amount, category, description, date } = req.body;

  try {
    const expense = new Expense({ userId, amount, category, description, date });
    await expense.save();
    res.status(201).json({ message: 'Gasto registrado correctamente', expense });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el gasto' });
  }
};

export const getExpenses = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const expenses = await Expense.find({ userId });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los gastos' });
  }
};
