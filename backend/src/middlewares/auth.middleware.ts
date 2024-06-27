import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config/jwt.config';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY) as { email: string };
        req.body.currentUserEmail = decoded.email; // Guardamos el email del usuario en el cuerpo de la solicitud
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
