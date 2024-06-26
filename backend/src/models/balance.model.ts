import mongoose, { Schema, Document } from 'mongoose';

export interface IBalance extends Document {
  userId: mongoose.Types.ObjectId;
  month: string; // Formato YYYY-MM
  initialBalance: number;
  expenses: number;
  savings: number;
}

const BalanceSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true },
  initialBalance: { type: Number, required: true },
  expenses: { type: Number, required: true },
  savings: { type: Number, required: true }
});

export default mongoose.model<IBalance>('Balance', BalanceSchema);
