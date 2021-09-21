import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import express, { Application, NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import fileUpload from "express-fileupload";

import { connectionOptions } from "./config/settings";
import { HttpException } from "./utility/HttpException";
import { IApplicationError, IExpressApp } from "./globals/interfaces";
import { logServerAccess } from "./utility/logger";
import { logger } from "./config/winston";
import GeneralRouter from "./routes/web";

class ExpressApp implements IExpressApp {
  public readonly app: Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.databaseConnectionSetup();
  }

  private routes = (connection: Connection): void => {
    // Initialize the router class
    const generalRoutes = new GeneralRouter(connection, this.app);

    // Get all the routes from GeneaterRouter class
    generalRoutes.routes();
  };

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
      morgan("combined", {
        stream: logServerAccess(__dirname + "/logs/access.log"),
      })
    );
    // Log requests to console
    this.app.use(morgan("common"));

    this.app.use(cookieParser());

    // Allow file upload in the app
    this.app.use(
      fileUpload({
        limits: { fileSize: 1024 },
        abortOnLimit: true,
        limitHandler: (request, response, next) => {
          next(new HttpException(413, "File size exceeded limit."));
        },
        useTempFiles: true,
        tempFileDir: "./tmp",
      })
    );
  };

  private databaseConnectionSetup = async () => {
    await createConnection(connectionOptions)
      .then((connection) => {
        console.log("Database Connected");

        if (connection) {
          this.routes(connection);
          this.notFoundUrl();
          this.app.use(this.errorBroker);
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

  private errorBroker = (
    error: IApplicationError,
    request: Request,
    response: Response,
    next: NextFunction
  ): void => {
    let { status = 500, message, data } = error;

    if (status === 500) {
      logger.error(
        `${request.method} -- ${status} -- ${request.originalUrl} -- ${request.ip} -- ${error.message}`
      );
    }

    error = {
      name: error.name,
      method: request.method,
      url: request.url,
      status,
      message,
      data,
    };

    response.status(status).send(error);
  };
}

const expressApp: IExpressApp = new ExpressApp();

export default expressApp.app;
