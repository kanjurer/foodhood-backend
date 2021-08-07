import { Router, Request, Response } from 'express';
import { IUser, IUserFrontend } from '../Interfaces';
import User from '../models/user.model';

const users = Router();

users.get('/user/:username', function (req: Request, res: Response) {
  try {
    User.find({ username: req.params.username }, function (err, user: IUser) {
      if (err) {
        return res.status(404).send('Not found');
      }
      return res.status(200).json(user);
    });
  } catch (err) {
    res.status(500).send('Oops! Something went wrong');
  }

  if (!req.user) {
    return res.status(401).json('User not found!');
  }

  const user: IUserFrontend = {
    username: req.user.username,
    _id: req.user._id,
    nameOfUser: req.user.nameOfUser,
    role: req.user.role,
  };
  return res.status(200).json(user);
});

export default users;
