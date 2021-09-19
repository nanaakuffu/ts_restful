import { NextFunction, Request, Response } from "express";
import { HttpException } from "../utility/HttpException";
import { IRoutes } from "./interfaces";

export abstract class BaseRoute implements IRoutes {
  public abstract routes(): void;

  protected methodNotAllowed = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    next(new HttpException(405, "Method not allowed"));
  };
}
