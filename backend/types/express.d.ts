import { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
      // Puedes agregar más propiedades aquí según sea necesario
    }

    interface Request {
      user?: User;
    }
  }
}
