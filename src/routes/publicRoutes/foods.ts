import { Router, Request, Response } from 'express';

import { IFoodItem } from '../../Interfaces';
import FoodItem from '../../models/foodItem.model';

const foods = Router();

export default foods
  .get('/', function (req: Request, res: Response) {
    try {
      FoodItem.find({}, function (err: Error, foodItems: IFoodItem[]) {
        if (err) {
          return res.status(404).send('Oh uh, something went wrong');
        }
        res.status(200).json(foodItems);
      });
    } catch (err) {
      res.status(500).send('Oops! Something went wrong');
    }
  })
  .get('/:foodId', function (req: Request, res: Response) {
    try {
      FoodItem.find(
        { _id: req.params.foodId },
        function (err: Error, foodItem: IFoodItem) {
          if (err) {
            return res.status(404).send('Oh uh, something went wrong');
          }
          res.status(200).json(foodItem);
        }
      );
    } catch (err) {
      res.status(500).send('Oops! Something went wrong');
    }
  });
