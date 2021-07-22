import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';

const users = Router();

import { IUser } from '../Interfaces';
import User from '../models/user.model';

export default users
  .get('/', function (req: Request, res: Response) {})
  .post('/signup', async function (req: Request, res: Response) {
    try {
      if (!req.body.password || !req.body.username) {
        res.status(400).send('Bad Request');
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const user = new User({
        username: req.body.username,
        nameOfUser: req.body.nameOfUser,
        passwordHash: hashedPassword,
        role: req.body.role,
      });

      user.save(function (err) {
        res.status(400).send(err); //bad request
      });
      res.status(201).send('User created successfully!');
    } catch (err) {
      res.status(500).send('Oops! Something went wrong');
    }
  })
  .post('/login', function (req: Request, res: Response) {
    if (!req.body.password || !req.body.username) {
      res.status(400).send('Bad Request');
    }

    User.find(
      { username: req.body.username },
      async function (err: Error, user: IUser) {
        if (err) {
          res.status(400).send(err);
        }

        if (user == null) {
          res.status(404).send('User not Found'); //check this laterr
        }

        try {
          if (await bcrypt.compare(req.body.password, user.password)) {
            res.status(200).send('Success');
          } else {
            res.status(403).send('Username or password is incorrect!');
          }
        } catch (err) {
          res.status(500).send('Oops! Something went wrong');
        }
      }
    );
  });
