import { Application, IRouter, Router } from "express";
import ProductRoutes from "./productRoutes";
import UserRoutes from "./userRoutes";
import { Connection } from "typeorm";
import { configOptions } from "../config/settings";
import { IRoutes } from "../globals/interfaces";

interface Routes {
  products: Application;
}

const apiUrl: string = configOptions.API_URL;
export const Routes = {};

export default class GeneralRouter<C extends Connection, A extends Application>
  implements IRoutes
{
  private readonly _dbConnection: C;
  private readonly _expressApp: A;

  constructor(connection: C, expressApp: A) {
    this._dbConnection = connection;
    this._expressApp = expressApp;
  }

  public routes = () => {
    // Product Routes
    this._expressApp.use(
      `${apiUrl}/products`,
      new ProductRoutes(this._dbConnection).router
    );

    // User routes
    this._expressApp.use(
      `${apiUrl}/auth`,
      new UserRoutes(this._dbConnection).router
    );
  };
}
