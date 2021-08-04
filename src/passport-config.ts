import bcrypt from 'bcrypt';
import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Request } from 'express';

import { IUser } from './Interfaces';
import User from './models/user.model';

export default function initializePassport(passport: PassportStatic) {
  passport.use(
    'local-login',
    new LocalStrategy(
      { usernameField: 'username', passwordField: 'password' },
      authenticateUser
    )
  );

  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
      },
      registerUser
    )
  );
  passport.serializeUser((user, done) => {
    console.log('serialised user');
    return done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, function (err: Error, user: IUser) {
      return done(null, user);
    });
  });
}

// a parameter of LocalStrategy constructor
const authenticateUser = (username: string, password: string, done: any) => {
  User.findOne(
    { username: username },
    async function (err: Error, user: IUser) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      try {
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user);
        }
        return done(null, false, { message: 'Password incorrect!' });
      } catch (error) {
        done(error);
      }
    }
  );
};

const registerUser = (
  req: Request,
  username: string,
  password: string,
  done: any
) => {
  User.findOne(
    { username: username },
    async function (err: Error, user: IUser) {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, false, { message: 'User already exists!' });
      }
      try {
        if (
          !req.body.password ||
          !req.body.username ||
          !req.body.nameOfUser ||
          !req.body.role
        ) {
          return done(null, false, { message: 'Wrong data!' });
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
          username: req.body.username,
          nameOfUser: req.body.nameOfUser,
          password: hashedPassword,
          role: req.body.role,
        });

        user.save(function (err) {
          if (err) {
            return done(err, false);
          }
        });
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  );
};
