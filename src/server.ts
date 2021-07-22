import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

import userEntry from './routes/userEntry';
import foods from './routes/foods';
import chefPosts from './routes/chefPosts';

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

app.use('/foods', foods);
app.use('/', userEntry);
app.use('/users', chefPosts);

app.listen(3001, () => console.log('App is running on port 3001'));
