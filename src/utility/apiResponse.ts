import { Response } from "express";

export const apiResponse = (
  response: Response,
  message: string = "Request completed successfully",
  data?: unknown,
  statusCode: number = 200
) => {
  const response_message = {
    status: statusCode,
    message: message,
    data: data,
  };
  response.status(statusCode).send({ response_message });
};
