import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
}

const TransactionSchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  date: { type: Date, required: true }
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
