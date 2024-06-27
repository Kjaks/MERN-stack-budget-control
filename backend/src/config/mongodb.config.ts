import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI; // Cambia esto por tu URI de MongoDB

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(`${MONGO_URI}`, {
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Salir del proceso con error
    }
};
