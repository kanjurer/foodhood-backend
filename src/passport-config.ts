import bcrypt from 'bcrypt';
import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { IUser } from './Interfaces';
import User from './models/user.model';

export default function initializePassport(passport: PassportStatic) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'username', passwordField: 'password' },
      authenticateUser
    )
  );
  passport.serializeUser((user, done) => {
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
