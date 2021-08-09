import mongoose from 'mongoose';

import { IOrderItem } from '../Interfaces';

const { Schema } = mongoose;

const orderItemSchema = new Schema<IOrderItem>({
  dateOfPurchase: {
    type: Date,
    required: true,
  },
});

const FoodItem = mongoose.model<IOrderItem>(
  'orderItem',
  orderItemSchema,
  'orderItems'
);
export default FoodItem;
