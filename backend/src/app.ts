import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB } from './config/mongodb.config';
import authRoutes from './routes/auth.routes';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api', authRoutes);

// Conectar a MongoDB y luego iniciar el servidor
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
