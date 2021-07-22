import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/foodhood', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const foodItems = require('./routes/foodItems');
app.use('/foodItems', foodItems);

const users = require('./routes/users');
app.use('/users', users);

app.listen(3001, () => console.log('App is running on port 3001'));
