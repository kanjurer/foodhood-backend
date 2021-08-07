import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';

import initializePassport from './passport-config';
import user from './routes/user/user';
import foods from './routes/foods';
import chefPosts from './routes/user/chefPosts';
import users from './routes/users';

const app: Express = express();
const RedisStore = connectRedis(session);
let redisClient = redis.createClient();

initializePassport(passport);

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: 'thisissecret',
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
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
  passport.authenticate('local-login', {}),
  (req: Request, res: Response) => {
    res.status(200).send('Logged in successfully');
  }
);

app.use('/logout', (req: Request, res: Response) => {
  req.logOut();
  res.send('Logged out successfully');
});

app.use(
  '/signup',
  checkNotAuthenticated,
  passport.authenticate('local-signup', {}),
  (req: Request, res: Response) => {
    res.status(200).send('Signed up and logged in successfully');
  }
);

app.use('/chefPosts', checkAuthenticated, chefPosts);
app.use('/users', checkAuthenticated, users);
app.use('/user', checkAuthenticated, user);

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
  return res.status(401).send('User not logged in');
}
