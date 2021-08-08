import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import redis, { RedisClient } from 'redis';
import connectRedis, { RedisStore } from 'connect-redis';

import initializePassport from './passport-config';
import foods from './routes/publicRoutes/foods';
import users from './routes/publicRoutes/users';
import user from './routes/authenticatedUserRoutes/user';
import chefPosts from './routes/authenticatedUserRoutes/chefPosts';

const app: Express = express();
const RedisStore: RedisStore = connectRedis(session);
const redisClient: RedisClient = redis.createClient();

initializePassport(passport);

app.use(cors(/*{ credentials: true, origin: 'http://localhost:3000' }*/));
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

// publicRoutes
app.use('/foods', foods);
app.use('/users', checkAuthenticated, users);

// authenticatedUserRoutes
app.use('/user', checkAuthenticated, user);
app.use(
  '/login',
  checkNotAuthenticated,
  passport.authenticate('local-login', {}),
  (req: Request, res: Response) => {
    return res.status(200).send('Logged in successfully');
  }
);
app.use('/logout', (req: Request, res: Response) => {
  req.logOut();
  return res.status(200).send('Logged out successfully');
});
app.use(
  '/signup',
  checkNotAuthenticated,
  passport.authenticate('local-signup', {}),
  (req: Request, res: Response) => {
    return res.status(200).send('Signed up and logged in successfully');
  }
);
app.use('/chefPosts', checkAuthenticated, chefPosts);

// app
app.listen(3001, () => console.log('App is running on port 3001'));

// check functions
function checkNotAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return res.status(200).send('Already logged in');
  }
  next();
}

function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    console.log('passed');
    return next();
  }
  console.log('not passed');
  return res.status(401).send('You are not logged in');
}
