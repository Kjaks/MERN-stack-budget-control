import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './config/db';
import authRoutes from './routes/authRoutes';
import { authMiddleware } from './middlewares/authMiddleware';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let mongodbConnected = false;

const startServer = async () => {
    try {
        await connectToDatabase();
        mongodbConnected = true;

        app.listen(PORT, () => {
            console.log(`Server is up and running at http://localhost:${PORT}`);
        });

        app.get('/api/message', (req, res) => {
            if (mongodbConnected) {
                res.json({ message: `Server and MONGODB is up and running at http://localhost:${PORT}` });
            } else {
                res.status(500).json({ error: 'MongoDB connection not established' });
            }
        });

        // Rutas de autenticación
        app.use('/api/auth', authRoutes);

        // Ruta protegida de ejemplo
        app.get('/api/protected', authMiddleware, (req, res) => {
            res.json({ message: 'This is a protected route' });
        });

    } catch (error) {
        console.error('Failed to start server', error);
    }
};

startServer();
