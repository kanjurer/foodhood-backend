export interface IUserFrontend {
  _id: string;
  username: string;
  nameOfUser: string;
  password: string;
  role: Role;
}

export interface IUser extends IUserFrontend {
  password: string;
}

export interface IDish {
  cuisine: string;
  type: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan';
  nameOfDish: string;
  ingredients: string;
  allergins: string;
  priceInCad: number;
  quantity: number;
}

export interface IFoodItem extends IDish {
  madeByUser: string;
  _id: string;
}

export interface ICartItem extends IFoodItem {
  buyQuantity: number;
}

export type Role = 'consumer' | 'chef';
