import { Router } from "express";
import { Connection } from "typeorm";

import { auth, isAdmin } from "../middlewares/auth";
import { UserController } from "../controllers/UserController";
import { BaseRoute } from "../globals/baseRoute";
import {
  changePasswordValidation,
  createUserValidation,
  loginValidation,
  updateUserValidation,
} from "../inputValidations/userValidation";
import { IUserController } from "../globals/interfaces";

class UserRoutes extends BaseRoute {
  readonly userController: IUserController;
  public router!: Router;

  constructor(dbConnection: Connection) {
    super();
    this.userController = new UserController(dbConnection);
    this.routes();
  }

  public routes(): void {
    this.router = Router();

    this.router
      .route("/login")
      .post(loginValidation, this.userController.loginUser)
      .all(this.methodNotAllowed);

    this.router
      .route("/change-password")
      .post(auth, changePasswordValidation, this.userController.changePassword)
      .all(this.methodNotAllowed);

    this.router
      .route("/users")
      .get(auth, isAdmin, this.userController.getAllUsers)
      .post(auth, createUserValidation, this.userController.createUser)
      .all(this.methodNotAllowed);

    this.router
      .route("/users/:user_id")
      .get(auth, this.userController.getUserInformation)
      .put(auth, updateUserValidation, this.userController.updateUser)
      .delete(auth, this.userController.deleteUser)
      .all(this.methodNotAllowed);
  }
}

export default UserRoutes;
