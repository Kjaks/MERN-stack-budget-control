import mongoose, { Schema, Document } from 'mongoose';

// Interface to define the structure of a User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

// Define the schema for the User model
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

export default mongoose.model<IUser>('User', UserSchema);
