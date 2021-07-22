import mongoose from 'mongoose';

import { IUser } from '../Interfaces';

const { Schema } = mongoose;

const userSchema = new Schema<IUser>({
  username: String,
  nameOfUser: String,
  password: String,
  role: String,
});

const User = mongoose.model('user', userSchema, 'users');
module.exports = User;
