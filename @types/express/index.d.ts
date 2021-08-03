import { IUser } from '../../src/Interfaces';

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}
