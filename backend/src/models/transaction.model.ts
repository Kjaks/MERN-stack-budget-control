import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITransaction extends Document {
  userId: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
}

const transactionSchema = new Schema<ITransaction>({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  date: { type: Date, required: true },
});

const TransactionModel: Model<ITransaction> = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default TransactionModel;
