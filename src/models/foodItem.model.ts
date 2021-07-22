import mongoose from 'mongoose';

const { Schema } = mongoose;

const foodItemSchema = new Schema({
  madeByUser: String,
  cuisine: String,
  type: String,
  nameOfDish: String,
  ingredients: String,
  allergins: String,
  priceInCad: Number,
  quantity: Number,
  coverPhoto: String,
});

const FoodItem = mongoose.model('foodItem', foodItemSchema, 'foodItems');
module.exports = FoodItem;
