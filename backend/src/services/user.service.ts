import User, { User as UserInterface } from '../models/user.model';

export const findUserByEmail = async (email: string): Promise<UserInterface | null> => {
    return User.findOne({ email }).exec();
};

export const createUser = async (userData: Partial<UserInterface>): Promise<UserInterface> => {
    return User.create(userData);
};
