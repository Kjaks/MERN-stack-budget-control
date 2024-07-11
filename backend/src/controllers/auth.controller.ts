import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    let user: IUser | null = await User.findOne({ email });
    if (user) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, `${JWT_SECRET}`);

    res.status(201).json({ message: 'User registered successfully', token, name: user.name, userId: user._id });
  } catch (error) {
    const err = error as Error;
    console.error('Error in registration:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// User login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    res.status(200).json({ message: 'Login successful', name: user.name, userId: user._id });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
