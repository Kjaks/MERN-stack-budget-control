import { Request, Response } from 'express';
import Balance, { IBalance } from '../models/balance.model';
import Expense from '../models/expenses.model';
import mongoose from 'mongoose';

export const calculateMonthlySavings = async (req: Request, res: Response): Promise<void> => {
  const { userId, month } = req.params;

  try {
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const expenses = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: {
            $gte: startDate,
            $lt: endDate
          }
        }
      },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: '$amount' }
        }
      }
    ]);

    const totalExpenses = expenses.length ? expenses[0].totalExpenses : 0;
    
    let balance = await Balance.findOne({ userId, month });

    if (!balance) {
      res.status(404).json({ error: 'Balance inicial no encontrado para el mes especificado' });
      return;
    }

    const savings = balance.initialBalance - totalExpenses;

    balance.expenses = totalExpenses;
    balance.savings = savings;
    await balance.save();

    res.status(200).json({ message: 'Ahorros mensuales calculados y registrados', balance });
  } catch (error) {
    res.status(500).json({ error: 'Error al calcular los ahorros mensuales' });
  }
};

export const getBalances = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const balances = await Balance.find({ userId }).sort({ month: 1 });
    res.status(200).json(balances);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los balances' });
  }
};
