import { Connection, MongoRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

import { User } from "../entity/User";
import BaseController from "../globals/baseController";
import { IUserController } from "../globals/interfaces";
import { HttpException } from "../utility/HttpException";
import { configOptions } from "../config/settings";

export class UserController<
    A extends Request,
    B extends Response,
    C extends NextFunction
  >
  extends BaseController
  implements IUserController
{
  private userRepository: MongoRepository<User>;

  constructor(dbConnection: Connection) {
    super();
    this.userRepository = dbConnection.getMongoRepository(User);
  }

  public loginUser = async (
    request: A,
    response: B,
    next: C
  ): Promise<void> => {
    try {
      // Check validation
      this.checkValidation(request);

      const { email, password: userPassword } = request.body;

      // Find user by the email
      const user = await this.userRepository.findOneBy({ email: email });

      if (!user) {
        throw new HttpException(401, "Incorrect e-mail or password!");
      }

      // Check for password correctness
      const isPasswordMatching = await bcrypt.compare(
        userPassword,
        user.password
      );

      if (!isPasswordMatching) {
        throw new HttpException(401, "Incorrect e-mail or password!");
      }

      // If user matched with password assign a token for logging in
      const secretKey: string = process.env.SECRET_JWT || "";
      const token: string = jwt.sign({ user_id: user.id }, secretKey, {
        expiresIn: "24h",
      });

      // Provide a data for response without the password
      const { password, ...restOfData } = user;

      // Respond with the correct user details
      this.apiResponse(response, "Login successful", 200, {
        ...restOfData,
        token,
      });
    } catch (error) {
      // Send error to the error broker
      next(error);
    }
  };

  public changePassword = async (request: Request, response: B, next: C) => {
    try {
      this.checkValidation(request);

      const user = await this.userRepository.findOne(
        response.locals.user.user_id
      );

      if (!user) {
        throw new HttpException(401, "Unauthenticated.");
      }

      // Check for password correctness
      const passwordIsMatching = await bcrypt.compare(
        request.body.currentPassword,
        user.password
      );

      if (!passwordIsMatching) {
        throw new HttpException(401, "Incorrect password!");
      }

      if (request.body.newPassword) {
        request.body.newPassword = await bcrypt.hash(
          request.body.newPassword,
          8
        );
      }

      this.userRepository.update(user.id, {
        password: request.body.newPassword,
      });

      this.apiResponse(response, "Password changed successfully!", 200);
    } catch (error) {
      next(error);
    }
  };

  logOutUser(request: A, response: B, next: NextFunction): void {
    throw new Error("Method not implemented.");
  }

  public createUser = async (
    request: A,
    response: B,
    next: C
  ): Promise<void> => {
    try {
      this.checkValidation(request);

      if (request.body.password) {
        request.body.password = await bcrypt.hash(request.body.password, 8);
      }

      const userDataToSave = <User>request.body;

      await this.userRepository.save(userDataToSave);

      this.apiResponse(response, "User was created!", 201);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (
    request: A,
    response: B,
    next: NextFunction
  ): Promise<void> => {
    try {
      this.checkValidation(request);

      await this.userRepository.update(request.params.user_id, request.body);

      this.apiResponse(response, "User was successfully updated!", 200);
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (
    request: A,
    response: B,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.userRepository.delete(request.params.user_id);
      this.apiResponse(response, configOptions.SUCCESS_MESSAGE, 200);
    } catch (error) {
      next(error);
    }
  };

  public getAllUsers = async (
    request: A,
    response: B,
    next: C
  ): Promise<void> => {
    try {
      const users: Array<User> = await this.userRepository.find();

      const dataWithoutPassword = users.map((element) => {
        const { password, ...restOfData } = element;
        return restOfData;
      });

      this.apiResponse(
        response,
        configOptions.SUCCESS_MESSAGE,
        200,
        dataWithoutPassword
      );
    } catch (error) {
      next(error);
    }
  };

  public getUserInformation = async (
    request: A,
    response: B,
    next: C
  ): Promise<void> => {
    try {
      const user: User = (await this.userRepository.findOneBy({
        id: request.params.user_id,
      })) as User;

      const { password, ...restOfData } = user;

      this.apiResponse(
        response,
        configOptions.SUCCESS_MESSAGE,
        200,
        restOfData
      );
    } catch (error) {
      next(error);
    }
  };
}
