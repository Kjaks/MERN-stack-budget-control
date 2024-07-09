import { Request, Response } from 'express';
import Balance from '../models/balance.model';
import Transaction from '../models/transaction.model';
import moment from 'moment';

// Función para calcular los ahorros mensuales
export const calculateMonthlySavings = async (req: Request, res: Response) => {
    try {
        const { userId, month } = req.params;

        // Obtener las transacciones del mes especificado
        const startDate = moment(month, 'YYYY-MM').startOf('month').toISOString();
        const endDate = moment(month, 'YYYY-MM').endOf('month').toISOString();

        const transactions = await Transaction.find({
            userId,
            date: { $gte: startDate, $lte: endDate }
        });

        // Calcular el total de ingresos y gastos
        let totalIncome = 0;
        let totalExpenses = 0;

        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                totalIncome += transaction.amount;
            } else {
                totalExpenses += transaction.amount;
            }
        });

        // Calcular los ahorros (ingresos - gastos)
        const savings = totalIncome - totalExpenses;

        // Crear o actualizar el balance mensual en la base de datos
        const balance = await Balance.findOneAndUpdate(
            { userId, month },
            { userId, month, expenses: totalExpenses, savings },
            { upsert: true, new: true }
        );

        res.status(200).json(balance);
    } catch (error) {
        console.error('Error al calcular los ahorros mensuales:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Función para obtener los balances de un usuario por mes específico
export const getBalances = async (req: Request, res: Response) => {
    try {
        const { userId, month } = req.params;

        // Obtener el balance del mes específico
        const balance = await Balance.findOne({ userId, month });

        if (!balance) {
            return res.status(404).json({ message: 'No se encontró el balance para el mes especificado' });
        }

        res.status(200).json(balance);
    } catch (error) {
        console.error('Error al obtener el balance mensual:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
