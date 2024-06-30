// types.d.ts

import { Request } from 'express';
import { Document } from 'mongoose'; // Importa según sea necesario para tus modelos

// Extender la interfaz Request de Express
declare module 'express' {
  interface Request {
    userId?: string; // Define la propiedad userId opcionalmente
  }
}

// Extender la interfaz Document de Mongoose si es necesario para tus modelos
declare module 'mongoose' {
  interface Document {
    // Define las propiedades adicionales si es necesario para tus modelos de Mongoose
  }
}
