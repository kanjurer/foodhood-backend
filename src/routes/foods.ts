import { Router, Request, Response } from 'express';

const foods = Router();

import { IDish, IFoodItem } from '../Interfaces';
import FoodItem from '../models/foodItem.model';

export default foods.get('/', function (req: Request, res: Response) {
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
});
