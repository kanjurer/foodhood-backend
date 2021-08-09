import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';

export function paginationData<T>(model: Model<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.page == null || req.query.limit == null) {
      return res.status(400).send('Query and Page parameters not added!');
    }
    const page: number = parseInt(req.query.page as string);
    const limit: number = parseInt(req.query.limit as string);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let results: IResults<T> = { results: [] };
    if (endIndex < model.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec();
      req.paginatedResult = results;
      next();
    } catch (err) {
      return res.status(500).send('Oops! Something went wrong');
    }
  };
}

export function paginationChefData<T>(model: Model<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.page == null || req.query.limit == null) {
      return res.status(400).send('Query and Page parameters not added!');
    }
    const page: number = parseInt(req.query.page as string);
    const limit: number = parseInt(req.query.limit as string);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let results: IResults<T> = { results: [] };
    if (endIndex < model.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    if (!req.user) {
      return res.status(401).send('Req.user not found');
    }
    try {
      results.results = await model
        .find()
        .where({ madeByUser: req.user.username })
        .limit(limit)
        .skip(startIndex)
        .exec();
      req.paginatedResult = results;
      next();
    } catch (err) {
      return res.status(500).send('Oops! Something went wrong');
    }
  };
}

interface IResults<T> {
  results: T[];
  previous?: { page: number; limit: number };
  next?: { page: number; limit: number };
}
