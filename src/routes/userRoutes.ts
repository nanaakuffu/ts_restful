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
  public router: Router;

  constructor(dbConnection: Connection) {
    super();
    this.userController = new UserController(dbConnection);
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.post("/login", loginValidation, this.userController.loginUser);
    this.router.post(
      "/change-password",
      auth,
      changePasswordValidation,
      this.userController.changePassword
    );
    this.router.get("/users", auth, isAdmin, this.userController.getAllUsers);

    this.router.post(
      "/users",
      auth,
      createUserValidation,
      this.userController.createUser
    );
    this.router.get(
      "/users/:user_id",
      auth,
      this.userController.getUserInformation
    );
    this.router.put(
      "/users/:user_id",
      auth,
      updateUserValidation,
      this.userController.updateUser
    );
    this.router.delete("/users/:user_id", auth, this.userController.deleteUser);
  }
}

export default UserRoutes;
