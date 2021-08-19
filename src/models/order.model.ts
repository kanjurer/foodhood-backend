import mongoose from 'mongoose';

import { IOrderItem } from '../Interfaces';
import { foodItemSchema } from './foodItem.model';

const { Schema } = mongoose;

const orderItemSchema = new Schema<IOrderItem>({
  dateOfPurchase: {
    type: Date,
    required: true,
  },
  orderByUser:{
    required: true,
    type: String,
    min: [3, 'Should be a minimum of 3 characters!'],
    max: [14, 'Only max of 14 characters allowed'],
  },
  purchasedItem: foodItemSchema
});

const FoodItem = mongoose.model<IOrderItem>(
  'orderItem',
  orderItemSchema,
  'orderItems'
);
export default FoodItem;
