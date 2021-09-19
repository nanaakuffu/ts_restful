import { NextFunction, Request, Response } from "express";
import { Result, ValidationError, validationResult } from "express-validator";

import { HttpException } from "../utility/HttpException";
import { IController } from "./interfaces";

export default abstract class BaseController implements IController {
  public checkValidation = (request: Request): void => {
    const errorFormatter = ({
      location,
      msg,
      param,
      value,
    }: ValidationError) => {
      // Build your resulting errors however you want! String, object, whatever - it works!
      return { location, msg, value };
    };
    const errors = validationResult(request).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
      throw new HttpException(422, "Validation failed", errors.mapped());
    }
  };

  public apiResponse = (
    response: Response,
    message: string,
    statusCode: number = 200,
    data?: unknown
  ): void => {
    const response_message = {
      status: statusCode,
      message: message,
      data: data,
    };
    response.status(statusCode).send(response_message);
  };
}
