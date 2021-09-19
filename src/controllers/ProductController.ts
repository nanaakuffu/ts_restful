import { Request, Response, NextFunction } from "express";
import { Connection, MongoRepository, Repository } from "typeorm";

import { IProductController } from "../globals/interfaces";
import BaseController from "../globals/baseController";
import { configOptions } from "../config/settings";
import Product from "../entity/Product";

class ProductController<
    A extends Request,
    B extends Response,
    C extends NextFunction
  >
  extends BaseController
  implements IProductController
{
  private productRepository: MongoRepository<Product>;

  constructor(dbConnection: Connection) {
    super();
    this.productRepository = dbConnection.getMongoRepository(Product);
  }

  public addNew = async (request: A, response: B, next: C): Promise<void> => {
    try {
      this.checkValidation(request);

      const userId = response.locals.user.id;
      request.body.created_by = userId;

      const newDataToSave = <Product>request.body;

      const product = await this.productRepository.save(newDataToSave);
      this.apiResponse(response, configOptions.SUCCESS_MESSAGE, 201, product);
    } catch (error) {
      next(error);
    }
  };

  public getAllData = async (
    request: A,
    response: B,
    next: C
  ): Promise<void> => {
    try {
      const products = await this.productRepository.find({
        relations: ["user"],
      });
      this.apiResponse(response, configOptions.SUCCESS_MESSAGE, 200, products);
    } catch (error) {
      next(error);
    }
  };

  public showData = async (request: A, response: B, next: C): Promise<void> => {
    try {
      const product = await this.productRepository.findOne(
        request.params.productId
      );

      this.apiResponse(response, configOptions.SUCCESS_MESSAGE, 200, product);
    } catch (error) {
      next(error);
    }
  };

  /**
   * updateData
   */
  public updateData = async (
    request: A,
    response: B,
    next: C
  ): Promise<void> => {
    try {
      this.checkValidation(request);

      const userId = response.locals.user.id;
      request.body.updated_by = userId;

      await this.productRepository.update(
        request.params.productId,
        request.body
      );

      this.apiResponse(response, configOptions.SUCCESS_MESSAGE, 200);
    } catch (error) {
      next(error);
    }
  };

  public deleteData = async (
    request: A,
    response: B,
    next: C
  ): Promise<void> => {
    try {
      this.productRepository.delete(request.params.productId);
      this.apiResponse(response, configOptions.SUCCESS_MESSAGE, 200);
    } catch (error) {
      next(error);
    }
  };
}

export default ProductController;
