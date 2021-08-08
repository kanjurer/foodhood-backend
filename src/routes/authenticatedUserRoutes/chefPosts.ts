import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';

import { IDish, IFoodItem, IUser } from '../../Interfaces';
import FoodItem from '../../models/foodItem.model';

const chefPosts = Router();

chefPosts.use(isChef);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../tmp/food-cover-photos');
  },
  filename: function (req, file, cb) {
    cb(null, req.user?.username + '-' + Date.now() + '.jpg');
  },
});

const upload = multer({ storage: storage });

export default chefPosts
  .get('/', function (req: Request, res: Response) {
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

  .post(
    '/',
    upload.single('coverPhoto'),
    function (req: Request, res: Response) {
      if (!req.user) {
        return res.status(401).send('Req.user not found');
      }
      try {
        if (!req.body) {
          return res.status(400).send('Bad Request');
        }

        const dish: IDish = {
          ...req.body,
          coverPhoto: '/static/' + req.file?.filename, // see
          madeByUser: req.user.username,
        };
        const foodItem = new FoodItem(dish);

        foodItem.save(function (err) {
          if (err) {
            return res.status(400).send('Error saving the post');
          }
          res.status(200).send('Posted');
        });
      } catch (err) {
        res.status(500).send('Oops! Something went wrong');
      }
    }
  )

  .put(
    '/:_id',
    upload.single('coverPhoto'),
    function (req: Request, res: Response) {
      if (!req.user) {
        return res.status(401).send('Req.user not found');
      }
      try {
        if (!req.body) {
          return res.status(400).send('Bad Request');
        }

        const dish: IDish = {
          ...req.body,
          coverPhoto: '/static/' + req.file?.filename, // see
          madeByUser: req.user.username,
        };
        FoodItem.updateOne(
          { _id: req.params._id, madeByUser: (req.user as IUser).username },
          dish
        ).then(() => res.status(200).send('Updated'));
      } catch (err) {
        res.status(500).send('Oops! Something went wrong');
      }
    }
  )
  .delete('/:_id', function (req: Request, res: Response) {
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

// isChef function
function isChef(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).send('Req.user not found');
  }

  if (req.user.role !== 'chef') {
    return res.status(401).send('Not a chef');
  }

  next();
}
