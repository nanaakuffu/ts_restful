import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "../globals/baseRoute";
import ProductController from "../controllers/ProductController";
import { IProductController, myGlobal } from "../globals/interfaces";
import { Connection } from "typeorm";
import { auth } from "./../middlewares/auth";
import {
  createProductValidation,
  updateProductValidation,
} from "../inputValidations/productValidation";

export default class ProductRoutes extends BaseRoute {
  readonly productController: IProductController;
  public router!: Router;

  constructor(dbConnection: Connection) {
    super();
    this.productController = new ProductController(dbConnection);
    this.routes();
  }

  /**
   * routes
   */
  public routes = () => {
    this.router = Router();

    this.router
      .route("/")
      .get(auth, this.productController.getAllData)
      .post(auth, createProductValidation, this.productController.addNew)
      .all(this.methodNotAllowed);

    this.router
      .route("/:productId")
      .get(auth, this.productController.showData)
      .put(auth, updateProductValidation, this.productController.updateData)
      .delete(auth, this.productController.deleteData)
      .all(this.methodNotAllowed);
  };
}
