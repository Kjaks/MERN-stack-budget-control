// controllers/protectedController.ts
import { Request, Response } from 'express';

export const getProtectedData = async (req: Request, res: Response): Promise<void> => {
  try {
    // Utiliza req.userId sin errores de TypeScript
    const userId = req.userId;

    res.status(200).json({ message: 'Datos protegidos obtenidos correctamente', userId });
  } catch (error) {
    res.status(500).json({ error: "BAAZ"});
  }
};
