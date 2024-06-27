import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    password_hash: string;
    email: string;
    created_at: Date;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now }
});

const User = model<IUser>('User', userSchema);

export default User;
export { IUser };