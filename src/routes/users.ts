import { Router, Request, Response } from 'express';
import { IUserFrontend } from '../Interfaces';

const users = Router();

users.get('/user', function (req: Request, res: Response) {
  if (!req.user) {
    return res.status(401);
  }
  return res.json({
    username: req.user.username,
    _id: req.user._id,
    nameOfUser: req.user.nameOfUser,
    role: req.user.role,
  });
});

export default users;
