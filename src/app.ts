import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import express, { Application, NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import ProductRoutes from "./routes/productRoutes";
import UserRoutes from "./routes/userRoutes";
import { configOptions, connectionOptions } from "./config/settings";
import { HttpException } from "./utility/HttpException";
import { IExpressApp } from "./globals/interfaces";
import { logServerAccess, logServerErrors } from "./utility/logger";
import { logger } from "./config/winston";

class App implements IExpressApp {
  public readonly app: Application;
  readonly apiUrl = configOptions.API_URL;

  constructor() {
    this.app = express();
    this.middlewares();
    this.databaseConnectionSetup();
  }

  private routes(connection: Connection) {
    // Product routes
    this.app.use(
      `${this.apiUrl}/products`,
      new ProductRoutes(connection).router
    );

    // User routes
    this.app.use(`${this.apiUrl}/auth`, new UserRoutes(connection).router);
  }

  private middlewares = (): void => {
    // Enable helmet to protect the api headers
    this.app.use(helmet());

    // Support application/json type post data
    this.app.use(express.json());

    // Support application/x-www-form-urlencoded post data
    this.app.use(express.urlencoded({ extended: false }));

    // Enable CORS
    this.app.use(
      cors({
        origin: "*",
      })
    );

    // Adding morgan to log http request
    // Log server access
    this.app.use(
      morgan("common", {
        stream: logServerAccess(__dirname + "/logs/access.log"),
      })
    );
    // Log requests to console
    this.app.use(morgan("common"));

    this.app.use(cookieParser());
  };

  private databaseConnectionSetup = async () => {
    await createConnection(connectionOptions)
      .then((connection) => {
        console.log("Database Connected");

        if (connection) {
          this.routes(connection);
          this.notFoundUrl();
          this.app.use(this.generalErrorHandler);
        }
      })
      .catch((error) => logger.error(`${error.name}: ${error.message}`));
  };

  private notFoundUrl = (): void => {
    this.app.all(
      "*",
      (request: Request, response: Response, next: NextFunction) => {
        next(new HttpException(404, `Url not found`));
      }
    );
  };

  private generalErrorHandler = (
    error: HttpError,
    request: Request,
    response: Response,
    next: NextFunction
  ): void => {
    let { status = 500, message, data } = error;

    logger.error(
      `${request.method} -- ${status} -- ${request.originalUrl} -- ${request.ip} -- ${error.message}`
    );

    // If status code is 500 - change the message to Intrnal server error
    // message = status === 500 || !message ? "Internal server error" : message;

    error = {
      type: error.name,
      method: request.method,
      url: request.url,
      status,
      message,
      ...(data && data),
    };

    response.status(status).send(error);
  };
}

const expressApp: IExpressApp = new App();

export default expressApp.app;
