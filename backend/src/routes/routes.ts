import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { addTransaction, getTransactions } from '../controllers/transaction.controller';

// Create a new Router instance
const router: Router = Router();

// Route to handle user registration
router.post('/register', register);

// Route to handle user login
router.post('/login', login);

// Route to add a new transaction
router.post('/transactions', addTransaction);

// Route to get transactions for a specific user by userId
router.get('/transactions/:userId', getTransactions);

export default router;
