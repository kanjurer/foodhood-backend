import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';

import initializePassport from './passport-config';
import users from './routes/users';
import signup from './routes/signup';
import foods from './routes/foods';
import chefPosts from './routes/chefPosts';

const app: Express = express();

initializePassport(passport);

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(
  session({
    secret: 'thisissecret',
    cookie: { maxAge: 300000 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// mongoDB connection
mongoose.connect('mongodb://localhost:27017/foodhood', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use('/foods', foods);

app.use(
  '/login',
  checkNotAuthenticated,
  passport.authenticate('local', {}),
  (req: Request, res: Response) => {
    res.json('LoggedInToServer');
  }
);

app.use('/logout', checkAuthenticated, (req: Request, res: Response) => {
  req.session.destroy(function (err) {
    res.clearCookie('connect.sid').status(201).send('Logged out successfully');
  });
});

app.use('/signup', signup, (req: Request, res: Response) => {
  res.redirect('/login');
});

app.use('/user', checkAuthenticated, chefPosts);

app.use('/users', checkAuthenticated, users);

app.listen(3001, () => console.log('App is running on port 3001'));

function checkNotAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return res.status(201).send('Already Logged In!');
  }
  next();
}

function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    console.log('passed');
    return next();
  }
  console.log('not passed');
  return res.status(401).send('Not Logged In Bro!');
}
