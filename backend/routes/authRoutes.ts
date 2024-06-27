import { Router } from 'express';
import User from '../models/User';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

const router = Router();

// Ruta para registrar un usuario
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error registering user' });
  }
});

// Ruta para loguear un usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user._id.toString());
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
