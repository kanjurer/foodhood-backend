import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { IUser } from '../Interfaces';
const router = Router();
const User = require('../models/user.model');

router
  .get('/', function (req: Request, res: Response) {})
  .post('/create', async function (req: Request, res: Response) {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const user = new User({
        username: req.body.username,
        nameOfUser: req.body.nameOfUser,
        passwordHash: hashedPassword,
        role: req.body.role,
      });
      user.save();
    } catch (err) {
      res.status(500).send();
    }
  })
  .post('/login', function (req: Request, res: Response) {
    User.find(
      { username: req.body.username },
      async function (err: Error, user: IUser) {
        if (await bcrypt.compare(req.body.password, user.password)) {
          res.send('Success');
        } else {
          res.send('Not Allowed');
        }
      }
    );
  });

module.exports = router;
