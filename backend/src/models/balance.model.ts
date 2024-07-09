import mongoose, { Schema, Document } from 'mongoose';

export interface IBalance extends Document {
  userId: mongoose.Types.ObjectId;
  month: string; // Formato YYYY-MM
  totalIncome: number;
  totalExpenses: number;
  savings: number;
}

const BalanceSchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true },
  totalIncome: { type: Number, required: true },
  totalExpenses: { type: Number, required: true },
  savings: { type: Number, required: true }
});

export default mongoose.model<IBalance>('Balance', BalanceSchema);
