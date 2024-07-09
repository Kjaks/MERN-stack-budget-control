import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { addTransaction, getTransactions } from '../controllers/transaction.controller';
import { calculateMonthlySavings, getBalances } from '../controllers/balance.controller';
const router: Router = Router();

router.post('/register', register);
router.post('/login', login);

// Rutas de transacciones (ingresos y gastos)
router.post('/transactions', addTransaction);
router.get('/transactions/:userId', getTransactions);

// Rutas de balances
router.post('/balances/:userId/:month/calculate', calculateMonthlySavings);
router.get('/balances/:userId', getBalances);

export default router;
