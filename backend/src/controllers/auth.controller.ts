import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_SECRET_KEY, JWT_EXPIRATION_TIME } from '../config/jwt.config';
import { User } from '../models/user.model';
import * as UserService from '../services/user.service'; // Importar funciones de servicio

export const checkRegisterEndpoint = (req: Request, res: Response): void => {
    res.json({ message: 'El endpoint /api/register funciona correctamente' });
};

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body as User;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await UserService.findUserByEmail(email);
        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario
        const newUser = await UserService.createUser({
            username,
            email,
            password: hashedPassword
        });

        // Generar token JWT
        const token = jwt.sign({ email: newUser.email }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRATION_TIME });

        res.json({ token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as { email: string; password: string };

    try {
        // Verificar si el usuario existe
        const user = await UserService.findUserByEmail(email);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Verificar la contraseña
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Generar token JWT
        const token = jwt.sign({ email: user.email }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRATION_TIME });

        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
