import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";

import { User } from "../entity/User";
import { HttpException } from "../utility/HttpException";
import { dataSource } from "../config/settings";

export const auth = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader: string | undefined =
      request.headers.authorization;

    const token =
      authorizationHeader &&
      authorizationHeader.startsWith("Bearer") &&
      authorizationHeader.split(" ")[1];

    if (!token) {
      throw new HttpException(401, "Unauthenticated: No token on header.");
    }

    const secretKey = process.env.SECRET_JWT || "";
    // const verifyToken = <jwt.JwtPayload>jwt.verify(token, secretKey);

    jwt.verify(token, secretKey, async (err, verifyToken: any) => {
      if (err) {
        next(new HttpException(401, "Unauthenticated: Token expired."));
      }

      const user: any = await dataSource
        .getMongoRepository(User)
        .findOneBy({ id: verifyToken?.user_id });

      if (!user) {
        next(new HttpException(401, "Unauthenticated: Access denied."));
      }

      const { password, ...userDataWithoutPassword } = user;

      response.locals.user = userDataWithoutPassword;

      next();
    });
  } catch (error) {
    next(error);
  }
};

// Middleware to check if current user is an Admin or not
export const isAdmin = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const roleId: number = response.locals.user.role_id;

    if (roleId !== 2) {
      throw new HttpException(403, "Unauthorized for this action.");
    }

    next();
  } catch (error) {
    next(error);
  }
};
