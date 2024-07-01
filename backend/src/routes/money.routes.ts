import { Router } from 'express';
import { addExpense, getExpenses } from '../controllers/expense.controller';
import { calculateMonthlySavings, getBalances } from '../controllers/balance.controller';

const router = Router();

// Rutas de gastos
router.post('/expenses', addExpense);
router.get('/expenses/:userId', getExpenses);

// Rutas de balances
router.post('/balances/:userId/:month/calculate', calculateMonthlySavings);
router.get('/balances/:userId', getBalances);

export default router;
