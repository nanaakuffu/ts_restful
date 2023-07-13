import { User } from "entity/User";
import { Application, NextFunction, Request, Response } from "express";
import { Connection } from "typeorm";

export interface IExpressApp {
  app: Application;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  image_path: string;
  price: number;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
}

export interface AppRequest extends Request {
  currentUser: IUserInfo;
}

export interface IUserInfo {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  contact_number: string;
  role_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface IUser extends IUserInfo {
  password: string;
}

export interface IRoutes {
  routes(): void;
}

export interface IController {
  // dbConnection: Connection;
  checkValidation(request: Request, next: NextFunction): void;
  apiResponse(
    response: Response,
    message: string,
    statusCode: number,
    data?: unknown
  ): void;
}

export interface IProductController {
  addNew(request: Request, response: Response, next: NextFunction): void;
  getAllData(request: Request, response: Response, next: NextFunction): void;
  showData(request: Request, response: Response, next: NextFunction): void;
  updateData(request: Request, response: Response, next: NextFunction): void;
  deleteData(request: Request, response: Response, next: NextFunction): void;
}

export interface IUserController {
  loginUser(request: Request, response: Response, next: NextFunction): void;
  logOutUser(request: Request, response: Response, next: NextFunction): void;
  createUser(request: Request, response: Response, next: NextFunction): void;
  updateUser(request: Request, response: Response, next: NextFunction): void;
  deleteUser(request: Request, response: Response, next: NextFunction): void;
  getAllUsers(request: Request, response: Response, next: NextFunction): void;
  changePassword(
    request: Request,
    response: Response,
    next: NextFunction
  ): void;
  getUserInformation(
    request: Request,
    response: Response,
    next: NextFunction
  ): void;
}

// export interface myGlobal extends NodeJS.Global {
//   dbConnection: Connection;
// }

export interface IApplicationError {
  name: string;
  status: number;
  message: string;
  url: string;
  method: string;
  data?: unknown;
}
