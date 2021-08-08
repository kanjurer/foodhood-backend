import mongoose from 'mongoose';

import { IDish } from '../Interfaces';

const { Schema } = mongoose;

const foodItemSchema = new Schema<IDish>({
  madeByUser: {
    required: true,
    type: String,
    min: [3, 'Should be a minimum of 3 characters!'],
    max: [14, 'Only max of 14 characters allowed'],
  },
  cuisine: String,
  type: {
    required: true,
    type: String,
    enum: {
      values: ['Vegetarian', 'Non-Vegetarian', 'Vegan'],
      message: '{VALUE} is not supported',
    },
  },
  nameOfDish: {
    required: true,
    type: String,
    min: [3, 'Should be a minimum of 3 characters!'],
    max: [30, 'Only max of 30 characters allowed'],
  },
  ingredients: String,
  allergins: String,
  coverPhoto: String,
  priceInCad: {
    required: true,
    type: Number,
    min: [0.99, 'Minimum price should be 0.99$'],
    max: [49.99, 'Maximum price is 49.99'],
  },
  quantity: {
    required: true,
    type: Number,
    min: [1, 'Minimum quantity is 1!'],
  },
});

const FoodItem = mongoose.model<IDish>('foodItem', foodItemSchema, 'foodItems');
export default FoodItem;
