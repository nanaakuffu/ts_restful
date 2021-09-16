"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const UserController_1 = require("../controllers/UserController");
const baseRoute_1 = require("../globals/baseRoute");
const userValidation_1 = require("../inputValidations/userValidation");
class UserRoutes extends baseRoute_1.BaseRoute {
    constructor(dbConnection) {
        super();
        this.userController = new UserController_1.UserController(dbConnection);
        this.router = express_1.Router();
        this.routes();
    }
    routes() {
        this.router.post("/login", userValidation_1.loginValidation, this.userController.loginUser);
        this.router.post("/change-password", auth_1.auth, userValidation_1.changePasswordValidation, this.userController.changePassword);
        this.router.get("/users", auth_1.auth, auth_1.isAdmin, this.userController.getAllUsers);
        this.router.post("/users", auth_1.auth, userValidation_1.createUserValidation, this.userController.createUser);
        this.router.get("/users/:user_id", auth_1.auth, this.userController.getUserInformation);
        this.router.put("/users/:user_id", auth_1.auth, userValidation_1.updateUserValidation, this.userController.updateUser);
        this.router.delete("/users/:user_id", auth_1.auth, this.userController.deleteUser);
    }
}
exports.default = UserRoutes;
//# sourceMappingURL=userRoutes.js.map