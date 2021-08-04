import { Router, Request, Response, NextFunction } from 'express';

const chefPosts = Router();

chefPosts.use(isChef);

import { IDish, IFoodItem, IUser } from '../../Interfaces';
import FoodItem from '../../models/foodItem.model';

export default chefPosts
  .get('/chefPosts', function (req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).send('Req.user not found');
    }
    try {
      FoodItem.find(
        { madeByUser: req.user.username },
        function (err: Error, foodItems: IFoodItem[]) {
          if (err) {
            return res.status(404).send('Oh uh, something went wrong');
          }
          res.status(200).json(foodItems);
        }
      );
    } catch (err) {
      res.status(500).send('Oops! Something went wrong');
    }
  })

  .post('/chefPosts', function (req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).send('Req.user not found');
    }
    try {
      if (!req.body) {
        return res.status(400).send('Bad Request');
      }
      const dish: IDish = {
        ...req.body,
        madeByUser: req.user.username,
      };
      const foodItem = new FoodItem(dish);

      console.log(req.body);
      foodItem.save(function (err) {
        if (err) {
          return res.status(400).send(err);
        }
        res.status(200).send('Posted');
      });
    } catch (err) {
      res.status(500).send('Oops! Something went wrong');
    }
  })

  .put('/chefPosts/:_id', function (req: Request, res: Response) {
    try {
      if (!req.body) {
        return res.status(400).send('Bad Request');
      }

      const dish: IDish = req.body;
      FoodItem.updateOne(
        { _id: req.params._id, madeByUser: (req.user as IUser).username },
        dish
      ).then(() => res.status(200).send('Updated'));
    } catch (err) {
      res.status(500).send('Oops! Something went wrong');
    }
  })
  .delete('/chefPosts/:_id', function (req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).send('Req.user not found');
      }

      FoodItem.deleteOne({
        _id: req.params._id,
        madeByUser: req.user.username,
      }).then(() => res.status(200).send('Deleted'));
    } catch (err) {
      res.status(500).send('Oops! Something went wrong');
    }
  });

function isChef(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).send('Req.user not found');
  }

  if (req.user.role !== 'chef') {
    return res.status(401).send('Not a chef');
  }

  next();
}
