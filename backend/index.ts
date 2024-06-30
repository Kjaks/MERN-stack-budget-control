// server.ts
import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import messageRoutes from './src/routes/auth.routes';

dotenv.config();

const app: Application = express();

// Middleware para permitir CORS
app.use(cors({
  origin: 'http://localhost:3000', // Reemplaza con el origen de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
  credentials: true, // Permitir el envío de cookies o autenticación
}));

// Middleware
app.use(express.json());

// Obtener la cadena de conexión desde las variables de entorno
const MONGODB_URI = process.env.MONGO_URI;

// Conectar a MongoDB
mongoose.connect(`${MONGODB_URI}`)
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error de conexión a MongoDB:', err));

// Rutas
app.use('/api', messageRoutes);

// Puerto del servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
