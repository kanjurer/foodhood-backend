import { Router, Request, Response } from 'express';

const foodItems = Router();

import { IDish, IFoodItem } from '../Interfaces';
import FoodItem from '../models/foodItem.model';

export default foodItems
  .get('/', function (req: Request, res: Response) {
    try {
      FoodItem.find({}, function (err: Error, foodItems: IFoodItem[]) {
        if (err) {
          return res.status(404).send('Oh uh, something went wrong');
        }
        res.json(foodItems);
      });
    } catch (err) {
      console.log(err);
    }
  })

  .post('/:user/foodPosts', function (req: Request, res: Response) {
    try {
      if (!req.body) {
        res.status(400).send('Bad Request');
      }

      const foodItem = new FoodItem(req.body);
      foodItem.save(function (err) {
        if (err) res.status(400).send(err);
      });
      res.status(200).send('Posted');
    } catch (err) {
      res.status(500).send('Oops! Something went wrong');
    }
  })
  .put('/:user/foodPosts/:_id', function (req: Request, res: Response) {
    try {
      if (!req.body) {
        res.status(400).send('Bad Request');
      }

      const dish: IDish = req.body;
      FoodItem.updateOne({ _id: req.params._id }, dish).then(() =>
        res.status(200).send('Updated')
      );
    } catch (err) {
      res.status(500).send('Oops! Something went wrong');
    }
  })
  .delete('/:user/foodPosts/:_id', function (req: Request, res: Response) {
    try {
      if (!req.body) {
        res.status(400).send('Bad Request');
      }

      FoodItem.deleteOne({ _id: req.params._id }).then(() =>
        res.status(200).send('Deleted')
      );
    } catch (err) {
      console.log(err);
    }
  });
