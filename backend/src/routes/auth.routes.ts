import express from 'express';
import { register, login, checkRegisterEndpoint } from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/register', checkRegisterEndpoint);

export default router;
