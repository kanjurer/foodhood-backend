import mongoose from 'mongoose';
import { IUser } from '../Interfaces';

const { Schema } = mongoose;

const userSchema = new Schema<IUser>({
  username: {
    required: [true, 'Username is required!'],
    min: [3, 'Should be a minimum of 3 characters!'],
    max: [14, 'Only max of 14 characters allowed'],
    type: String,
    unique: [true, 'Username already exists!'],
  },
  nameOfUser: {
    required: true,
    type: String,
    min: [3, 'Should be a minimum of 3 characters!'],
    max: [30, 'Only max of 30 characters allowed'],
  },
  password: {
    required: true,
    type: String,
  },
  role: {
    required: true,
    type: String,
    default: 'consumer',
    values: ['consumer', 'chef'],
  },
});

const User = mongoose.model<IUser>('user', userSchema, 'users');
export default User;
