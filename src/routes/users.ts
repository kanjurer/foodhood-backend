import { Router, Request, Response } from 'express';
import { IUserFrontend } from '../Interfaces';

const users = Router();

users.get('/user', function (req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json('User not fount!');
  }

  const user: IUserFrontend = {
    username: req.user.username,
    _id: req.user._id,
    nameOfUser: req.user.nameOfUser,
    role: req.user.role,
  };

  return res.status(204).json(user);
});

export default users;
