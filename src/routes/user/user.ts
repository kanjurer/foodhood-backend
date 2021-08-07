import bcrypt from 'bcrypt';
import { Router, Request, Response } from 'express';
import { IUser, IUserFrontend } from '../../Interfaces';
import User from '../../models/user.model';

const user = Router();

user
  .get('/', function (req: Request, res: Response) {
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
  })
  .put('/:infoToBeEdited', async function (req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json('Req.user not found');
    }
    try {
      if (req.params.infoToBeEdited === 'nameOfUser') {
        if (!req.body.nameOfUser) {
          return res.status(400).json('Bad Request');
        }

        const newUser: IUser | null = await User.findOneAndUpdate(
          { username: req.user.username },
          { $set: { nameOfUser: req.body.nameOfUser } },
          { new: true }
        );

        if (newUser === null) {
          return res.status(404).json('Sorry');
        }

        req.login(newUser, (err: any) => {
          console.log(err);
        });
        console.log('done bro');
        return res.status(200).json(req.user);
      }

      if (req.params.infoToBeEdited === 'password') {
        if (!req.body.oldPassword || !req.body.newPassword) {
          return res.status(400).json('Bad Request');
        }

        if (!(await bcrypt.compare(req.body.oldPassword, req.user.password))) {
          return res.json('Old password is incorrect!');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

        const newUser: IUser | null = await User.findOneAndUpdate(
          { username: req.user.username },
          { $set: { password: hashedPassword } },
          { new: true }
        );
        if (newUser === null) {
          return res.status(404).json('Sorry');
        }

        req.login(newUser, (err: any) => {
          console.log(err);
        });
        console.log('done bro');
        return res.status(200).json(req.user);
      } else {
        return res.status(400).json('Bad Req');
      }
    } catch (err) {
      return res.status(500).json('Oops! Something went wrong');
    }
  });

export default user;
