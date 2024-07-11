import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { addTransaction, updateTransaction, getTransactions, deleteTransaction } from '../controllers/transaction.controller';

// Create a new Router instance
const router: Router = Router();

// Route to handle user registration
router.post('/register', register);

// Route to handle user login
router.post('/login', login);

router.post('/transactions', addTransaction);  // Endpoint to add a transaction

router.put('/transactions/:id', updateTransaction);  // Endpoint to update a transaction by ID

router.get('/transactions/:userId', getTransactions);  // Endpoint to get transactions by user ID

router.delete('/transactions/:id', deleteTransaction);  // Endpoint to delete a transaction by ID


export default router;
