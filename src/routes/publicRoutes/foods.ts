import { Router, Request, Response } from 'express';

import { IFoodItem, IDish } from '../../Interfaces';
import { paginationData } from '../../paginateData';
import FoodItem from '../../models/foodItem.model';

const foods = Router();

export default foods
  .get(
    '/',
    paginationData<IDish>(FoodItem),
    function (req: Request, res: Response) {
      if (req.paginatedResult) {
        console.log(req.paginatedResult.results);
        return res.status(200).json(req.paginatedResult.results);
      }
      return res.status(400).send('Ooopsie, data is invalid');
    }
  )
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
