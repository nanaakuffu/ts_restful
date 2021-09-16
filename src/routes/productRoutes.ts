import { Router } from "express";
import { BaseRoute } from "../globals/baseRoute";
import ProductController from "../controllers/ProductController";
import { IProductController, myGlobal } from "../globals/interfaces";
import { Connection } from "typeorm";

declare const global: myGlobal;

class ProductRoutes extends BaseRoute {
  readonly productController: IProductController;
  public router: Router;

  constructor(dbConnection: Connection) {
    super();
    this.productController = new ProductController(dbConnection);
    this.router = Router();
    this.routes();
  }

  /**
   * routes
   */
  public routes(): void {
    // Contact
    this.router.get("/", this.productController.getAllData);
    this.router.post("/", this.productController.addNew);
    this.router.get("/:contactId", this.productController.showData);
    this.router.put("/:contactId", this.productController.updateData);
    this.router.delete("/:contactId", this.productController.deleteData);
  }
}

export default ProductRoutes;
