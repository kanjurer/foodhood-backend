import { Router, Request, Response } from 'express';
import { IDish, IFoodItem } from '../Interfaces';
const router = Router();
const FoodItem = require('../models/foodItem.model');

router
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
      const foodItem = new FoodItem({
        ...req.body,
        coverPhoto: req.file?.filename,
      });
      foodItem.save().then(() => res.send('Posted'));
    } catch (err) {
      console.log(err);
    }
  })
  .put('/:user/foodPosts/:_id', function (req: Request, res: Response) {
    try {
      const dish: IDish = req.body;
      FoodItem.updateOne({ _id: req.params._id }, dish).then(() =>
        res.send('Updated')
      );
    } catch (err) {
      console.log(err);
    }
  })
  .delete('/:user/foodPosts/:_id', function (req: Request, res: Response) {
    try {
      const dish: IDish = req.body;
      FoodItem.deleteOne({ _id: req.params._id }, dish).then(() =>
        res.send('Deleted')
      );
    } catch (err) {
      console.log(err);
    }
  });

module.exports = router;
