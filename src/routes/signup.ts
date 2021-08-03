import bcrypt from 'bcrypt';
import { Router, Request, Response, NextFunction } from 'express';

const signup = Router();

import User from '../models/user.model';

export default signup.post(
  '/',
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      if (
        !req.body.password ||
        !req.body.username ||
        !req.body.nameOfUser ||
        !req.body.role
      ) {
        return res.status(400).send('Bad Request');
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
          return res.status(400).send('User exists already!');
        }
        res.status(201);
        next();
      });
    } catch (err) {
      res.status(500).send('Oops! Something went wrong');
    }
  }
);
