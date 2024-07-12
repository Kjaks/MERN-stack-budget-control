import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { addTransaction, updateTransaction, getTransactions, deleteTransaction } from '../controllers/transaction.controller';

// Create a new Router instance
const router: Router = Router();

// Route to handle user registration
router.post('/register', register);

// Route to handle user login
router.post('/login', login);

// Route to add a transaction
router.post('/transactions', addTransaction);

// Route to update a transaction by ID
router.put('/transactions/:id', updateTransaction);  

// Route to get transactions by user ID
router.get('/transactions/:userId', getTransactions); 

// Route to delete a transaction by ID
router.delete('/transactions/:id', deleteTransaction);  


export default router;
