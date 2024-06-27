// services/authService.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { Document } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = `${process.env.JWT_TOKEN}`;

export const registerUser = async (username: string, plainPassword: string, email: string): Promise<IUser> => {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(plainPassword, saltRounds);

    const newUser = new User({
        username: username,
        password_hash: passwordHash,
        email: email,
        created_at: new Date()
    });

    return await newUser.save();
};

export const loginUser = async (username: string, plainPassword: string): Promise<string> => {
    const user = await User.findOne({ username: username });

    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const passwordMatch = await bcrypt.compare(plainPassword, user.password_hash);

    if (!passwordMatch) {
        throw new Error('Contraseña incorrecta');
    }

    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
    return token;
};
