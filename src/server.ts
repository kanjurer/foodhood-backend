import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

import users from './routes/users';
import foodItems from './routes/foodItems';

const app = express();

app.use(cors());
app.use(express.json());

// mongoDB connection
mongoose.connect('mongodb://localhost:27017/foodhood', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use('/foodItems', foodItems);
app.use('/users', users);

app.listen(3001, () => console.log('App is running on port 3001'));
