// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_secret_key'; // Cambiar por una clave segura en producción

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'No se proporcionó un token de autenticación' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Asigna el userId al objeto de solicitud extendido
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token de autenticación inválido' });
  }
};
