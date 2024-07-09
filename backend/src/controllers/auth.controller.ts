import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    let user: IUser | null = await User.findOne({ email });
    if (user) {
      res.status(400).json({ error: 'El usuario ya existe' });
      return;
    }

    // Crear nuevo usuario
    const hashedPassword = await bcrypt.hash(password, 12);
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Generar token JWT
    const token = jwt.sign({ userId: user._id }, `${JWT_SECRET}`);

    res.status(201).json({ message: 'Usuario registrado correctamente', token });
  } catch (error) {
    const err = error as Error; // Asumiendo que error es de tipo Error
    console.error('Error en el registro:', err.message); 
    res.status(500).json({ error: err.message }); 
  };
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe
    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Enviar la respuesta con el nombre y userId del usuario
    res.status(200).json({ message: 'Inicio de sesión exitoso', name: user.name, userId: user._id });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
